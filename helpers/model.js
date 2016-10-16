/*
 * @Author: toan.nguyen
 * @Date:   2016-04-19 10:16:58
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-23 17:18:24
 */

'use strict';

const Hoek = require('hoek');
const stringer = require('./stringer');
const dataHelpers = require('./data');

class ModelHelper {

  /**
   * Binds data to model
   *
   * @param  {object} dest   Destination model object
   * @param  {object} src    Source model object
   * @param {object} opts Overide if target value is null
   */
  static assignData(dest, src, opts) {

    Hoek.assert(dest, 'Target model must be a object and cannot be null');
    opts = opts || {};

    src = src || {};
    opts = Hoek.applyToDefaults({
      override: false,
      keepDest: false,
      excepts: [],
      attributes: [],
      prefix: null
    }, opts);

    var srcKey = '';

    Object.keys(dest).forEach((key) => {

      srcKey = opts.prefix ? (opts.prefix + '_' + key) : key;

      if (src.hasOwnProperty(srcKey) && opts.excepts.indexOf(key) === -1 && (opts.attributes.length > 0 ? opts.attributes.indexOf(key) > -1 : true)) {
        if (opts.override || (src[srcKey] || src[srcKey] === 0 || src[srcKey] === false)) {
          if (opts.keepDest) {
            if (!dest[key]) {

              dest[key] = src[srcKey];
            }
          } else {
            dest[key] = src[srcKey];
          }

        }

      } else {
        var underKey = stringer.toUnderscore(key);
        srcKey = opts.prefix ? (opts.prefix + '_' + underKey) : underKey;

        if (src.hasOwnProperty(srcKey) && opts.excepts.indexOf(key) === -1 && (opts.attributes.length > 0 ? opts.attributes.indexOf(key) > -1 : true)) {
          if (opts.override || (src[srcKey] || src[srcKey] === 0 || src[srcKey] === false)) {
            if (opts.keepDest) {
              if (!dest[key]) {

                dest[key] = src[srcKey];
              }
            } else {
              dest[key] = src[srcKey];
            }

          }
        }
      }

    });
  }

  /**
   * Binds underline data to model
   *
   * @param  {object} dest   Destination model object
   * @param  {object} src    Source model object
   * @param {object} opts Overide if target value is null
   */
  static assignUnderline(dest, src, opts) {
    Hoek.assert(dest, 'Target model must be a object and cannot be null');

    opts = opts || {};
    src = src || {};
    opts = Hoek.applyToDefaults({
      override: false,
      keepDest: false,
      excepts: [],
      attributes: [],
      prefix: ''
    }, opts);

    Object.keys(dest).forEach(function(key) {

      var underKey = stringer.toUnderscore(key),
        srcKey = opts.prefix ? (opts.prefix + '_' + underKey) : underKey;
      if (src.hasOwnProperty(srcKey) && opts.excepts.indexOf(key) === -1 && (opts.attributes.length > 0 ? opts.attributes.indexOf(key) > -1 : true)) {
        if (opts.override || (src[srcKey] || src[srcKey] === 0 || src[srcKey] === false)) {
          if (opts.keepDest) {

            if (!dest[key]) {

              dest[key] = src[srcKey];
            }
          } else {
            dest[key] = src[srcKey];
          }

        }
      }
    });
  }

  /**
   * Binds camelCase data to model
   *
   * @param  {object} dest   Destination model object
   * @param  {object} src    Source model object
   * @param {boolean} opts Overide if target value is null
   */
  static assignCamelCase(dest, src, opts) {
    Hoek.assert(dest, 'Target model must be a object and cannot be null');

    opts = opts || {};
    src = src || {};
    opts = Hoek.applyToDefaults({
      override: false,
      keepDest: false,
      excepts: [],
      attributes: [],
      prefix: ''
    }, opts);


    Object.keys(dest).forEach(function(key) {
      var srcKey = opts.prefix ? (opts.prefix + '_' + key) : key;
      if (src.hasOwnProperty(srcKey) && opts.excepts.indexOf(key) === -1 && (opts.attributes.length > 0 ? opts.attributes.indexOf(key) > -1 : true)) {

        if (opts.override || (src[srcKey] || src[srcKey] === 0 || src[srcKey] === false)) {
          if (opts.keepDest) {
            if (!dest[key]) {
              dest[key] = src[srcKey];
            }
          } else {
            dest[key] = src[srcKey];
          }

        }
      }
    });
  }

