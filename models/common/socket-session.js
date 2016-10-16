/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-06 20:22:20
 */

'use strict';

const helpers = require('nexx-helpers');
const socketTypes = require('../gen-nodejs/socket_types');


/**
 * Socket Session model
 *
 * Schema: {
 *   _id {String} Mongo unique ID,
 *   userId {String} Activity status,
 *   socketId {String} Socket ID
 *   createdAt: {Date} Created time,
 *   expiredAt: {Date} Expired time,
 *   type {String} Session Type
 *   status {Int}  Session Status
 * }
 */
class SocketSession extends helpers.models.Mongo {

  /**
   * Return collection name of database
   *
   * @return {string}
   */
  get collectionName() {
    return 'socketSession';
  }

  /**
   * Return log collection name of database
   *
   * @return {string}
   */
  get logCollectionName() {
    return 'socketSessionLog';
  }

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   *
   */
  constructor(data) {
    super(data);

    this._id = null;
    this.userId = null;
    this.socketId = null;
    this.type = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastActive = new Date();
    this.status = 1;
    this.socketServerId = null;
    this.deviceToken = null;
    this.platform = null;

    if (data) {
      helpers.Model.assignCamelCase(this, data);
      if (data._id) {
        this._id = data._id.toString();
      }

      this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
      this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
      this.lastActive = data.lastActive ? new Date(data.lastActive) : new Date();
    }
  }

  /**
   * To thrift object
   *
   * @return {modelTypes.SocketSession} Thrift object
   */
  toThriftObject() {

    let result = new socketTypes.Session();

    helpers.Model.assignData(result, this);

    result.createdAt = helpers.Data.toUtcString(this.createdAt);
    result.updatedAt = helpers.Data.toUtcString(this.updatedAt);
    result.lastActive = helpers.Data.toUtcString(this.lastActive);

    return result;
  }

  /**
   * Convert to insert object
   *
   * @return {Object} Insert object
   */
  toThriftInsert(opts) {

    var result = new socketTypes.SessionInsert();

    helpers.Model.assignData(result, this, opts);
    result.userId = helpers.Data.toDataString(this.userId);
    result.lastActive = helpers.Data.toUtcString(this.lastActive);

    return result;
  }

  /**
   * Convert to form object
   *
   * @return {Object} Form object
   */
  toThriftForm(opts) {

    let result = new socketTypes.SessionForm();

    helpers.Model.assignData(result, this, opts);
    result.lastActive = helpers.Data.toUtcString(this.lastActive);

    return result;
  }


  /**
   * Convert to thrift query object
   *
   * @return {Object} Thrift query object
   */
  toThriftQuery(data, opts) {
    data = data || this;
    let result = new socketTypes.SessionQuery();

    helpers.Model.assignData(result, data, opts);

    return result;
  }

  /**
   * Convert to insert object
   *
   * @return {Object} Insert object
   */
  toInsertObject() {

    let requestDoc = helpers.Model.toSimpleObject(this);
    requestDoc.userId = helpers.Data.toDataString(this.userId);
    requestDoc.nexid = helpers.Data.toDataString(this.nexid);

    return requestDoc;
  }

  /**
   * Convert to form object
   *
   * @return {Object} Form object
   */
  toFormObject() {

    let requestDoc = helpers.Model.toSimpleObject({
      socketId: this.socketId,
      status: this.status,
      socketServerId: this.socketServerId,
      nexid: helpers.Data.toDataString(this.nexid),
      deviceToken: this.deviceToken,
      platform: this.platform,
      lastActive: this.lastActive,
      updatedAt: this.updatedAt,
    });

    return requestDoc;
  }

  /**
   * Convert to upsert object
   *
   * @return {Object} Upsert object
   */
  toUpsertObject() {

    let createdAt = this.createdAt;
    if (typeof (createdAt) !== 'object') {
      createdAt = new Date(this.createdAt);
    }

    let updateParams = helpers.Model.toSimpleObject({
      socketId: this.socketId,
      lastActive: this.lastActive,
      status: this.status,
      socketServerId: this.socketServerId,
      nexid: helpers.Data.toDataString(this.nexid),
      deviceToken: this.deviceToken,
      platform: this.platform,
      updatedAt: this.updatedAt,
    });

    let requestDoc = {
      $set: updateParams,
      $setOnInsert: {
        userId: helpers.Data.toDataString(this.userId),
        createdAt: this.createdAt,
        type: this.type
      }
    };

    return requestDoc;
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get serviceActions() {
    return [
      'getOneBySocket', 'getManyByUsers'
    ];
  }
}


module.exports = SocketSession;
