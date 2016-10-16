/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-26 13:58:46
 */

'use strict';

const Hoek = require('hoek');
const BaseModel = require('../base');
const GeoPoint = require('../geo/point');
const dataHelper = require('../../helpers/data');
const arrayHelper = require('../../helpers/array');
const modelHelper = require('../../helpers/model');
const addressTypes = require('../../gen-nodejs/address_types');


class SimpleAddress extends BaseModel {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data, opts) {
    super(data, opts);

    this.uid = null;
    this.address = '';
    this.coordinates = [0, 0];

    if (data) {
      modelHelper.assignData(this, data, opts);
      if (data.location) {
        this.coordinates = data.location.coordinates;
      } else if (data.coordinates) {
        this.coordinates = data.coordinates;
      } else if (data.latitude && data.longitude) {
        this.coordinates = [data.longitude, data.latitude];
      }
    }
  }

  /**
   * Check if coordinates are empty
   *
   * @return {Boolean}
   */
  get isEmptyCoordinates() {
    if (arrayHelper.isEmpty(this.coordinates)) {
      return true;
    }

    return !this.coordinates[0] && !this.coordinates[1];
  }


  /**
   * Check if two coorinates are in one location
   *
   * @param  {GeoPoint}  p Target address
   *
   * @return {Boolean}
   */
  isSameCoordinates(p) {
    Hoek.assert(p, 'Target address is empty. Cannot compare them');
    let location = new GeoPoint(this);
    return location.isEqual(p);
  }

  /**
   * Converts to thrift object
   *
   * @return {addressTypes.Address} Thrift address model
   */
  toThriftObject(opts) {

    let model = new addressTypes.SimpleAddress();
    this.applyThrift(model, opts);

    return model;
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject() {

    let response = {
      uid: dataHelper.toDataString(this.uid),
      address: this.address,
      coordinates: this.coordinates
    };

    return response;
  }
}


module.exports = SimpleAddress;
