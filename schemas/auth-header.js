/*
 * @Author: toan.nguyen
 * @Date:   2016-08-08 22:46:11
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-11 17:59:30
 */

'use strict';

const Joi = require('joi');

let headerDevice = {
  Platform: Joi.string().description('Device platform, e.g: Android/iOS'),
  OS: Joi.string().description('Operation System version, e.g: 9.3'),
  Version: Joi.string().description('Application version, e.g: 1.0'),
  DeviceToken: Joi.string().description('Unique token of device'),
  advertisingId: Joi.string().description('Advertising ID'),
};

let authHeaders = Joi.object({
    authorization: Joi.string().required().description('Format: Basic base64($client_id:$client_secret)'),
  }).unknown(),
  basicHeaders = Joi.object().keys({
    authorization: Joi.string().required().description('Format: Basic base64($client_id:$client_secret)'),
  }).keys(headerDevice).unknown(),
  tokenHeaders = Joi.object({
    authorization: Joi.string().required().description('Format: Bearer $token'),
  }).keys(headerDevice).unknown();

module.exports = {
  auth: authHeaders,
  basic: basicHeaders,
  token: tokenHeaders
};
