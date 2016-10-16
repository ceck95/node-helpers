/*
 * @Author: toan.nguyen
 * @Date:   2016-05-14 12:23:16
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-18 15:36:05
 */

'use strict';
const fs = require('fs');
const config = require('config');
const staticHelper = require('./static');
const stringer = require('./stringer');

class FileHelper {

  /**
   * Generate random file name to avoid conflicting
   *
   * @param  {string} filename original filename
   *
   * @return {string}          return file name
   */
  static generateRandomName(filename, opts) {

    opts = opts || {};
    let nameParts = [];

    let randomLength = config.has('static.randomLength') ? config.get('static.randomLength') : 18;

    if (opts.prefix) {
      nameParts.push(opts.prefix);
    }

    if (opts.userId) {
      nameParts.push(opts.userId);
    }

    nameParts.push(stringer.randomChars(randomLength));

    if (opts.ext) {
      return nameParts.join('_') + '.' + opts.ext;
    }

    let parts = filename.split('.');

    if (parts.length === 1) {
      return nameParts.join('_');
    }

    return nameParts.join('_') + '.' + parts[parts.length - 1];
  }

  /**
   * Upload file into server
   *
   * @param  {string} path Destination file path
   * @param  {object} file Request files
   * @param  {object} opts Optional options
   *
   * @return {function}    Upload callback
   */
  static uploadFile(request, opts, callback) {

    let settings = staticHelper.getSettings(opts);

    switch (settings.type) {
      default:
      // write local file
        return FileHelper.writeFileLocal(request, callback, opts, settings);

    }
  }

  /**
   * Write data into
   * @param  {object}   request  Request object
   * @param  {Function} callback Callback function, with error and result data:
   *                    {string} path: written file path
   *                    {string} url:  result URL file
   * @param  {object}   opts     Optional data
   * @param  {object}   settings Setting object
   */
  static writeFileLocal(request, callback, opts, settings) {

    let payload = request.payload;
    let filename = payload.file.hapi.filename;
    let newFilename = FileHelper.generateRandomName(filename, opts);
    let path = opts.path ? opts.path : '';
    let filePath = path + '/' + newFilename;
    let absPath = staticHelper.getAbsolutePath(filePath, settings);
    let absUrl = staticHelper.getAbsoluteUrl(filePath, settings);

    let file = fs.createWriteStream(absPath);

    file.on('error', (err) => {
      request.log(['error', 'upload', 'write-local'], err);

      return callback(err);
    });

    payload.file.pipe(file);

    file.on('finish', (err) => {

      if (err) {
        request.log(['error', 'upload', 'write-local'], err);
        return callback(err);
      }

      let ret = {
        relPath: path,
        absPath: absPath,
        url: absUrl,
        name: newFilename
      };


      return callback(null, ret);
    });
  }
}

module.exports = FileHelper;
