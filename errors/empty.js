/*
 * @Author: toan.nguyen
 * @Date:   2016-09-10 11:27:21
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-11 16:48:57
 */

'use strict';

const errorConst = require('./const');
const NexError = require('./error');
const errorHelpers = require('../helpers/error');

class EmptyError extends NexError {

  /**
   * Error Constructor
   *
   * @param  {Object} errors Error data
   */
  constructor(message) {
    let error = errorHelpers.createError(errorConst.ERROR_CODE.UNKNOWN, message);
    super(error);
  }
}

module.exports = EmptyError;
