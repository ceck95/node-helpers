/*
 * @Author: Chien Pham
 * @Date:   2016-06-25 12:46:02
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-09 19:51:19
 */

'use strict';

const Joi = require('joi');

let wardOption = Joi.object().keys({
  uid: Joi.number(),
  displayName: Joi.string(),
});

module.exports = {
  responseOption: wardOption
};
