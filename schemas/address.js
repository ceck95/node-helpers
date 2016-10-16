/*
 * @Author: toan.nguyen
 * @Date:   2016-05-24 22:35:12
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-04 19:13:34
 */

'use strict';

const Joi = require('joi');
const config = require('config');

const defaultCountry = config.has('i18n.country') ? config.get('i18n.country') : '';

let requestAddress = Joi.object({
    uid: Joi.any(),
    address: Joi.any(),
    ward: Joi.any(),
    district: Joi.any(),
    province: Joi.any(),
    country: Joi.any().default(defaultCountry),
    coordinates: Joi.array().items(Joi.number())
  }),
  responseAddress = Joi.object({

    uid: Joi.any(),
    userId: Joi.any(),
    address: Joi.any(),
    ward: Joi.any(),
    district: Joi.any(),
    province: Joi.any(),
    country: Joi.any(),
    coordinates: Joi.array().items(Joi.number()),
    status: Joi.any()
  }),
  requestFullAddress = Joi.object({
    uid: Joi.string().allow([null, '']),
    address: Joi.string().allow([null, '']),
    ward: Joi.string().allow([null, '']),
    wardCode: Joi.number(),
    district: Joi.string().allow([null, '']),
    districtCode: Joi.string().allow([null, '']),
    province: Joi.string().allow([null, '']),
    provinceCode: Joi.string().allow([null, '']),
    countryCode: Joi.string().allow([null, '']).default(defaultCountry),
    coordinates: Joi.array().items(Joi.number())
  }),
  responseFullAddress = Joi.object({
    uid: Joi.any(),
    address: Joi.any(),
    ward: Joi.any(),
    wardCode: Joi.number(),
    district: Joi.any(),
    districtCode: Joi.string(),
    province: Joi.any(),
    provinceCode: Joi.any(),
    countryCode: Joi.any().default(defaultCountry),
    coordinates: Joi.array().items(Joi.number())
  });

module.exports = {
  request: requestAddress,
  requestFull: requestFullAddress,
  response: responseAddress,
  responseFull: responseFullAddress,

};