  /**
   * Convert model instance to plain object
   *
   * @param  {Class} model Model instance
   * @return {Object}       Plain object
   */
  static toObject(model, opts) {

    Hoek.assert(model, 'Input model must be a object and cannot be null');

    let obj = {};
    if (!opts) {
      Object.assign(obj, model);
      return obj;
    }

    opts = opts || {};
    opts.attributes = opts.attributes || [];
    opts.excepts = opts.excepts || [];
    if (opts.schema) {
      opts.attributes = ModelHelper.extractJoiAttributes(opts.schema);
    }

    if (opts.attributes ? opts.attributes.length > 0 : false) {
      opts.attributes.forEach((attr) => {

        let destKey = opts.isUnderline ? stringer.toUnderline(attr) : stringer.underscoreToCamelCase(attr);

        if (opts.excepts.indexOf(attr) !== -1 || opts.excepts.indexOf(destKey) !== -1) {
          return;
        }

        switch (model[attr]) {
          case undefined:
            break;
          case null:
            obj[destKey] = model[attr];
            break;
          default:
            switch (typeof(model[attr])) {
              case 'function':
                break;
              case 'object':
                if (Array.isArray(model[attr])) {
                  obj[destKey] = model[attr];
                } else if (dataHelpers.isDate(model[attr])) {
                  obj[destKey] = model[attr];
                } else {
                  if (!model[attr]) {
                    return;
                  }
                  obj[destKey] = model[attr].responseObject ? model[attr].responseObject() : ModelHelper.toObject(model[attr]);
                }
                break;
              default:
                obj[destKey] = model[attr];
                break;
            }
        }
      });
    } else {
      for (let key in model) {
        let destKey = opts.isUnderline ? stringer.toUnderline(key) : stringer.underscoreToCamelCase(key);

        if (opts.excepts.indexOf(key) !== -1 || opts.excepts.indexOf(destKey) !== -1) {
          continue;
        }

        if (model[key] === undefined) {
          continue;
        }
        switch (typeof(model[key])) {
          case 'function':
            break;
          case 'object':
            if (Array.isArray(model[key])) {
              obj[destKey] = model[key];
            } else if (dataHelpers.isDate(model[key])) {
              obj[destKey] = model[key];
            } else {
              if (!model[key]) {
                break;
              }
              obj[destKey] = model[key].responseObject ? model[key].responseObject() : ModelHelper.toObject(model[key]);
            }

            break;
          default:
            obj[destKey] = model[key];
            break;
        }
      }
    }

    return obj;
  }

  /**
   * Convert model instance to simple object
   * remove empty properties
   *
   * @param  {Class} model Model instance
   *
   * @return {Object}       Plain object
   */
  static toSimpleObject(model, opts) {

    Hoek.assert(model, 'Input model must be a object and cannot be null');

    let obj = {};

    opts = Hoek.applyToDefaults({
      excepts: [],
      attributes: [],
      isUnderline: false,
    }, opts || {});

    if (opts.schema) {
      opts.attributes = ModelHelper.extractJoiAttributes(opts.schema);
    }

    if (opts.attributes.length > 0) {
      opts.attributes.forEach((attr) => {

        let destKey = opts.isUnderline ? stringer.toUnderline(attr) : stringer.underscoreToCamelCase(attr);

        if (opts.excepts.indexOf(key) !== -1 || opts.excepts.indexOf(destKey) !== -1 || (!model[attr] && model[attr] !== 0 && model[attr] !== false)) {
          return;
        }

        switch (typeof(model[attr])) {
          case 'function':
            break;
          case 'object':
            if (Array.isArray(model[attr])) {
              obj[destKey] = model[attr];
            } else if (dataHelpers.isDate(model[attr])) {
              obj[destKey] = model[attr];
            } else {
              obj[destKey] = model[attr].responseObject ? model[attr].responseObject() : ModelHelper.toObject(model[attr]);
            }

            break;
          default:
            obj[destKey] = model[attr];
            break;
        }
      });
    } else {
      for (var key in model) {
        var destKey = opts.isUnderline ? stringer.toUnderline(key) : stringer.underscoreToCamelCase(key);

        if (opts.excepts.indexOf(key) !== -1 || opts.excepts.indexOf(destKey) !== -1 || (!model[key] && model[key] !== 0 && model[key] !== false)) {
          continue;
        }

        switch (typeof(model[key])) {
          case 'function':
            break;
          case 'object':
            if (Array.isArray(model[key])) {
              obj[destKey] = model[key];
            } else if (dataHelpers.isDate(model[key])) {
              obj[destKey] = model[key];
            } else {

              obj[destKey] = model[key].responseObject ? model[key].responseObject() : ModelHelper.toObject(model[key]);
            }
            break;
          default:
            obj[destKey] = model[key];
            break;
        }
      }
    }

    return obj;
  }

  /**
   * Diffs 2 object in same table schema
   *
   * @param  {object} row  Source data row
   * @param  {object} data Compared data
   * @param  {object} opts Option data
   *
   * @return {object}      Diff data
   */
  static diff(row, data, opts) {
    opts = opts || {};
    opts = Hoek.applyToDefaults({
      acceptNull: false,
      excepts: []
    }, opts);


    var results = {};
    for (var key in row) {
      var rowKey = key,
        dataKey = key,
        hasOwnProperty = data.hasOwnProperty(dataKey);

      if (!hasOwnProperty) {
        dataKey = stringer.underscoreToCamelCase(key);
        hasOwnProperty = data.hasOwnProperty(dataKey);
      }

      if (hasOwnProperty && typeof(data[dataKey]) !== 'object') {
        if (row[rowKey] != data[dataKey] && (opts.acceptNull ? true : (data[dataKey] || data[dataKey] === 0)) && (opts.excepts.indexOf(data[dataKey]) === -1)) {

          results[rowKey] = data[dataKey];
        }
      }
    }

    return results;
  }

  /**
   * Checks if attribute key is availble from options
   *
   * @param  {String} key  Property name
   * @param  {Object} opts Option data
   *
   * @return {Boolean}     Is key available or not
   */
  static checkAvailableKey(key, opts) {
    opts = Hoek.applyToDefaults({
      excepts: []
    }, opts || {});

    if (opts.excepts.indexOf(key) > -1) {
      return false;
    }

    if (opts.attributes) {
      return opts.attributes.indexOf(key) > -1;
    }

    return true;
  }

  /**
   * Extracts joi schema to attributes array keys
   *
   * @param  {Joi.Object} schema Joi object schema
   *
   * @return {Array}        Attribute keys
   */
  static extractJoiAttributes(schema) {

    Hoek.assert(schema.isJoi, 'Input schema is not a joi model');

    var attributes = [];

    schema._inner.children.forEach(el => {
      if (el.schema.isJoi) {
        attributes.push(el.key);

      }
    });

    return attributes;
  }
}

module.exports = ModelHelper;
