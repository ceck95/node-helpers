/*
 * @Author: toan.nguyen
 * @Date:   2016-04-21 05:52:29
* @Last modified by:   nhutdev
* @Last modified time: 2016-11-11T14:27:01+07:00
 */

'use strict';

const Hoek = require('hoek');
const config = require('config');
const BPromise = require('bluebird');

const Log = require('./log');
const dataHelpers = require('./data');
const arrayHelpers = require('./array');
const postgresHelpers = require('./postgres');

const ERROR_CODE = {
  COORDINATES_INVALID: '120',
  NOT_FOUND: '202',
  UNKNOWN: '999',
  INTERNAL: '1000'
};

class ErrorHelper {

  /**
   * Constructor. Load error resources
   *
   * @param  {String} path Error path
   * @param  {Object} opts Option data
   */
  constructor(paths, opts) {

    opts = opts || {};

    // load default error resources
    var defaultPath = __dirname + '/../resources/errors/errors';

    if (opts.locale) {
      this.locale = opts.locale;
    } else if (config.has('i18n.language')) {
      opts.locale = config.get('i18n.language');
      this.locale = opts.locale;
    } else {
      this.locale = 'default';
    }

    paths = paths || [];
    if (!Array.isArray(paths)) {
      paths = [paths];
    }
    paths.push(defaultPath);

    this.errors = this.errors || {};
    this.addResources(paths, opts);

  }

  /**
   * Add dictionary resources to class instance
   *
   * @param  {Array} paths Resource file paths
   * @param  {Object} opts  Data options
   */
  addResources(paths, opts) {

    opts = opts || {};

    var self = this,
      locale = opts.locale;
    if (!locale) {
      locale = config.has('i18n.language') ? ('_' + config.get('i18n.language')) : '';
    } else {
      locale = '_' + opts.locale;
    }

    // imports extra paths
    if (paths) {
      paths.forEach(function(path) {
        var defaultPath = opts.basePath ? (opts.basePath + '/' + path) : path,
          localePath = opts.basePath ? (opts.basePath + '/' + path + locale) : (path + locale),
          dict = require(localePath),
          defaultDict = require(defaultPath);

        self.errors.default = self.errors.default || {};
        self.errors[opts.locale] = self.errors[opts.locale] || {};
        Hoek.merge(self.errors.default, defaultDict, false, false);
        Hoek.merge(self.errors[opts.locale], dict, false, false);
      });
    }
  }

  /**
   * Get Error code from error object
   *
   * @param  {Object} err
   * @return {[type]}     [description]
   */
  getCode(err) {

    var sCode = ERROR_CODE.INTERNAL;
    if (!err) {
      return ERROR_CODE.INTERNAL;
    }

    if (Array.isArray(err)) {
      sCode = err[0].code || ERROR_CODE.INTERNAL;
    } else if (typeof(err) === 'object') {
      if (err.errors) {
        sCode = err.errors[0].code || ERROR_CODE.INTERNAL;
      } else if (err.code) {
        sCode = err.code;
      }
    }

    if (typeof(sCode) !== 'string') {
      sCode = sCode.toString();
    }

    return sCode;
  }

  /**
   * Get message from error code
   *
   * @param  {string} code Error code
   * @param {Object} params Param values
   *
   * @return {string}      Message of input code
   */
  getMessage(code, params) {

    var sCode = dataHelpers.toDataString(code);
    var message = this.errors.default[sCode];

    if (!message) {
      return '';
    }

    if (params) {
      for (var key in params) {
        message = message.replace(key, params[key]);
      }
    }

    return message;
  }

  /**
   * Get message from error code
   *
   * @param  {string} code Error code
   * @param {Object} params Param values
   *
   * @return {string}      Message of input code
   */
  getUiMessage(code, params) {

    var sCode = dataHelpers.toDataString(code);
    var message = this.errors[this.locale][sCode];

    if (!message) {
      return '';
    }

    if (params) {
      for (var key in params) {
        message = message.replace(key, params[key]);
      }
    }
    return message;
  }

