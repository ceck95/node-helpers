/*
 * @Author: toan.nguyen
 * @Date:   2016-05-10 07:01:42
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-05-26 19:19:40
 */

'use strict';

var modelHelpers = require('../../helpers/model');

class AddressResponse {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Input data
   */
  constructor(data) {

    this.uid = data.uid;
    this.userId = data.userId;
    this.address = data.address;
    this.ward = data.ward;
    this.district = data.district;
    this.province = data.province;
    this.country = data.countryCode;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.status = data.status;

  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject() {
    var response = modelHelpers.toObject(this);

    return response;
  }
}

module.exports = AddressResponse;
