/*
 * @Author: toan.nguyen
 * @Date:   2016-05-20 16:45:00
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-14 15:49:44
 */

'use strict';

const Hoek = require('hoek');
const MathHelper = require('./math');

class UnitHelper {

  /**
   * Converts length unit
   *
   * @param  {Number} value Input value
   * @param  {String} fromUnit From length unit
   * @param  {String} toUnit To length unit
   *
   * @return {Number}       Value in toUnit
   */
  static convertLength(value, fromUnit, toUnit) {
    if (!value) {
      return 0;
    }
    Hoek.assert(typeof (value) === 'number', 'Value must be in number type');

    var units = ['mm', 'cm', 'dm', 'm', 'dam', 'ha', 'km'],
      fromIndex = units.indexOf(fromUnit),
      toIndex = units.indexOf(toUnit);

    Hoek.assert(fromIndex > -1, 'fromUnit must not be empty');
    Hoek.assert(toIndex > -1, 'toUnit must not be empty');

    var sub = fromIndex - toIndex;

    return value * Math.pow(10, sub);
  }

  /**
   * Convert value in time unit
   *
   * @param  {Number} value Input value
   * @param  {String} fromUnit From length unit
   * @param  {String} toUnit To length unit
   *
   * @return {Number}       Value in kilometre
   */
  static convertTime(value, fromUnit, toUnit) {
    if (!value) {
      return 0;
    }
    Hoek.assert(typeof (value) === 'number', 'Value must be in number type');

    if (fromUnit === toUnit) {
      return value;
    }

    var units = [{
      key: 's',
      value: 60
    }, {
      key: 'm',
      value: 60
    }, {
      key: 'h',
      value: 24
    }, {
      key: 'd',
      value: 30
    }, {
      key: 'M',
      value: 12
    }];

    var i,
      fromIndex = -1,
      toIndex = -1,
      result = value;

    for (i = units.length - 1; i >= 0; i--) {
      if (units[i].key === fromUnit) {
        fromIndex = i;
      }
      if (units[i].key === toUnit) {
        toIndex = i;
      }

      if (fromIndex > -1 && toIndex > -1) {
        break;
      }
    }

    Hoek.assert(fromIndex > -1, 'fromUnit must not be empty');
    Hoek.assert(toIndex > -1, 'toUnit must not be empty');

    if (fromIndex < toIndex) {
      for (i = fromIndex; i < toIndex; i++) {
        result /= units[i].value;
      }
    } else {
      for (i = fromIndex; i > toIndex; i--) {
        result *= units[i].value;
      }
    }

    return result;
  }

  /**
   * Converts metre to kilometre
   *
   * @param  {Number} value Input value
   *
   * @return {Number}       Value in kilometre
   */
  static metreToKilometre(value) {
    if (!value) {
      return 0;
    }
    var result = value / 1000;

    return MathHelper.round(result, -1);
  }

  /**
   * Converts kilometre to metre
   *
   * @param  {number} value Input value
   *
   * @return {number}       Value in metre
   */
  static kilometreToMetre(value) {
    if (!value) {
      return 0;
    }

    return value * 1000;
  }
}

module.exports = UnitHelper;
