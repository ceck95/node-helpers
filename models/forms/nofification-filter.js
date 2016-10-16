/*
 * @Author: toan.nguyen
 * @Date:   2016-07-27 17:31:23
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-07-27 17:36:33
 */

'use strict';

const modelHelpers = require('../../helpers/model');
const dataHelpers = require('../../helpers/data');
const notificationTypes = require('../../gen-nodejs/notification_types');

class NotificationFilter {

  /**
   * Contructor, defines properies
   *
   * @param {Object} data Input data
   */
  constructor(data, opts) {

    this.title = null;
    this.message = null;
    this.userId = null;
    this.type = null;
    this.subjectId = null;
    this.isRead = null;
    this.createdFrom = null;
    this.createdTo = null;
    this.status = null;

    if (data) {
      modelHelpers.assignCamelCase(this, data, opts);
    }
  }

  /**
   * Converts to thrift object
   *
   * @return {[type]} [description]
   */
  toThriftObject() {
    let form = new notificationTypes.NotificationFilter();

    modelHelpers.assignCamelCase(form, this);

    if (this.createdFrom) {
      form.createdFrom = dataHelpers.toUtcString(this.createdFrom);
    }

    if (this.createdTo) {
      form.createdTo = dataHelpers.toUtcString(this.createdTo);
    }

    return form;
  }
}

module.exports = NotificationFilter;
