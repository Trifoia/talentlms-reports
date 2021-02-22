'use strict';

/** @typedef {import('talentlms-sdk')} TalentLMSSdk */

const getAllUsers = require('../talent/get-all-users.js');
const getCourse = require('../talent/get-course.js');

/**
 * @typedef GroupParams
 * @property {string|number} groupId ID of the group to generate data for
 * @property {TalentLMSSdk} sdk SDK to use for accessing TalentLMS data
 * @property {boolean=} cache If the results of requests should be cached in session memory
 */

/**
 * Generates a report for an entire group
 * 
 * @param {GroupParams} params Group report generation parameters
 */
const group = async (params) => {
  const {groupId, sdk} = params;

  // Get users and group information
  const allUsers = await getAllUsers(params);
  const group = await sdk.group.retrieve(groupId);

  // Get info for each course in the group
  const courses = [];
  for (const course of group.courses) {
    const courseParams = Object.assign({}, params, {courseId: course.id});
    courses.push(await getCourse(courseParams));
  }

  // Generate report data!
  const reportData = group.users.map((user) => {
    const userDetail = allUsers.find(allUser => allUser.id === user.id);
    const reportDatum = {
      id: userDetail.id,
      email: userDetail.email,
      fullName: userDetail.first_name + ' ' + userDetail.last_name,
      createdOn: userDetail.created_on,
      lastLogin: userDetail.last_updated,
      courses: courses.map((course) => {
        const courseUserDetail = course.users.find(courseUser => courseUser.id === user.id);
        return {
          id: course.id,
          name: course.name,
          completionPercentage: courseUserDetail.completion_percentage,
          completedOn: courseUserDetail.completed_on
        };
      })
    };

    return reportDatum;
  });



  return reportData;
};

module.exports = group;
