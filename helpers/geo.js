/*
 * @Author: toan.nguyen
 * @Date:   2016-07-23 14:37:36
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-23 14:50:10
 */

'use strict';

class GeoHelpers {

  /**
   * Returns point object
   *
   * @return {Object} Point object
   */
  static Point(coordinates) {

    let point = {
      type: 'Point',
      coordinates: [0, 0]
    };

    if (coordinates) {
      point.coordinates = coordinates;
    }

    return point;
  }
}

module.exports = GeoHelpers;
