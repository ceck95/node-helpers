/*
 * @Author: toan.nguyen
 * @Date:   2016-07-26 10:17:40
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-02 11:30:39
 */

'use strict';

const modelHelpers = require('../../helpers/model');
const paginationTypes = require('../../gen-nodejs/pagination_types');

class PagingQuery {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data) {
    this.order = '';
    this.pageSize = 0;
    this.pageNumber = 1;
    this.includes = [];

    if (data) {
      modelHelpers.assignData(this, data);
      if (data.page) {
        this.pageNumber = data.page;
      }
    }
  }

  /**
   * Converts to thrift object
   *
   * @return {paginationTypes.PagingQuery}
   */
  toThriftObject() {
    let form = new paginationTypes.PagingQuery();

    modelHelpers.assignCamelCase(form, this);

    return form;
  }
}

module.exports = PagingQuery;
