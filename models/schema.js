/*
 * @Author: toan.nguyen
 * @Date:   2016-04-27 04:47:17
* @Last modified by:   nhutdev
* @Last modified time: 2017-02-25T11:32:53+07:00
 */

'use strict';

const Joi = require('joi');
const addressSchema = require('../schemas/address');

const authHeaderSchemas = require('../schemas/auth-header');
const accessTokenSchemas = require('../schemas/access-token');
const errorSchema = require('../schemas/error');
const errors = require('../schemas/errors');

let schema = {
  authHeaders: authHeaderSchemas.auth,
  basicHeaders: authHeaderSchemas.basic,
  tokenHeaders: authHeaderSchemas.token,
  mergeHeaders: authHeaderSchemas.merge,
  accessToken: accessTokenSchemas.response,

  request: {
    address: addressSchema.request,

    user: Joi.object({
      displayName: Joi.string().min(3).max(64),
      email: Joi.any(),
      phoneNumber: Joi.string().regex(/^[0-9]{10,15}$/),
      gender: Joi.string(),
      password: Joi.string().min(5).max(255),
      dateOfBirth: Joi.number(),

    }).requiredKeys(['displayName', 'phoneNumber', 'password']),
    profile: Joi.object({
      uid: Joi.any(),
      displayName: Joi.any(),
      email: Joi.any(),
      phoneNumber: Joi.any(),
      gender: Joi.any(),
      dateOfBirth: Joi.any(),
      avatar: Joi.any(),
      avatarThumbnail: Joi.any(),
      address: addressSchema.request
    })
  },
  response: {

    address: addressSchema.response,

    user: Joi.object({
      uid: Joi.string(),
      firstName: Joi.any(),
      lastName: Joi.any(),
      displayName: Joi.any(),
      email: Joi.any(),
      phoneNumber: Joi.string(),
      gender: Joi.any(),
      dateOfBirth: Joi.any(),
    }),
  },
  error: errorSchema.response,
  errors: errors
};

module.exports = schema;
