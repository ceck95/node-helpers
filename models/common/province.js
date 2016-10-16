/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-12 16:09:34
 */

'use strict';

const BaseModel = require('../base');
const dataHelper = require('../../helpers/data');
const modelHelper = require('../../helpers/model');
const provinceTypes = require('../../gen-nodejs/province_types');

class Province extends BaseModel {


  /**
   * Return table name of model
   *
   * @return {String} table name
   */
  get tableName() {
    return 'gis_province';
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
   * Primary key name
   *
   * @return {string} Primary key name
   */
  get primaryKeyName() {
    return 'province_code';
  }

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data, opts) {
    super(data, opts);

    this.countryCode = '';
    this.provinceCode = '';
    this.name = '';
    this.nameAscii = '';
    this.type = '';
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

      country_code: this.countryCode,
      province_code: this.provinceCode,
      name: this.name,
      name_ascii: this.nameAscii,
      type: this.type,
      gis_id: this.gisId,
      metadata: this.metadata,
    };
  }

  /**
   * Returns display name
   *
   * @return {String}
   */
  get displayName() {
    return this.type + ' ' + this.name;
  }

  /**
   * Pre-processing data before insert and update
   */
  // beforeSave(isNewRecord) {
  //   super.beforeSave(isNewRecord);
  // }


  /**
   * Converts to thrift object
   *
   * @return {provinceTypes.Province} Thrift address model
   */
  toThriftObject(opts) {
    let result = new provinceTypes.Province();

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
   * @return {provinceTypes.ProvinceOption} Thrift address model
   */
  toThriftOption(opts) {
    let result = new provinceTypes.ProvinceOption();

    modelHelper.assignCamelCase(result, this, opts);

    return result;
  }

  /**
   * Converts to thrift object
   *
   * @return {addressTypes.Address} Thrift address model
   */
  toSimpleThriftObject() {

    return this;
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
      'getManyByCountry'
    ];
  }
}


module.exports = Province;
