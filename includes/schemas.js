/*
 * @Author: toan.nguyen
 * @Date:   2016-08-08 20:55:07
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-09 14:28:58
 */

'use strict';

module.exports = {
  geo: require('../schemas/geo'),
  ward: require('../schemas/ward'),
  country: require('../schemas/country'),
  address: require('../schemas/address'),
  province: require('../schemas/province'),
  district: require('../schemas/district'),
  simpleAddress: require('../schemas/address-simple'),

  accessToken: require('../schemas/access-token'),
  authHeader: require('../schemas/auth-header'),
  error: require('../schemas/error'),
  errors: require('../schemas/errors'),
  notification: require('../schemas/notification'),
};
