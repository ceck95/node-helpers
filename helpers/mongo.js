/*
 * @Author: toan.nguyen
 * @Date:   2016-05-11 07:16:52
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-06-06 16:40:52
 */

'use strict';

const Hoek = require('hoek');
const errors = require('./error');
// const stringer = require('./stringer');

class MongoHelper {

  /**
   * Translate Postgres error to Nexx error
   *
   * @param  {Object} err Postgre error object
   * @return {[type]}     [description]
   */
  static translateError(dest, err) {

    Hoek.assert(err, 'Error object must not be empty');

    switch (err.code) {
      default: dest.code = err.code;
    }

    dest.message = err.message;
    dest.uiMessage = errors.getMessage(dest.code) || dest.message;
    dest.source = '';

  }

}

module.exports = MongoHelper;
