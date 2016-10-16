/*
 * @Author: toan.nguyen
 * @Date:   2016-07-26 10:17:40
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-02 12:01:36
 */

'use strict';

const modelHelpers = require('../../helpers/model');
const paginationTypes = require('../../gen-nodejs/pagination_types');

class PaginationModel {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data) {

    this.pageSize = 0;
    this.pageNumber = 0;
    this.count = 0;
    this.totalPages = 0;
    this.total = 0;

    if (data) {
      modelHelpers.assignData(this, data);
    }
  }

  /**
   * Converts to thrift object
   *
   * @return {paginationTypes.PagingQuery}
   */
  toThriftObject() {
    let form = new paginationTypes.Pagination();

    modelHelpers.assignCamelCase(form, this);

    return form;
  }
}

module.exports = PaginationModel;
