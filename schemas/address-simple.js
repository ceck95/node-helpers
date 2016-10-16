/*
 * @Author: Chien Pham
 * @Date:   2016-06-25 12:46:02
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-01 23:20:23
 */

'use strict';

const Joi = require('joi');

var simpleAddressRequest = Joi.object().keys({
    uid: Joi.any(),
    address: Joi.any(),
    coordinates: Joi.array().items(Joi.number())
  }),
  simpleAddressResponse = simpleAddressRequest;

module.exports = {
  request: simpleAddressRequest,
  response: simpleAddressResponse
};
