/*
 * @Author: toan.nguyen
 * @Date:   2016-04-21 05:36:26
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-13 15:22:44
 */

'use strict';

const errorDict = require('./error');
const uriHelper = require('./uri');
const hoek = require('hoek');

class Json {

  /**
   * Parse json text to json object
   *
   * @param  {mixed} input  Json text of object
   *
   * @return {object}       Parsed Json object
   */
  static parse(input) {
    if (!input) {
      return {};
    }

    try {
      if (typeof (input) === 'string') {
        return JSON.parse(input);
      }
    } catch (e) {
      // statements
      console.error('Cannot parse JSON string', input);
      return {};
    }

    return input;
  }

  /**
   * Converts Joi validation type to code
   *
   * @param  {string} type Joi validation type
   * @return {string}      Nexx error codes
   */
  static joiTypeToCode(type) {
    var result = '999';
    switch (type) {
    case 'any.required':
      result = '100';
      break;
    case 'string.min':
      result = '101';
      break;
    case 'string.max':
      result = '102';
      break;
    case 'string.alphanum':
      result = '108';
      break;
    }

    return result;
  }

  /**
   * Convert Joi errors to JsonAPI errors
   *
   * @param  {array} errors Joi error data
   * @return {array}        JsonApi error data
   */
  static joiToJson(errors) {
    hoek.assert(errors, 'Input joi errors is empty');
    var result = new Array(errors.length);
    for (var i = 0; i < errors.length; i++) {
      var code = this.joiTypeToCode(errors[i].type);
      var obj = {
        code: code,
        source: errors[i].path,
        message: errorDict.getMessage({
          '{{field}}': errors[i].path
        }),
        uiMessage: errorDict.getUiMessage(code, {
          '{{field}}': errors[i].path
        }) || errors[i].message
      };

      result[i] = obj;
    }

    return {
      errors: result
    };
  }

  /**
   * Converts Postgres error code to Json errors
   *
   * @param  {DBException} error Database exception
   * @return {object}            Nexx error object
   */
  static postgresTypeToCode(code) {
    if (!code) {
      return null;
    }

    var result = '999';
    switch (code) {
    case '23505':
      result = '201';
      break;
    }

    return result;
  }

  /**
   * Convert Postgres errors to JsonAPI errors
   *
   * @param  {array} errors Postgres error data
   * @return {array}        JsonApi error data
   */
  static postgresToJson(errors) {
    hoek.assert(errors, 'Input joi errors is empty');
    var results = [];

    if (!Array.isArray(errors)) {
      errors = [errors];
    }

    errors.forEach(function (err) {
      var result = {
        code: err.code,
        message: err.message,
        uiMessage: errorDict.getMessage(err.code),
        source: err.source
      };

      results.push(result);
    });

    return {
      errors: results
    };
  }

  static response(request, data) {
    var responseData = {};
    if (!data) {
      responseData = {
        data: {},
        meta: {},
        links: {}
      };
    } else {
      responseData.data = data.data || {};
      responseData.meta = data.meta || {};
      responseData.links = data.links || {};
      if (data.token) {
        responseData.token = data.token;
      }
    }
    if (!responseData.links.current) {
      responseData.links.current = uriHelper.getCurrentUri(request);
    }

    return responseData;
  }
}

module.exports = Json;
