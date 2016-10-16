/*
 * @Author: toan.nguyen
 * @Date:   2016-05-30 00:44:59
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-05 16:24:23
 */

'use strict';

const Hoek = require('hoek');
const Path = require('path');
const arrayHelpers = require('./array');

class LanguageHelper {

  /**
   * Constructor, initialize language dictionary
   *
   * @param  {Array} paths Resource file paths
   * @param  {Object} opts  Data options
   */
  constructor(paths, cfg) {

    cfg = cfg || {};

    let locales = cfg.locales;

    if (!locales) {
      let locale = cfg.locale || cfg.language;
      locales = [locale];
    }

    this._locales = locales;
    this._defaultLocale = cfg.defaultLocale || cfg.language || 'default';
    this._dictionary = {
      default: {}
    };

    paths = paths || [];

    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    let commonLanguagePath = Path.join(__dirname, '..', 'resources', 'locales', 'common');
    paths.push(commonLanguagePath);

    this.addResources(paths, cfg);
  }

  /**
   * Add dictionary resources to class instance
   *
   * @param  {Array} paths Resource file paths
   * @param  {Object} opts  Data options
   */
  addResources(paths, opts) {
    opts = opts || {};
    paths = paths || [];

    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    Hoek.assert(!arrayHelpers.isEmpty(paths), 'Resource path is empty, cannot add resource');

    let self = this,
      requireFunc = (path, locale) => {
        locale = locale || 'default';
        if (!self._dictionary[locale]) {
          self._dictionary[locale] = {};
        }

        try {
          let defaultPath = path,
            dict = require(defaultPath);
          Hoek.merge(self._dictionary[locale], dict, false, false);
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') {
            console.error('Resource path has not exists', path);
          } else {
            throw e;
          }
        }
      };

    paths.forEach(path => {
      // load default path
      requireFunc(path);

      self._locales.forEach(locale => {
        let localePath = path + '_' + locale;

        requireFunc(localePath, locale);
      });
    });
  }

  /**
   * Translate message to locale language
   *
   * @param  {String} message  Input message
   *
   * @return {String}          Translated message
   */
  translate(key, opts) {

    opts = opts || {};
    let message = '',
      locale = opts.locale || this._defaultLocale;

    if (this._dictionary[locale][key]) {
      message = this._dictionary[locale][key];
    } else {
      message = this._dictionary[this._defaultLocale][key];
    }

    if (!message && opts.defaultMessage) {
      message = opts.defaultMessage;
    }

    if (!message) {
      return '';
    }

    if (opts.params) {
      for (let key in opts.params) {
        message = message.replace('{{' + key + '}}', opts.params[key]);
      }
    }

    return message;
  }
}

module.exports = LanguageHelper;
