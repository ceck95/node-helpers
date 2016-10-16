/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-16 18:18:43
 */

'use strict';

const Hoek = require('hoek');
const moment = require('moment');

class BaseMongo {

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
  get collectionName() {
    Hoek.assert(false, 'collectionName has not been implemented');
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get defaultServiceActions() {
    return ['insertOne', 'updateOne', 'updateOneSimple', 'updateMany', 'updateManySimple', 'updateAll', 'updateAllSimple', 'upsertOne', 'getOne', 'getOneSimple', 'getOneAndUpdate', 'getOneAndUpsert', 'getMany', 'exists', 'deleteOne', 'deleteOneSimple', 'deleteMany', 'deleteManySimple', 'deleteAll'];
  }

  /**
   * Pre-processing data before insert and update
   */
  beforeSave(isNewRecord) {

    if (isNewRecord) {
      if (this.hasOwnProperty('createdAt')) {
        this.createdAt = moment.utc().format();
      } else if (this.hasOwnProperty('created')) {
        this.created = moment.utc().format();
      }
    }

    if (this.hasOwnProperty('updatedAt')) {
      this.updatedAt = moment.utc().format();
    } else if (this.hasOwnProperty('updated')) {
      this.updated = moment.utc().format();
    }
  }

  /**
   * Converts to thrift object
   *
   * @param {Object} opts Optional settings
   *
   * @return {Object} Thrift object model
   */
  toThriftObject(opts) {
    Hoek.assert(false, 'toThriftObject method has not been implemented');
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
   * Convert to insert object
   *
   * @return {Object} Insert object
   */
  toInsertObject(opts) {
    Hoek.assert(false, 'toInsertObject method has not been implemented');
  }

  /**
   * Convert to update object
   *
   * @return {Object} update object
   */
  toUpdateObject(opts) {
    Hoek.assert(false, 'toUpdateObject method has not been implemented');
  }

  /**
   * Convert to upsert object
   *
   * @return {Object} upsert object
   */
  toUpsertObject(opts) {
    Hoek.assert(false, 'toUpdateObject method has not been implemented');
  }
}


module.exports = BaseMongo;
