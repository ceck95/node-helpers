/**
 * @Author: Tran Van Nhut <nhutdev>
 * @Date:   2017-02-20T10:41:51+07:00
 * @Email:  tranvannhut4495@gmail.com
* @Last modified by:   nhutdev
* @Last modified time: 2017-02-20T15:29:10+07:00
 */



'use strict';

const Hoek = require('hoek');
const config = require('config');
const moment = require('moment');
const modelHelpers = require('../helpers/model');
const dataHelpers = require('../helpers/data');
const arrayHelpers = require('../helpers/array');
const constHelpers = require('../helpers/const');

class BaseModel {

  /**
   * Returns namespace for service
   *
   * @return {String}
   */
  get serviceNamespace() {
    return 'default';
  }

  /**
   * Return table name of model
   *
   * @return {String} table name
   */
  get tableName() {
    Hoek.assert(false, 'tableName has not been implemented');
  }

  /**
   * Return table schema name
   *
   * @return {String} Schema name
   */
  get tableSchema() {
    return config.get('db.postgres.default.schema');
  }

  /**
   * Return full table name of model
   *
   * @return {String} table name
   */
  get fullTableName() {
    return this.tableSchema + '.' + this.tableName;
  }

  /**
   * Return table alias
   *
   * @return {String} Table alias
   */
  get tableAlias() {
    return this.tableName;
  }

  /**
   * Primary key name
   *
   * @return {string} Primary key name
   */
  get primaryKeyName() {

    let primaryKeyName = config.get('db.postgres.default.primaryKeyName');
    return primaryKeyName || 'uid';

  }

  /**
   * Returns default SQL order
   *
   * @return {String}
   */
  get defaultOrder() {
    let order = {};
    order[this.primaryKeyName] = false;

    return order;
  }

  /**
   * Pagination thrift class
   *
   * @return {Class}
   */
  get paginationThriftClass() {
    Hoek.assert(false, 'paginationThriftClass has not been implemented');
  }

  /**
   * Model constructor
   *
   * @param  {Object} data Input data
   * @param  {Object} opts Option data
   */
  constructor(data, opts) {

    opts = opts || {};
    this.createdAt = '';
    this.updatedAt = '';
    this.createdBy = '';
    this.updatedBy = '';
    this.status = null;

    if (!arrayHelpers.isEmpty(opts.includes) && !opts.prefix) {
      opts.prefix = this.tableAlias;
    }
  }

  /**
   * Pre-processing data before insert and update
   */
  beforeSave(isNewRecord) {

    if (this.hasOwnProperty('metadata')) {
      if (this.metadata && typeof(this.metadata) !== 'string') {
        this.metadata = JSON.stringify(this.metadata);
      }
    }

    if (this.hasOwnProperty('status')) {
      this.status = constHelpers.status.ACTIVE;
    }

    if (isNewRecord) {
      if (this.hasOwnProperty('createdAt')) {
        this.createdAt = moment.utc().format();
      } else if (this.hasOwnProperty('created')) {
        this.created = moment.utc().format();
      }

      if (this.hasOwnProperty('updatedBy')) {
        if (!this.updatedBy && this.createdBy) {
          this.updatedBy = this.createdBy;
        }
      }
    }

    if (this.hasOwnProperty('updatedAt')) {
      this.updatedAt = moment.utc().format();
    } else if (this.hasOwnProperty('updated')) {
      this.updated = moment.utc().format();
    }
  }

  /**
   * Applies thrift model
   *
   * @param  {Object} model Thrift model
   * @param  {Object} opts  Option data
   */
  applyThrift(model, opts) {

    opts = opts || {};

    modelHelpers.assignCamelCase(model, this, opts);

    if (model.createdAt) {
      model.createdAt = dataHelpers.toDateString(model.createdAt);
    }

    if (model.updatedAt) {
      model.updatedAt = dataHelpers.toDateString(model.updatedAt);
    }

    if (model.createdBy) {
      model.createdBy = dataHelpers.toDataString(model.createdBy);
    }

    if (model.updatedBy) {
      model.updatedBy = dataHelpers.toDataString(model.updatedBy);

    }

    if (model.metadata !== undefined && typeof(this.metadata) !== 'string') {
      model.metadata = dataHelpers.toDataString(this.metadata);
    }

  }

  /**
   * Converts to thrift object
   *
   * @param {Object} opts Optional settings
   *
   * @return {sharedTypes.NexxAddress} Thrift address model
   */
  toThriftObject(opts) {
    throw 'toThriftObject method has not been implemented';
  }

  /**
   * Converts to thrift insert model
   *
   * @param {Object} opts Optional settings
   *
   * @return {Object} Thrift insert model
   */
  toThriftInsert(opts) {
    Hoek.assert(false, 'toThriftInsert method has not been implemented');
  }

  /**
   * Converts to thrift form model
   *
   * @param {Object} opts Optional settings
   *
   * @return {Object} Thrift insert model
   */
  toThriftForm(opts) {
    Hoek.assert(false, 'toThriftForm method has not been implemented');
  }

  /**
   * Converts to thrift query model
   *
   * @param {Object} opts Optional settings
   *
   * @return {Object} Thrift query model
   */
  toThriftQuery(opts) {
    Hoek.assert(false, 'toThriftForm method has not been implemented');
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject(opts) {

    let response = modelHelpers.toObject(this, opts);

    return response;
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get defaultServiceActions() {
    return ['insertOne', 'insertMany', 'updateOne', 'getOne', 'getOneByPk', 'getOneRelation', 'getOneRelationByPk', 'getOrCreate', 'exists', 'getMany', 'getManyRelation', 'getAll', 'getAllStatus', 'getAllActive', 'getAllInactive', 'getAllDisabled', 'getAllDeleted', 'getAllOrder', 'getAllCondition', 'getPagination', 'filter', 'filterPagination', 'deleteByPk', 'deleteMany'];
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get serviceActions() {
    return [];
  }

  /**
   * Return ignore fields on save
   *
   * @return {Array}
   */
  get ignoreOnSave() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Return ignore fields on insert
   *
   * @return {Array}
   */
  get ignoreOnInsert() {
    return [];
  }

  /**
   * Return ignore fields on update
   *
   * @return {Array}
   */
  get ignoreOnUpdate() {
    return [];
  }
}


module.exports = BaseModel;
