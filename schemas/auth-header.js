/**
 * @Author: Tran Van Nhut <nhutdev>
 * @Date:   2017-02-25T11:31:00+07:00
 * @Email:  tranvannhut4495@gmail.com
* @Last modified by:   nhutdev
* @Last modified time: 2017-02-25T11:31:07+07:00
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
  }).keys(headerDevice).unknown(),
  mergeTokenBasicHeaders = Joi.object().keys({
    authorization: Joi.string().required().description('Format: Basic base64($client_id:$client_secret) or Format: Bearer $token'),
  }).keys(headerDevice).unknown();

module.exports = {
  auth: authHeaders,
  basic: basicHeaders,
  token: tokenHeaders,
  merge: mergeTokenBasicHeaders
};
