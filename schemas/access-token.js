/*
 * @Author: toan.nguyen
 * @Date:   2016-08-08 22:52:16
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-08 22:53:12
 */

'use strict';

let Joi = require('joi');

let tokenResponse = Joi.object({
  accessToken: Joi.string(),
  tokenType: Joi.string(),
  expiresIn: Joi.number().integer(),
  refreshToken: Joi.string(),
});

module.exports = {
  response: tokenResponse
};
