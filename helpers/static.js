/*
 * @Author: toan.nguyen
 * @Date:   2016-05-14 10:55:41
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-05-17 06:38:47
 */

'use strict';

const config = require('config');

class StaticHelper {
  /**
   * Get static settings
   *
   * @param  {object} opts Input options
   *
   * @return {object}      Setting objects
   */
  static getSettings(opts) {

      opts = opts || {};
      var settings = opts;
      var cfgName = 'static.storage.' + (opts.name || 'default');
      settings = config.get(cfgName);

      return settings;
    }
    /**
     * Get absolute path of file name
     *
     * @param  {string} filePath File path
     * @param  {object} opts     Path Options
     *
     * @return {string}          absolute path
     */
  static getAbsolutePath(filePath, opts) {

    opts = opts || {};
    var settings = StaticHelper.getSettings(opts);

    var absPath = settings.absolutePath;
    if (settings.basePath) {
      absPath += settings.basePath;
    }
    if (absPath.substr(absPath.length - 1, 1) !== '/' && filePath.substr(0, 1) !== '/') {
      return absPath + '/' + filePath;
    }

    return absPath + filePath;
  }

  /**
   * Get absolute URL of file name
   *
   * @param  {string} filePath File path
   * @param  {object} opts     Path Options
   *
   * @return {string}          absolute URL
   */
  static getAbsoluteUrl(filePath, opts) {

    opts = opts || {};
    var settings = StaticHelper.getSettings(opts);

    var host = settings.host,
      port = settings.port,
      basePath = settings.basePath;

    var baseUrl = '';
    if (host) {
      baseUrl = host + (port ? (':' + port) : '');
    }

    if (basePath) {
      baseUrl += basePath;
    }

    if (filePath.substr(0, 1) === '/') {
      return baseUrl + filePath;
    }

    return baseUrl + '/' + filePath;
  }
}

module.exports = StaticHelper;
