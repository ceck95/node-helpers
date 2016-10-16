/*
 * @Author: toan.nguyen
 * @Date:   2016-07-23 14:53:00
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-26 10:23:40
 */

'use strict';

const Hoek = require('hoek');
const LatLon = require('geodesy').LatLonSpherical;
const geoTypes = require('../../gen-nodejs/geo_types');

const modelHelper = require('../../helpers/model');

class GeoPoint {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data) {
    this.type = 'Point';
    this.coordinates = [0, 0];

    if (data) {
      if (Array.isArray(data)) {
        this.coordinates = data;
      } else if (typeof(data) === 'object') {
        if (data.coordinates) {
          this.coordinates = data.coordinates;
        }
      }
    }
  }

  /**
   * Checks if location is empty
   *
   * @return {Boolean}
   */
  isEmpty(point) {
    point = point || this;

    if (!point) {
      return true;
    }

    if (!point.coordinates) {
      return true;
    }

    if (point.coordinates[0] === 0 && point.coordinates[1] === 0) {
      return true;
    }

    return false;
  }

  /**
   * Compute distance from this point to another point
   *
   * @param  {GeoPoint} p2 Target point
   * @return {double}      Distance in metre
   */
  distanceTo(p) {

    Hoek.assert(!this.isEmpty(p), 'Target point is empty, cannot calculate distance');

    let p1 = new LatLon(this.coordinates[1], this.coordinates[0]),
      p2 = new LatLon(p.coordinates[1], p.coordinates[0]);

    return p1.distanceTo(p2);
  }

  /**
   * Check if two points are in one location
   *
   * @param  {GeoPoint}  p Target point
   *
   * @return {Boolean}
   */
  isEqual(p) {
    Hoek.assert(!this.isEmpty(p), 'Target point is empty. Cannot compare them');

    return this.coordinates[1] === p.coordinates[1] && this.coordinates[0] === p.coordinates[0];
  }

  /**
   * Converts to thrift object
   *
   * @return {geoTypes.GeoPoint} Thrift model
   */
  toThriftObject() {

    let model = new geoTypes.GeoPoint();

    modelHelper.assignCamelCase(model, this);

    return model;
  }
}

module.exports = GeoPoint;
