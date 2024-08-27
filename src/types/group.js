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
 * @typedef GroupReturns
 * @property {object} group Group info from TalentLMS
 * @property {object[]} results Report results per user
 * @property {object=} error Error info. Only present if there was an error
 */

/**
 * Generates a report for an entire group. Returns an object with group and result info. If there
 * is an error generating the reports, an object will be returned with an `error` property with
 * details of the issue
 *
 * @param {GroupParams} params Group report generation parameters
 * @returns {GroupReturns} Report results
 */
const group = async (params) => {
  const {groupId, sdk} = params;

  // Get users and group information
  const allUsers = await getAllUsers({...params});
  const group = await sdk.group.retrieve(groupId);

  // Check for group retrieval error
  if (group.error) return group;

  // Get info for each course in the group
  const courses = [];
  for (const course of group.courses) {
    const courseParams = Object.assign({}, params, {courseId: course.id});
    courses.push(await getCourse(courseParams));
  }

  // Generate report data!
  const results = group.users.map((user) => {
    const userDetail = allUsers.find(allUser => allUser.id === user.id);

    if (!userDetail) {
      throw new Error(`Could not get details for user ID: "${user.id}". Report generation failed`);
    }

    const reportDatum = {
      id: userDetail.id,
      email: userDetail.email,
      fullName: userDetail.first_name + ' ' + userDetail.last_name,
      createdOn: userDetail.created_on,
      lastLogin: userDetail.last_updated,
      groupName: group.name,
      courses: courses.map((course) => {
        const courseUserDetail = (course.users || []).find(courseUser => courseUser.id === user.id) ||
          // Use a basic object if the user can't be found in the course
          {
            completion_percentage: '0',
            completed_on: '',
          }
        ;
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

  return {group, results};
};

module.exports = group;
