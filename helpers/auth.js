/*
 * @Author: toan.nguyen
 * @Date:   2016-05-08 23:18:07
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-05-08 23:38:07
 */

'use strict';

class AuthHelper {

  /**
   * Get basic header
   *
   * @param  {string} cfg Config object
   * @return {string}     Authorization Header
   */
  static getBasicHeader(cfg) {
    return 'Basic ' + new Buffer(cfg.clientId + ":" + cfg.clientSecret).toString('base64');
  }
}

module.exports = AuthHelper;
