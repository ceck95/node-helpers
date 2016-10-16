/*
 * @Author: toan.nguyen
 * @Date:   2016-09-10 10:47:33
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-11 16:47:02
 */

'use strict';

const Hoek = require('hoek');
const errorConst = require('./const');
const dataHelper = require('../helpers/data');

class NexError extends Error {

  /**
   * Error Constructor
   *
   * @param  {Object} errors Error data
   */
  constructor(errors) {

    let code = errorConst.ERROR_CODE.UNKNOWN,
      message = 'Unknown error';
    Hoek.assert(typeof(errors) === 'object', '`errors` must be array of object. Type: ' + typeof(errors) + '. Value: ' + errors);
    Hoek.assert(!dataHelper.isEmpty(errors), '`errors` must not be empty');

    if (Array.isArray(errors)) {
      Hoek.assert(typeof(errors) === 'object', '`errors` element must be a object');
      code = errors[0].code;
      message = errors[0].message;
    } else {
      code = errors.code;
      message = errors.message;
      errors = [errors];
    }

    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.errors = errors;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = NexError;
