'use strict';

/**
 * @typedef {import('talentlms-sdk')} TalentLMSSdk
 */

let cachedCourses = {};

/**
 * @typedef GetCourseParams
 * @property {TalentLMSSdk} sdk SDK to use for accessing the TalentLMS api
 * @property {string|number} courseId ID of the course to retrieve data for
 * @property {boolean=} cache If retrieved data should be cached. Default true. Set to "false"
 *  to generate a new cache for the specific course if one is already set
 */

/**
 * Retrieves all users from the TalentLMS api and caches the data for quick retrieval
 *
 * @param {GetCourseParams} params
 */
const getCourse = async (params) => {
  const {sdk, courseId, cache = false} = params;

  // Reset the cache for this course if we are asked
  if (!cache) {
    delete cachedCourses[courseId];
  } else if (cachedCourses[courseId]) {
    // If we are using the cache, and one is available, just return that
    return cachedCourses[courseId];
  }

  // Get and store user data, then return
  cachedCourses[courseId] = await sdk.course.retrieve(courseId);
  return cachedCourses[courseId];
};

/**
 * Clear all cached data
 */
getCourse.clear = () => {
  cachedCourses = {};
};

module.exports = getCourse;
