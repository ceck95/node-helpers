/*
 * @Author: Chien Pham
 * @Date:   2016-06-25 12:46:02
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-08 20:53:52
 */

'use strict';

const Joi = require('joi');

let countryOption = Joi.object().keys({
  countryCode: Joi.string(),
  name: Joi.string(),
});

module.exports = {
  responseOption: countryOption
};
