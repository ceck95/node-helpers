/*
 * @Author: Chien Pham
 * @Date:   2016-06-25 12:46:02
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-09 19:51:08
 */

'use strict';

const Joi = require('joi');

let provinceOption = Joi.object().keys({
  countryCode: Joi.string(),
  provinceCode: Joi.string(),
  displayName: Joi.string(),
});

module.exports = {
  responseOption: provinceOption
};
