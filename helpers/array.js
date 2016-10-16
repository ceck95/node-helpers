/*
 * @Author: toan.nguyen
 * @Date:   2016-07-27 18:07:33
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-27 18:10:42
 */

'use strict';

const Hoek = require('hoek');

class ArrayHelpers {

  /**
   * Checks if array is empty
   *
   * @param  {mixed  target Validated data
   *
   * @return {Boolean}
   */
  static isEmpty(target) {
    if (target === null || target === undefined) {
      return true;
    }

    if (Array.isArray(target)) {
      return target.length === 0;
    }

    Hoek.assert(false, 'Input data is not array format');
  }
}


module.exports = ArrayHelpers;
