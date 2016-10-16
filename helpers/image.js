/*
 * @Author: toan.nguyen
 * @Date:   2016-05-15 16:59:24
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-20 14:17:24
 */

'use strict';


const Hoek = require('hoek');
const sharp = require('sharp');
const BPromise = require('bluebird');
const sizeOf = require('image-size');
const staticHelpers = require('./static');

class ImageHelper {

  /**
   * Generate file name with resize dimensions
   *
   * @param  {object} imageInfo  Original image info
   * @param  {object} sizeOption Size option object
   *
   * @return {string}            Return filename
   */
  static resizeFilename(imageInfo, sizeOption) {

    let sizeText = '',
      fileName = imageInfo.name || imageInfo.fileName;

    Hoek.assert(fileName, 'Image file name must not be empty. Data: ' + JSON.stringify(imageInfo));

    let fileParts = fileName.split('.');

    if (sizeOption.width && sizeOption.height) {
      sizeText = sizeOption.width + 'x' + sizeOption.height;
    } else if (sizeOption.width) {
      sizeText = sizeOption.width;
    } else {
      sizeText = sizeOption.height;
    }

    if (fileParts.length === 1) {
      return fileParts[0] + '_' + sizeText;
    }
    var extension = fileParts[fileParts.length - 1];
    fileParts.pop();

    return fileParts.join('_') + '_' + sizeText + '.' + extension;
  }

  /**
   * Resizes image into multiple sizes
   *
   * @param  {object} imageInfo Image information, including path, absolute path and absolute url
   * @param  {object} sizeOptions Image size options
   * @param  {object} opts Optional settings
   * @param {object} request Request object
   *
   * @return {object}      Return image information
   */
  static resizeImage(imageInfo, sizeOptions, opts, request) {

    Hoek.assert(imageInfo.absPath, 'Image info is empty. Resize image failed');

    return new BPromise((resolve, reject) => {

      let result = {
        original: imageInfo
      };

      let dimensions = sizeOf(imageInfo.absPath);
      if (dimensions) {

        result.original.width = dimensions.width;
        result.original.height = dimensions.height;
        result.original.ext = dimensions.type;
      }

      if (sizeOptions) {
        var index = 0;
        sizeOptions.forEach((element) => {
          var resizeName = ImageHelper.resizeFilename(imageInfo, element),
            resizePath = (element.relPath || imageInfo.relPath),
            resizeFilePath = resizePath + '/' + resizeName,
            resizeAbsPath = staticHelpers.getAbsolutePath(resizeFilePath, opts),
            resizeUrl = staticHelpers.getAbsoluteUrl(resizeFilePath, opts);

          sharp(imageInfo.absPath)
            .resize(element.width, element.height)
            .toFile(resizeAbsPath, function(err, info) {

              if (err) {
                request.log(['error', 'resize'], {
                  resizeAbsPath: resizeAbsPath,
                  error: err
                });

                return reject(err);
              } else {
                result[element.type] = {
                  relPath: resizePath,
                  absPath: resizeAbsPath,
                  url: resizeUrl,
                  name: resizeName,
                  width: info.width,
                  height: info.height,
                  ext: dimensions.type
                };
                index++;

                if (index === sizeOptions.length) {
                  return resolve(result);
                }

              }
            });

        });
      }

    });
  }

  /**
   * Response image information
   *
   * @param  {object} imageInfos Image information
   *
   * @return {object}            Response image information
   */
  static response(imageInfos) {
    imageInfos = imageInfos || {};
    var result = {};

    for (var key in imageInfos) {
      var element = imageInfos[key];
      delete element.relPath;
      delete element.absPath;

      result[key] = element;
    }

    return result;
  }
}

module.exports = ImageHelper;
