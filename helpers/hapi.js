/*
 * @Author: toan.nguyen
 * @Date:   2016-07-22 13:33:32
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-29 17:25:09
 */

'use strict';

const Hoek = require('hoek');
const errorHelpers = require('./error');

var httpCodes = {};
httpCodes[errorHelpers.CODE.NOT_FOUND] = 404;
httpCodes[errorHelpers.CODE.INTERNAL] = 500;

class HAPIHelpers {

  /**
   * [replyError description]
   * @param  {[type]} request [description]
   * @param  {[type]} reply   [description]
   * @param  {[type]} errors  [description]
   * @param  {[type]} opts    [description]
   * @return {[type]}         [description]
   */
  static replyError(request, reply, err, opts) {

    opts = Hoek.applyToDefaults({
      type: null,
      log: null
    }, opts || {});

    let codes = Hoek.clone(httpCodes);

    if (opts.codes) {
      Hoek.merge(codes, opts.codes);
    }


    let errors = errorHelpers.translate(err),
      code = errorHelpers.getCode(errors);

    if (opts.log) {
      if (errorHelpers.isNexxError(code)) {
        request.log(opts.log, errors);
      } else {
        request.log(opts.log, err);
      }

    }

    switch (code) {
    case errorHelpers.CODE.INTERNAL:
      return reply(errors).code(codes[code]);
    case errorHelpers.CODE.NOT_FOUND:
      return reply(errors).code(codes[code]);
    default:
      return reply(errors).code(500);
    }
  }
}

module.exports = HAPIHelpers;
