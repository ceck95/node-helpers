/*
 * @Author: toan.nguyen
 * @Date:   2016-04-30 13:40:00
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-14 17:57:00
 */

'use strict';

const Hoek = require('hoek');
const config = require('config');
const moment = require('moment');
const momentTimezone = require('moment-timezone');


class DataHelper {

  /**
   * Converts local phone to international phone number
   *
   * @param  {string} phoneNumber Input phone number
   * @param  {string} countryCode Country code
   *
   * @return {string}             international phone number
   */
  static internationalPhoneNumber(phoneNumber, countryCode) {
    Hoek.assert(phoneNumber, 'Phone number must not be empty');
    Hoek.assert(countryCode, 'Country code must not be empty');

    let phoneCode = require('../resources/phone-codes')[countryCode];

    return this.applyPhoneCode(phoneNumber, phoneCode);
  }

  /**
   * Converts local phone to international phone number
   *
   * @param  {string} phoneNumber Input phone number
   * @param  {string} countryCode Country code
   *
   * @return {string}             international phone number
   */
  static applyPhoneCode(phoneNumber, phoneCode) {
    Hoek.assert(phoneNumber, 'Phone number must not be empty');
    Hoek.assert(phoneCode, 'Phone code must not be empty');

    if (phoneNumber.substr(0, phoneCode.length) === phoneCode) {
      return phoneNumber;
    }

    if (phoneNumber.substr(0, 1) === '0') {
      return phoneCode + phoneNumber.substr(1);
    }

    return phoneCode + phoneNumber;
  }

  /**
   * Converts local phone to international phone number
   *
   * @param  {string} phoneNumber Input phone number
   * @param  {string} countryCode Country code
   *
   * @return {string}             international phone number
   */
  static removePhoneCode(phoneNumber, phoneCode) {
    Hoek.assert(phoneNumber, 'Phone number must not be empty');
    Hoek.assert(phoneCode, 'Phone code must not be empty');

    if (phoneNumber.substr(0, 1) === '0') {
      return phoneNumber;
    }

    let codeLength = phoneCode.length,
      inputCode = phoneNumber.substr(0, codeLength);

    Hoek.assert(inputCode === phoneCode, 'Invalid phone code', inputCode, 'Phone number:', phoneNumber);

    return '0' + phoneNumber.substr(codeLength);
  }

  /**
   * Converts international phone number to locale phone number
   *
   * @param  {string} phoneNumber Input international phone number
   * @param  {string} countryCode Country code
   *
   * @return {string}             phone number
   */
  static localePhoneNumber(phoneNumber, countryCode) {
    Hoek.assert(phoneNumber, 'Phone number must not be empty');
    Hoek.assert(countryCode, 'Country code must not be empty');

    let phoneCode = require('../resources/phone-codes')[countryCode];

    return this.removePhoneCode(phoneNumber, phoneCode);
  }

  /**
   * Get key by value
   *
   * @param  {object} obj   Input object
   * @param  {mixed} value  Query value
   *
   * @return {string}       Object key
   */
  static getKey(obj, value) {
    for (var key in obj) {
      if (obj[key] == value) {
        return key;
      }
    }
  }