  /**
   * Translate errors data into error response
   *
   * @param  {mixed} errs Error data
   *
   * @return {object}     Errors object
   */
  translate(errs) {

    let self = this;

    let systemErrorFunc = () => {
      console.error(errs);

      return {
        errors: self.unknownError({
          message: errs.toString()
        })
      };
    };

    if (Array.isArray(errs)) {
      return {
        errors: errs
      };
    } else if (typeof(errs) === 'string') {
      return {
        errors: [
          self.unknownError({
            message: errs
          })
        ]
      };
    } else if (typeof(errs) === 'object') {
      if (errs.isJoi) {
        return this.fromJoi(errs);
      } else if (errs.code) {
        let error = this.createErrorObject(errs.code, errs);
        return {
          errors: [error]
        };
      } else if (errs.errors) {
        switch (errs.name) {
          case 'nexx.exceptions.DBExceptions':
            return self.fromDBExceptions(errs);
          default:
            return errs;
        }
      } else if (errs instanceof Error) {
        return systemErrorFunc();
      } else if (errs instanceof RangeError) {
        return systemErrorFunc();
      } else if (errs instanceof ReferenceError) {
        return systemErrorFunc();
      } else if (errs instanceof SyntaxError) {
        return systemErrorFunc();
      } else if (errs instanceof TypeError) {
        return systemErrorFunc();
      }
    } else {
      return systemErrorFunc();
    }

    return errs;
  }

  /**
   * Translate errors data into json response
   *
   * @param  {mixed} errs Error data
   *
   * @return {string}     Json errors string
   */
  serialize(errs) {
    var errors = this.translate(errs);
    return JSON.stringify(errors);
  }

  /**
   * Convert to error response data from From DB Exception
   *
   * @param  {DBExceptions} exceptions
   *
   * @return {object}       Error object
   */
  fromDBExceptions(exceptions) {
    let errors = [];

    if (exceptions ? !exceptions.errors : true) {
      return {
        errors: [{
          code: ERROR_CODE.UNKNOWN,
          message: JSON.stringify(exceptions),
          uiMessage: this.getUiMessage(ERROR_CODE.UNKNOWN),
          source: ''
        }]
      };
    }

    exceptions.errors.forEach((element) => {
      let err = postgresHelpers.translateError(element, this);
      errors.push(err);
    });

    return {
      errors: errors
    };
  }

  /**
   * Create error object from code
   *
   * @param  {String} code Error code
   * @param  {Object} opts Optional data
   *
   * @return {Object}      Common error object
   */
  createError(code, opts) {
    return [this.createErrorObject(code, opts)];
  }



  /**
   * Creates not found error
   *
   * @param  {string} source Source reason of error
   *
   * @return {Array} Errors list
   */
  notFound(source, params) {
    source = source || 'uid';
    var code = '202';

    var err = this.createError(code, {
      source: source,
      params: params
    });

    return err;
  }

  /**
   * Create error object from code
   *
   * @param  {String} code Error code
   * @param  {Object} opts Optional data
   *
   * @return {Object}      Common error object
   */
  createErrorObject(code, opts) {

    Hoek.assert(code, 'Empty error code');

    opts = opts || {};
    let optionType = typeof(opts);
    switch (optionType) {
      case 'string':
        opts = {
          uiMessage: opts
        };
        break;
      case 'object':
        break;
      default:
        throw new Error('Invalid options data type: ' + optionType);
    }

    let message = opts.message || this.getMessage(code, opts.params),
      uiMessage = opts.uiMessage || this.getUiMessage(code, opts.params),
      source = opts.source || '';

    return {
      code: code,
      message: message,
      uiMessage: uiMessage,
      source: source
    };
  }

  /**
   * Creates empty error
   *
   * @param  {object} opts Error options
   *
   * @return {Array} Errors list
   */
  emptyError(opts) {

    var code = '203';
    var err = this.createError(code, opts);

    return err;
  }

  /**
   * Unknown error
   *
   * @param  {object} opts Error options
   *
   * @return {Array} Errors list
   */
  unknownError(opts) {

    var code = '999';
    var err = this.createError(code, opts);
    return err;

  }

