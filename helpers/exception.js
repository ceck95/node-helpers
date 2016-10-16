/*
 * @Author: toan.nguyen
 * @Date:   2016-04-21 17:55:36
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-09 15:45:24
 */

'use strict';

const config = require('config');
const errorHelpers = require('./error');
const dataHelpers = require('./data');
const exceptionTypes = require('../gen-nodejs/exception_types');

class ExceptionHelper {

  /**
   * Constructor, set default params
   *
   * @param  {exceptionTypes} exceptionType Exception type
   */
  constructor(exTypes) {
    this.ttypes = exTypes || exceptionTypes;
  }

  /**
   * Convert postgres db exception to error object
   *
   * @param  {DBException} err Database error
   * @return {object}          Error object
   */
  fromPostgres(err) {

    var ex = new this.ttypes.DBException();
    ex.code = err.code;
    ex.message = err.detail;
    ex.constraint = err.constraint;
    ex.table = err.table;
    ex.schema = err.schema;
    ex.column = err.column;
    ex.dataType = err.dataType;
    ex.time = err.time;

    var exceptions = new this.ttypes.DBExceptions();
    exceptions.errors = [ex];

    return exceptions;
  }

  /**
   * Create exception from input params
   *
   * @param  {mixed} params Input params
   * @param  {object} options Extra options
   *
   * @return {DBExceptions}       List of database exceptions
   */
  create(params, options) {

    var self = this;
    options = options || {};
    var exceptions = new self.ttypes.DBExceptions();
    exceptions.errors = [];
    params = Array.isArray(params) ? params : [params];

    params.forEach(function(err) {
      var ex = new self.ttypes.DBException();

      ex.code = dataHelpers.toDataString(err.code) || '';
      ex.message = err.detail || err.message || '';
      ex.uiMessage = ex.uiMessage || errorHelpers.getUiMessage(ex.code) || ex.message;

      ex.source = err.column || err.source || '';


      ex.constraint = err.constraint || '';
      ex.table = err.table || options.table;
      ex.schema = err.schema || options.schema;

      ex.dataType = err.dataType;
      ex.time = err.time || new Date().toString();
      ex.host = options.host;
      if (!ex.host && config.has('server.host')) {
        ex.host = config.get('server.host');
      }
      ex.port = options.port;
      if (!ex.port && config.has('server.port')) {
        ex.port = config.get('server.port');
      }

      exceptions.errors.push(ex);
    });

    return exceptions;
  }
}

module.exports = {
  model: ExceptionHelper,
  instance: new ExceptionHelper()
};
