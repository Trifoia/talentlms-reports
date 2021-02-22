'use strict';

/**
 * @typedef {import('talentlms-sdk/src/classes/talent-opts')} TalentOpts
 */

const TalentLMSSdk = require('talentlms-sdk');

const types = {
  group: require('./src/types/group.js')
};

class TalentLMSReports {
  /**
   * Generates a new instance of the Talent LMS reporting engine
   * 
   * @param {TalentOpts} sdkOpts Options for instantiation of the talent sdk
   */
  constructor(sdkOpts) {
    this._sdk = new TalentLMSSdk(sdkOpts);
  }

  /**
   * @typedef GenerateParams
   * @property {('group')} type The type of report to generate. Other required parameters will
   *  differ depending on the provided type
   * @property {string=} groupId Id of the group to generate reports for. Used with the 'group'
   *  report type
   * @property {TalentLMSSdk=} sdk SDK to use for requests. Defaults to the sdk generated in
   *  construction of the TalentLMSReports object
   */

  /**
   * Generate a report
   * 
   * @param {GenerateParams} params Parameters for report generation
   */
  async generate(params) {
    params = Object.assign({}, params, {sdk: this._sdk});

    if (!types[params.type]) {
      throw new Error(`Invalid TalentLMS Report type "${params.type}". Expected ${Object.keys(types).join(' or ')}`);
    }

    return types[params.type](params);
  }
}

module.exports = TalentLMSReports;
