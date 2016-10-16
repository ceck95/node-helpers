/*
 * @Author: toan.nguyen
 * @Date:   2016-05-20 16:51:55
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-05-20 16:55:37
 */

'use strict';

class MathHelper {

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  static decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  /**
   * Make round a number.
   *
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  static round(value, exp) {
    return MathHelper.decimalAdjust('round', value, exp);
  }

  /**
   * Make floor a number.
   *
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  static floor(value, exp) {
    return MathHelper.decimalAdjust('floor', value, exp);
  }

  /**
   * Make ceil a number.
   *
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  static ceil(value, exp) {
    return MathHelper.decimalAdjust('ceil', value, exp);
  }
}

module.exports = MathHelper;
