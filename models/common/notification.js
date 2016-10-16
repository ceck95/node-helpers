/*
 * @Author: toan.nguyen
 * @Date:   2016-05-27 08:27:43
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-11 11:14:52
 */

'use strict';

const BaseModel = require('../base');
const notificationTypes = require('../../gen-nodejs/notification_types');

const constHelpers = new(require('../../helpers/const'))();
const modelHelpers = require('../../helpers/model');
const dataHelpers = require('../../helpers/data');

class Notification extends BaseModel {

  /**
   * Pagination thrift class
   *
   * @return {Class}
   */
  get paginationThriftClass() {
    return notificationTypes.PaginationNotifications;
  }

  /**
   * Returns default SQL order
   *
   * @return {String}
   */
  get defaultOrder() {
    return {
      'created_at': false
    };
  }

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data, opts) {
    super(data, opts);

    this.uid = null;
    this.title = '';
    this.message = '';
    this.type = '';
    this.subjectId = null;
    this.subjectType = '';
    this.metadata = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = null;
    this.audience = null;
    this.userRead = null;
    this.userDeleted = null;

    if (data) {
      modelHelpers.assignData(this, data, opts);
    }

  }

  /**
   * Returns table column attributes
   *
   * @return {Object} Plain object data
   */
  getAttributes() {

    return {
      uid: this.uid,
      title: this.title,
      message: this.message,
      type: this.type,
      subject_id: this.subjectId,
      subject_type: this.subjectType,
      metadata: this.metadata,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      status: this.status,
      audience: this.audience,
      user_read: this.userRead,
      user_deleted: this.userDeleted,
    };
  }

  /**
   * Pre-processing data before insert and update
   */
  beforeSave(isNewRecord) {
    super.beforeSave(isNewRecord);

    if (isNewRecord) {
      this.status = this.status || constHelpers.status.ACTIVE;
      if (!this.audience) {
        this.audience = [];
      }

      if (!this.userRead) {
        this.userRead = [];
      }

      if (!this.userDeleted) {
        this.userDeleted = [];
      }
    }
  }

  /**
   * Converts to thrift object
   *
   * @param {Object} opts Optional settings
   *
   * @return {notificationTypes.Notification} Thrift address model
   */
  toThriftObject(opts) {
    opts = opts || {};

    var model = new notificationTypes.Notification();

    modelHelpers.assignCamelCase(model, this, opts);

    model.uid = dataHelpers.toDataString(model.uid);
    model.subjectId = dataHelpers.toDataString(model.subjectId);
    model.createdAt = dataHelpers.toUtcString(this.createdAt);
    model.updatedAt = dataHelpers.toUtcString(this.updatedAt);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }

    return model;
  }

  /**
   * Converts to thrift form object
   *
   * @param {Object} opts Optional settings
   *
   * @return {notificationTypes.NotificationForm} Thrift address model
   */
  toThriftForm(opts) {
    opts = opts || {};

    var model = new notificationTypes.NotificationForm();

    modelHelpers.assignCamelCase(model, this, opts);

    model.uid = dataHelpers.toDataString(model.uid);
    model.subjectId = dataHelpers.toDataString(model.subjectId);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }

    return model;
  }

  /**
   * Converts to thrift insert object
   *
   * @param {Object} opts Optional settings
   *
   * @return {notificationTypes.NotificationInsert} Thrift address model
   */
  toThriftInsert(opts) {
    opts = opts || {};
    var model = new notificationTypes.NotificationInsert();

    modelHelpers.assignCamelCase(model, this, opts);

    model.subjectId = dataHelpers.toDataString(model.subjectId);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }

    return model;
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject(opts) {
    let response = modelHelpers.toObject(this, opts);

    if (modelHelpers.checkAvailableKey('createdAt', opts)) {
      response.createdAt = dataHelpers.toTimestamp(this.createdAt);
    }

    if (modelHelpers.checkAvailableKey('isRead', opts)) {

      if (!opts.userId) {
        response.isRead = false;
      } else {
        response.isRead = this.userRead ? this.userRead.indexOf(opts.userId) !== -1 : false;
      }
    }

    if (modelHelpers.checkAvailableKey('uid', opts)) {
      response.uid = dataHelpers.toDataString(this.uid);
    }

    return response;
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get serviceActions() {
    return [
      'markAsRead',
      'countUnread',
      'markAllAsRead',
      'deleteOneByUser',
    ];
  }
}

module.exports = Notification;
