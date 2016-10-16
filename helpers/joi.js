/*
 * @Author: toan.nguyen
 * @Date:   2016-06-23 10:34:49
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-06-28 13:43:41
 */

'use strict';

const Joi = require('joi');
const errorHelpers = require('./error');
const ERROR_CODE = require('./error').CODE;

const customJoi = Joi.extend([{
  name: 'geo',
  language: {
    coordinates: errorHelpers.getMessage(ERROR_CODE.COORDINATES_INVALID),
  },
  rules: [{
    name: 'coordinates',
    validate(params, value, state, options) {

      var errorType = 'geo.coordinates',
        invalidArray = {
          code: ERROR_CODE.COORDINATES_INVALID,
          uiMessage: errorHelpers.getUiMessage(ERROR_CODE.COORDINATES_INVALID)
        };
      if (!Array.isArray(value) ? true : value.length !== 2) {
        return this.createError(
          errorType, invalidArray, state, options
        );
      } else if (!value[0] || !value[1]) {
        return this.createError(
          errorType, invalidArray, state, options
        );
      }

      return null; // Everything is OK
    }
  }]
}]);


module.exports = customJoi;
