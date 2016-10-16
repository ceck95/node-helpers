/*
 * @Author: toan.nguyen
 * @Date:   2016-04-23 10:06:23
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-08 22:56:31
 */

'use strict';

let Joi = require('joi');

let errorResponse = Joi.object({
  errors: Joi.array().items(Joi.object({
    code: Joi.string(),
    source: Joi.string(),
    message: Joi.string(),
    uiMessage: Joi.string(),
  }))
});

module.exports = {
  response: errorResponse
};
