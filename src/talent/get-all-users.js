'use strict';

/**
 * @typedef {import('talentlms-sdk')} TalentLMSSdk
 */

let cachedUsers = null;

/**
 * @typedef GetAllUsersParams
 * @property {TalentLMSSdk} sdk SDK to use for accessing the TalentLMS api
 * @property {boolean=} cache If retrieved data should be cached. Default true. Set to "false"
 *  to generate a new cache if one is already set
 */

/**
 * Retrieves all users from the TalentLMS api and caches the data for quick retrieval
 *
 * @param {GetAllUsersParams} params
 */
const getAllUsers = async (params) => {
  const {sdk, cache = false} = params;

  // Reset the cache if we are asked
  if (!cache) {
    cachedUsers = null;
  } else if (cachedUsers) {
    // If we are using the cache, and one is available, just return that
    return cachedUsers;
  }

  // Get and store user data, then return
  cachedUsers = await sdk.user.all();
  return cachedUsers;
};

/**
 * Method will explicitly clear the existing cached users
 */
getAllUsers.clear = () => {
  cachedUsers = null;
};

module.exports = getAllUsers;
