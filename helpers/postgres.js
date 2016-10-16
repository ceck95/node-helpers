/*
 * @Author: toan.nguyen
 * @Date:   2016-05-11 07:16:52
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-29 11:42:51
 */

'use strict';

const Hoek = require('hoek');
const errors = require('./error');

class PostgresHelper {

  /**
   * Get error codes
   *
   * @param  {mixed} err Error object
   *
   * @return {string}   Error code
   */
  static getErrorCode(err) {
    Hoek.assert(err, 'Error must not be empty');

    let code = typeof(err) === 'object' ? err.code : err;

    switch (code) {
      case '23505':
        return '201';
      case '23502':
        return '203';
      default:
        return code;
    }

  }


  /**
   * Translate Postgres error to Nexx error
   *
   * @param  {Object} err Postgre error object
   * @return {[type]}     [description]
   */
  static translateError(err, errorHelper) {
    Hoek.assert(err, 'Error object must not be empty');

    errorHelper = errorHelper || errors;
    let code = PostgresHelper.getErrorCode(err);
    let result = {
      code: code,
      message: err.detail || err.message || '',
      uiMessage: errorHelper.getUiMessage(code) || err.message,
      source: err.column || err.source || ''
    };

    return result;
  }

}

module.exports = PostgresHelper;
