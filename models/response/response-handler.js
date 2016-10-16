/*
 * @Author: toan.nguyen
 * @Date:   2016-06-16 11:16:04
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-25 19:06:33
 */

'use strict';

const Hoek = require('hoek');
const arrayHelpers = require('../../helpers/array');
const modelHelpers = require('../../helpers/model');
const errorHelpers = require('../../helpers/error');
const dataHelpers = require('../../helpers/data');

class ResponseHandler {

  /**
   * Constructor, set default data
   *
   * @param  {Object} resp      Response data
   * @param  {Object} errorDict Error dictionay
   */
  constructor(resp, errorDict) {

    errorDict = errorDict || errorHelpers;

    this.requestId = '';
    this.errorCode = 0;
    this.message = '';
    this.uiMessage = '';

    if (!resp) {
      return;
    }


    if (Array.isArray(resp)) {
      let err = errorDict.translate(resp);
      this._bindError(err);
    } else if (typeof(resp) === 'object') {
      if (resp.errorCode === null || resp.errorCode === undefined) {
        if (resp.data) {
          this.data = resp.data || {};
        } else {
          let err = errorDict.translate(resp);
          this._bindError(err);
        }

      } else if (resp.errorCode == '0') {
        this.data = resp.data || {};
      } else {
        this.errorCode = resp.errorCode;
        this.message = resp.message || '';
        this.uiMessage = resp.uiMessage || errorDict.getUiMessage(resp.errorCode) || resp.message;
      }
    }
  }

  _bindError(err) {
    if (arrayHelpers.isEmpty(err.errors)) {
      return;
    }

    modelHelpers.assignData(this, err.errors[0]);
    this.errorCode = err.errors[0].code || 0;
  }

  /**
   * Translates error from db exception
   *
   * @param  {Object} data      DBExceptions object
   * @param  {Error} errorDict  Error dictionary
   */
  _fromDBException(data, errorDict) {

    var err = data.errors[0];

    this.errorCode = dataHelpers.toDataString(err.code) || '';
    this.message = err.detail || err.message || '';
    this.uiMessage = err.uiMessage || errorDict.getUiMessage(err.code) || err.message;

  }

  _fromJoiError(errors, errorDict) {

    Hoek.assert(errors, 'Input joi errors is empty');

    var err = errors.details[0],
      code = errorDict.joiTypeToCode(err.type);

    this.errorCode = code;
    this.message = err.message;

    this.uiMessage = err.context.uiMessage;

    var params = {
      '{{field}}': err.path
    };

    if (!this.message) {
      this.message = errorDict.getMessage(err.code, params);
    }

    if (!this.uiMessage) {
      this.uiMessage = errorDict.getUiMessage(err.code, params);
    }
  }

  /**
   * Converts response data to object
   *
   * @return {Object} Response object data
   */
  toObject() {
    var errorCode = dataHelpers.parseInt(this.errorCode, 0);

    var resp = {
      errorCode: errorCode
    };

    for (var key in this) {
      if (this[key]) {
        resp[key] = this[key];
      }
    }

    return resp;
  }

  /**
   * Response Error object
   *
   * @param  {Object} error     Error data
   * @param  {Object} errorDict Error Dictionary
   *
   * @return {Object}           Error object
   */
  static response(error, errorDict) {

    var resp = new ResponseHandler(error, errorDict);

    return resp.toObject();
  }
}

module.exports = ResponseHandler;

module.exports.response = ResponseHandler.response;