  /**
   * Check if input object is empty
   *
   * @param  {Object}  obj Input object
   *
   * @return {Boolean}     Is empty object
   */
  static isEmpty(obj) {
    if (!obj) {
      return true;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    return Object.keys(obj).length === 0;
  }

  /**
   * Convert date time to string
   *
   * @param  {mixed} input    Input date time value
   * @param  {String} format  Date format
   * @param  {Date} defaultValue Default value
   *
   * @return {String}         Date time string with format
   */
  static toDateString(input, format, defaultValue) {

    var defaultFunc = () => {
      if (defaultValue === null) {
        return null;
      }
      if (!defaultValue) {
        return '';
      }
    };

    if (!input) {

      if (!defaultValue) {
        return defaultFunc();
      }

      input = defaultValue;
    }

    try {

      var date = moment(input);
      if (!date.isValid()) {
        console.log('Invalid date format', input);
        return null;
      }
      return format ? date.format(format) : date.format();
    } catch (e) {
      // statements
      console.log(e);
      return defaultFunc();
    }

  }

  /**
   * Convert date time to string
   *
   * @param  {mixed} input    Input date time value
   * @param  {String} format  Date format
   * @param  {Date} defaultValue Default value
   *
   * @return {String}         Date time string with format
   */
  static toUtcString(input, format, defaultValue) {

    var defaultFunc = () => {
      if (defaultValue === null) {
        return null;
      }
      if (!defaultValue) {
        return '';
      }
    };

    if (!input) {

      if (!defaultValue) {
        return defaultFunc();
      }

      input = defaultValue;
    }

    try {

      var date = moment(input);
      if (!date.isValid()) {
        console.log('Invalid date format', input);
        return null;
      }
      return format ? date.utc().format(format) : date.toISOString();
    } catch (e) {
      // statements
      console.log(e);
      return defaultFunc();
    }

  }

  /**
   * Converts to moment object with timezone
   *
   * @param  {mixed} input         Input data
   * @param  {String} format       Date time format
   * @param  {String} defaultValue Default value
   * @param  {String} timezone     Timezone string
   *
   * @return {String}              datetime string with timezone
   */
  static toMomentTimezone(input, timezone) {

    if (!input) {
      return false;
    }

    if (!timezone) {
      if (config.has('i18n.timezone')) {
        timezone = config.get('i18n.timezone');
      }
    }

    let date = moment(input);

    if (timezone) {
      date = date.tz(timezone);
    }

    return date;
  }

  /**
   * Converts to date string with timezone
   *
   * @param  {mixed} input         Input data
   * @param  {String} format       Date time format
   * @param  {String} defaultValue Default value
   * @param  {String} timezone     Timezone string
   *
   * @return {String}              datetime string with timezone
   */
  static toDateStringWithTimezone(input, format, defaultValue, timezone) {

    var defaultFunc = () => {
      if (defaultValue === null) {
        return null;
      }
      if (!defaultValue) {
        return '';
      }
    };

    if (!input) {

      if (!defaultValue) {
        return defaultFunc();
      }

      input = defaultValue;
    }

    if (!timezone) {
      if (config.has('i18n.timezone')) {
        timezone = config.get('i18n.timezone');
      }
    }

    var date = moment(input);

    if (timezone) {
      date = date.tz(timezone);
    }

    return format ? date.format(format) : date.format();
  }

  /**
   * Parse value into integer
   *
   * @param  {mixed} input Input value
   * @param  {Integer} defaultValue Default value
   *
   * @return {number}      Returns number as int
   */
  static parseInt(input, defaultValue) {

    defaultValue = defaultValue || 0;
    if (!input) {
      return defaultValue;
    }

    switch (typeof (input)) {
    case 'number':
      return input;
    default:
      return parseInt(input);
    }
  }

  /**
   * Parse value into date object
   *
   * @param  {mixed} input Input value
   * @param  {mixed} defaultValue Default value
   *
   * @return {number}      Returns date object
   */
  static parseDate(input, defaultValue) {

    if (this.isEmpty(input)) {
      return defaultValue;
    }

    if (this.isDate(input)) {
      return input;
    }

    return new Date(input);
  }

  /**
   * Convert date to timestamp number in milisecond
   *
   * @param  {mixed} input         Input value
   * @param  {mixed} defaultValue  Default value
   *
   * @return {number}              Response timestamp
   */
  static toTimestamp(input, defaultValue) {
    defaultValue = defaultValue || 0;

    if (input === null || input === undefined) {
      return defaultValue;
    }

    try {
      switch (typeof (input)) {
      case 'string':
        var date = new Date(input);
        return date.getTime();
      case 'number':
        return input;
      case 'object':
        // if current object is Date object
        if (typeof input.getMonth === 'function') {
          return input.getTime();
        }

        return 0;
      default:
        return 0;
      }
    } catch (e) {
      // statements
      console.log(e);
      return 0;
    }
  }

  /**
   * Convert value to string
   *
   * @param  {mixed} input    Input date time value
   * @param  {String} format  Date format
   * @param  {Date} defaultValue Default value
   *
   * @return {String}         Date time string with format
   */
  static toDataString(input, defaultValue) {
    defaultValue = defaultValue || '';

    if (input === null || input === undefined) {
      return defaultValue;
    }


    switch (typeof (input)) {
    case 'string':
      return input;
    case 'number':
      return input.toString();
    case 'object':
      // if current object is Date object
      if (typeof input.getMonth === 'function') {
        return DataHelper.toDateString(input, 'isoDateTime', defaultValue);
      }

      try {
        return JSON.stringify(input);
      } catch (e) {
        // statements
        console.error('Cannot stringify input object to json string:', input);
        return '';
      }
      break;
    default:
      return '';
    }
  }

  /**
   * Check if 2 array is equal
   *
   * @param  {Array}  array1 Array data 1
   * @param  {Array}  array2 Array data 2
   *
   * @return {Boolean}       Are 2 array equal
   */
  static isArrayEqual(array1, array2) {

    Hoek.assert(Array.isArray(array1), 'Array 1 is not array type');
    Hoek.assert(Array.isArray(array2), 'Array 2 is not array type');

    return (array1.length == array2.length) && array1.every(function (element, index) {
      return element === array2[index];
    });
  }

  /**
   * Checks if input object is date object
   *
   * @param  {Mixed}  obj Validated object
   *
   * @return {Boolean}
   */
  static isDate(obj) {
    if (!obj) {
      return false;
    }

    if (typeof (obj) !== 'object') {
      return false;
    }
    return typeof obj.getMonth === 'function';
  }

  /**
   * Checks input value is numeric
   *
   * @param  {mixed}  n   Input number
   *
   * @return {Boolean}
   */
  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

module.exports = DataHelper;
