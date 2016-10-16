/*
 * @Author: toan.nguyen
 * @Date:   2016-04-18 23:55:06
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-08 10:13:39
 */

'use strict';

var crypto = require('crypto');

class Stringer {

  /**
   * Converts input text to underscore
   *
   * @param  {string} input text
   * @return {string} underscore text
   */
  static toUnderscore(input) {
    return input.replace(/([A-Z])/g, "_$1").replace(/^_/, '').toLowerCase();
  }

  /**
   * Converts underscore or hyphens to camel case
   *
   * @param  {string} input input text
   *
   * @return {string}       camel case text
   */
  static underscoreToCamelCase(input) {
    return input.replace(/_([a-z])/g, function(g) {
      return g[1].toUpperCase();
    });
  }

  /**
   * Converts pascal case to camel case
   *
   * @param  {string} input input text
   *
   * @return {string}       camel case text
   */
  static pascalToCamelCase(input) {
    return input.substr(0, 1).toLowerCase() + input.substr(1);
  }

  /**
   * Converts camel case to pascal
   *
   * @param  {string} input input text
   *
   * @return {string}       camel case text
   */
  static camelCaseToPascal(input) {
    return input.substr(0, 1).toUpperCase() + input.substr(1);
  }

  /**
   * Converts input text to dash
   *
   * @param  {string} input text
   * @return {string} dashed text
   */
  static toDash(input) {
    return input.replace(/([A-Z])/g, "-$1").replace(/^-/, '').toLowerCase();
  }

  /**
   * Creates random string with base64 format
   *
   * @param  {int} len the length of result string
   *
   * @return {[string]}     random string
   */
  static randomBase64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
      .toString('base64') // convert to base64 format
      .slice(0, len) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'
  }

  /**
   * Generate random string with limited character scope
   *
   * @param  {Integer} len   String length
   * @param  {String} chars Character scope
   *
   * @return {String}       Outputed random chars
   */
  static randomChars(len, chars) {
    chars = chars || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(len),
      value = new Array(len),
      charLength = chars.length;

    for (var i = 0; i < len; i++) {
      value[i] = chars[rnd[i] % charLength];
    }

    return value.join('');
  }

  /**
   * Generate random number string
   *
   * @param  {Integer} len   String length
   * @param  {String} chars Character scope
   *
   * @return {String}       Outputed random number characters
   */
  static randomNumberChars(len) {
    return Stringer.randomChars(len, '0123456789');
  }

  /**
   * Generates random token
   *
   * @return {string} Random token string
   */
  static generateRandomToken() {

    var buffer = crypto.randomBytes(256);
    return crypto.createHash('sha1')
      .update(buffer)
      .digest('hex');
  }

  /**
   * Checks if input string is phone number
   *
   * @param  {string}  input Input string
   * @return {Boolean}       Is valid phone number
   */
  static isPhoneNumber(input) {
    return /^[0-9]+$/.test(input);
  }

  /**
   * Check if input string is email
   *
   * @param  {string}  input Input string
   *
   * @return {Boolean}       Is valid email
   */
  static isEmail(input) {
    var emailPattern = /[A-Z0-9\._%\+-]+@[A-Z0-9\.-]+\.[A-Z]{2,4}/igm;

    return emailPattern.test(input);
  }

  /**
   * Checks if value is string
   *
   * @param  {miexed}  input input value
   *
   * @return {Boolean}       Is value a string
   */
  static isString(input) {
    return Object.prototype.toString.call(input) === "[object String]";
  }
}

module.exports = Stringer;
