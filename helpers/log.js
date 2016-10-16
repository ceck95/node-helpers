/*
 * @Author: toan.nguyen
 * @Date:   2016-08-31 15:09:30
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-07 16:30:49
 */

'use strict';

const dataHelpers = require('./data');

class LogHelpers {

  /**
   * Constructor, set default log
   *
   * @param  {mixed} log Log handler
   */
  constructor(request) {
    if (typeof (request.log) === 'function') {
      this.log = request.log.bind(request);
    } else {
      this.log = request.log;
    }

  }

  /**
   * Convert arguments to string
   *
   * @return {String}
   */
  convertToString() {

    let msgs = new Array(arguments.length);
    for (let i = arguments.length - 1; i >= 0; i--) {
      let arg = dataHelpers.toDataString(arguments[i]);
      msgs.push(arg);
    }

    return msgs.join(' ');
  }

  /**
   * Print DEBUG log
   */
  debug() {
    if (typeof (this.log) === 'function') {

      let msg = this.convertToString(...arguments);
      return this.log(['debug'], msg);
    }

    if (this.log.debug) {
      return this.log.debug(...arguments);
    }

    return console.log(...arguments);
  }

  /**
   * Print INFO log
   */
  info() {
    if (typeof (this.log) === 'function') {
      let msg = this.convertToString(...arguments);
      return this.log(['info'], msg);
    }

    if (this.log.info) {
      return this.log.info(...arguments);
    }

    return console.log(...arguments);
  }

  /**
   * Print WARN log
   */
  warn() {
    if (typeof (this.log) === 'function') {
      let msg = this.convertToString(...arguments);
      return this.log(['warn'], msg);
    }

    if (this.log.warn) {
      return this.log.warn(...arguments);
    }

    return console.log(...arguments);
  }

  /**
   * Print WARN log
   */
  error() {
    if (typeof (this.log) === 'function') {
      let msg = this.convertToString(...arguments);
      return this.log(['error'], msg);
    }

    if (this.log.error) {
      return this.log.error(...arguments);
    }

    return console.log(...arguments);
  }
}

module.exports = LogHelpers;
