/*
 * @Author: toan.nguyen
 * @Date:   2016-09-10 11:27:21
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-10 08:47:42
 */

'use strict';

const errorConst = require('./const');
const NexError = require('./error');
const errorHelpers = require('../helpers/error');

class PermissionError extends NexError {

  /**
   * Error Constructor
   *
   * @param  {String} uiMessage UI message
   */
  constructor(uiMessage) {
    let error = errorHelpers.createError(errorConst.ERROR_CODE.PERMISSION, uiMessage);
    super(error);
  }
}

module.exports = PermissionError;
