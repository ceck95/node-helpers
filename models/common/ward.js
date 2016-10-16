/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-12 16:09:29
 */

'use strict';

const BaseModel = require('../base');
const dataHelper = require('../../helpers/data');
const modelHelper = require('../../helpers/model');
const wardTypes = require('../../gen-nodejs/ward_types');

class Ward extends BaseModel {

  /**
   * Return table name of model
   *
   * @return {String} table name
   */
  get tableName() {
    return 'gis_ward';
  }

  /**
   * Return table schema name
   *
   * @return {String} Schema name
   */
  get tableSchema() {
    return 'public';
  }

  /**
   * Returns default SQL order
   *
   * @return {String}
   */
  get defaultOrder() {
    return {
      'name': true
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
    this.countryCode = '';
    this.provinceCode = '';
    this.districtCode = '';
    this.wardCode = '';

    this.name = '';
    this.nameAscii = '';
    this.type = '';
    this.location = '';
    this.latitude = 0;
    this.longitude = 0;
    this.gisId = null;
    this.metadata = {};

    if (data) {
      modelHelper.assignData(this, data, opts);
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
      country_code: this.countryCode,
      province_code: this.provinceCode,
      district_code: this.districtCode,
      ward_code: this.wardCode,
      name: this.name,
      name_ascii: this.nameAscii,
      type: this.type,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      gis_id: this.gisId,
      metadata: this.metadata,
    };
  }

  /**
   * Pre-processing data before insert and update
   */
  // beforeSave(isNewRecord) {
  //   super.beforeSave(isNewRecord);
  // }

  /**
   * Returns display name
   *
   * @return {String}
   */
  get displayName() {
    return this.type + ' ' + this.name;
  }

  /**
   * Converts to thrift object
   *
   * @return {wardTypes.Ward} Thrift address model
   */
  toThriftObject(opts) {
    let result = new wardTypes.Ward();

    modelHelper.assignCamelCase(result, this, opts);

    if (this.gisId) {
      result.gisId = dataHelper.toDataString(this.gisId);
    }

    if (result.metadata && typeof (result.metadata) !== 'string') {
      result.metadata = JSON.stringify(result.metadata);
    }

    return result;
  }

  /**
   * Converts to thrift insert object
   *
   * @return {addressTypes.AddressInsert} Thrift address model
   */
  toThriftInsert() {

    return this;
  }

  /**
   * Converts to thrift form object
   *
   * @return {addressTypes.AddressForm} Thrift address model
   */
  toThriftForm() {

    return this;
  }

  /**
   * Converts to thrift option object
   *
   * @return {wardTypes.WardOption} Thrift address model
   */
  toThriftOption(opts) {
    let result = new wardTypes.WardOption();

    modelHelper.assignCamelCase(result, this, opts);

    return result;
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject(opts) {
    let response = modelHelper.toObject(this, opts);

    if (modelHelper.checkAvailableKey('displayName', opts)) {
      response.displayName = this.displayName;
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
      'getManyByDistrict'
    ];
  }
}


module.exports = Ward;
