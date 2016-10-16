/*
 * @Author: toan.nguyen
 * @Date:   2016-05-19 09:02:36
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-06 19:27:49
 */

'use strict';

const Hoek = require('hoek');
const uriHelper = require('../../helpers/uri');

class Pagination {

  /**
   * Constructor, set default data
   *
   * @param {object} rawData Raw data from thrift service
   * @param {object} params Request params
   */
  constructor(rawData, params) {
    this.pagination = rawData.pagination;
    this.data = rawData.data || [];
    this.params = params || {};
  }

  /**
   * Response object data with pagination
   *
   * @param  {[type]} response [description]
   * @return {[type]}          [description]
   */
  response(request, resp) {
    resp.meta = resp.meta || {};
    Hoek.merge(resp.meta, this.pagination);
    resp.links = resp.links || {};
    Hoek.merge(resp.links, {
      current: uriHelper.getCurrentUri(request, this.params),
      first: this.urlCurrent(request),
      last: this.urlLast(request),
      next: this.urlNext(request),
      prev: this.urlPrev(request)
    });

    return resp;
  }

  get canNext() {
    if (!this.pagination) {
      return false;
    }

    return this.pagination.pageNumber < this.pagination.totalPages;
  }

  get canPrev() {
    if (!this.pagination) {
      return false;
    }

    return this.pagination.pageNumber > 1;
  }

  urlCurrent(request) {
    return uriHelper.getCurrentUri(request);
  }

  urlNext(request) {
    if (!this.pagination ? false : !this.canNext) {
      return '';
    }

    var params = Hoek.clone(this.params);
    params.page = this.pagination.pageNumber + 1;
    return uriHelper.getCurrentUri(request, params);
  }

  urlPrev(request) {
    if (!this.pagination ? false : !this.canPrev) {
      return '';
    }

    var params = Hoek.clone(this.params);
    params.page = this.pagination.pageNumber - 1;
    return uriHelper.getCurrentUri(request, params);
  }

  urlFirst(request) {
    if (!this.pagination ? false : this.pagination.totalPages === 0) {
      return '';
    }

    var params = Hoek.clone(this.params);
    params.page = 1;
    return uriHelper.getCurrentUri(request, params);
  }

  urlLast(request) {
    if (!this.pagination ? false : this.pagination.totalPages === 0) {
      return '';
    }

    var params = Hoek.clone(this.params);
    params.page = this.pagination.totalPages;
    return uriHelper.getCurrentUri(request, params);
  }

}

module.exports = Pagination;
