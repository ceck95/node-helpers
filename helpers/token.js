/*
 * @Author: toan.nguyen
 * @Date:   2016-04-23 15:58:08
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-06-21 16:05:20
 */

'use strict';

const Hoek = require('hoek');
const config = require('config');
const stringer = require('./stringer');


class TokenHelper {

  /**
   * Create bearer access token
   *
   * @param {boolean} hasRefreshToken Does return refresh token
   *
   * @return {object} Token object
   */
  static createBearerToken(opts) {

    opts = Hoek.applyToDefaults({
      hasRefreshToken: false
    }, opts || {});

    if (!opts.expiry) {
      opts.expiry = config.get('oauth2.expiry');
    }

    var token = {
      accessToken: stringer.generateRandomToken(),
      tokenType: "bearer",
      expiresIn: opts.expiry,
    };

    if (opts.hasRefreshToken) {
      token.refreshToken = stringer.generateRandomToken();
    }

    return token;
  }
}

module.exports = TokenHelper;
