/*
 * @Author: toan.nguyen
 * @Date:   2016-04-23 10:06:23
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-04-27 04:25:39
 */

'use strict';

var Joi = require('joi');

module.exports.schema = Joi.object({
  errors: Joi.array().items(Joi.object({
    code: Joi.string(),
    source: Joi.string(),
    message: Joi.string(),
    uiMessage: Joi.string(),
  }))
});
