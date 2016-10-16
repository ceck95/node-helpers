/*
 * @Author: toan.nguyen
 * @Date:   2016-09-24 18:07:07
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-10 15:01:38
 */

'use strict';

const dataHelper = require('../../helpers/data');
const jsonHelper = require('../../helpers/json');


class ImageModel {

  /**
   * Constructor, set default value
   */
  constructor(img) {

    this._images = {};

    if (img) {
      let imageType = typeof (img);
      switch (imageType) {
      case 'string':
        try {
          this._images = JSON.parse(img);
        } catch (e) {
          console.error('Cannot parse image json string:', img);
          this._images.original = img;
        }
        break;
      case 'object':
        this._images = img;
        break;
      default:
        throw new Error('Invalid image data input: ' + imageType);
      }
    }
  }

  /**
   * Get Image URL by type
   *
   * @param  {String} type Image size type
   *
   * @return {String}      Image URL
   */
  getImageUrl(type) {
    if (!this._images) {
      return '';
    }
    if (!this._images[type]) {
      return '';
    }

    this._images = jsonHelper.parse(this._images);
    if (dataHelper.isEmpty(this._images)) {
      return '';
    }

    if (!this._images[type]) {
      return '';
    }

    return this._images[type].url;
  }

  /**
   * Returns JSON string
   *
   * @return {String}
   */
  toString() {
    return JSON.stringify(this._images);
  }
}

module.exports = ImageModel;