  /**
   * Cannot connect to remote server error
   *
   * @param  {object} opts Error options
   *
   * @return {Array} Errors list
   */
  disconnectedError(opts) {

    var code = '400';
    var err = this.createError(code, opts);
    return err;
  }

  /**
   * Check if error exception is nexx error
   *
   * @param  {mixed}  exception Input Exception
   *
   * @return {Boolean}           is nexx error?
   */
  isNexxError(exception) {

    var isError = (code) => {
      try {
        var iCode = 0;
        switch (typeof(code)) {
          case 'string':
            iCode = parseInt(code);
            break;
          case 'number':
            iCode = code;
            break;
          default:
            return false;
        }

        return iCode > 0 && iCode < 999;

      } catch (e) {
        // statements
        console.log('Unknow error code', e);
        return false;
      }
    };

    var code = '-1';
    if (typeof(exception) === 'string') {
      return isError(exception);
    } else if (Array.isArray(exception)) {
      code = exception[0].code;
      return isError(code);
    } else if (typeof(exception) === 'object') {
      if (exception.errors) {
        code = exception.errors[0].code;
        return isError(code);
      }
    }

    return false;
  }

  /**
   * Translate Postgres error to Nexx error
   *
   * @param  {Object} err Postgres error object
   * @param  {Object} dest Destination object
   *
   * @return {Object}     Error object
   */
  static fromPostgres(err, dest) {

    dest = dest || {};
    Hoek.assert(err, 'Error object must not be empty');

    switch (err.code) {
      case '23505':
        dest.code = '201';
        break;
      case '23502':
        dest.code = '203';
        break;
      default:
        dest.code = err.code;
    }

    dest.message = err.detail || err.message || '';
    dest.uiMessage = this.getUiMessage(dest.code) || dest.message;
    dest.source = err.column || err.source || '';

    return dest;

  }

  /**
   * Converts Joi validation type to code
   *
   * @param  {string} type Joi validation type
   * @return {string}      Nexx error codes
   */
  joiTypeToCode(type) {

    var result = '999';

    switch (type) {
      case 'any.empty':
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
      case 'geo.coordinates':
        result = ERROR_CODE.COORDINATES_INVALID;
        break;
    }

    return result;
  }

  /**
   * Convert Joi errors to JsonAPI errors
   *
   * @param  {array} errors Joi error data
   *
   * @return {array}        JsonApi error data
   */
  fromJoi(errors) {

    Hoek.assert(errors, 'Input joi errors is empty');

    let result = new Array(errors.details.length),
      index = 0;

    errors.details.forEach((err) => {
      let code = this.joiTypeToCode(err.type),
        obj = {
          code: code,
          source: err.path,
          message: err.message,
          uiMessage: this.getUiMessage(code, {
            '{{field}}': err.path
          }) || err.message
        };

      result[index++] = obj;
    });

    return {
      errors: result
    };
  }

  /**
   * Check empty input data
   *
   * @param  {mixed}   input    Input data
   * @param  {Object}   opts    Option data
   *
   * @return {Boolean}           Is input empty
   */
  checkEmpty(inputs, opts) {

    let self = this;

    if (typeof(inputs) !== 'object') {
      Hoek.assert(Array.isArray(inputs), 'Input values must be a objet or array');
    }

    if (!Array.isArray(inputs)) {
      inputs = [inputs];
    }

    opts = opts || {};
    let log = new Log(opts.log);

    return new BPromise((resolve, reject) => {

      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];

        if (input.value !== null && input.value !== undefined) {
          switch (typeof(input.value)) {
            case 'object':
              if (Array.isArray(input.value) ? !arrayHelpers.isEmpty(input.value) : !dataHelpers.isEmpty(input.value)) {
                continue;
              }
              break;
            default:
              continue;
          }
        }

        let message = input.message,
          source = input.source;

        log.warn(message);

        let err = self.emptyError({
          message: message,
          source: source
        });

        return reject(err);
      }
      return resolve();
    });

  }
}

module.exports = new ErrorHelper();
module.exports.CODE = ERROR_CODE;

module.exports.Error = ErrorHelper;
