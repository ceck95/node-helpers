/*
 * @Author: toan.nguyen
 * @Date:   2016-09-07 16:24:43
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-25 09:09:52
 */

'use strict';

module.exports = {
  Base: require('../models/base'),
  Mongo: require('../models/common/mongo'),
  Image: require('../models/common/image'),
  Error: require('../helpers/error').Error,
  Profile: require('../models/common/profile'),
  Address: require('../models/common/address'),
  SimpleAddress: require('../models/common/address-simple'),

  Ward: require('../models/common/ward'),
  Country: require('../models/common/country'),
  Province: require('../models/common/province'),
  District: require('../models/common/district'),
  Notification: require('../models/common/notification'),

  PaginationModel: require('../models/common/pagination'),
  Pagination: require('../models/response/pagination'),
  PagingQuery: require('../models/common/paging-query'),
  geo: {
    Point: require('../models/geo/point')
  },
  response: {
    address: require('../models/response/address')
  }
};
