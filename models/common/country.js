/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-21 22:23:28
 */

'use strict';

const Hoek = require('hoek');
const BaseModel = require('../base');
const dataHelper = require('../../helpers/data');
const modelHelper = require('../../helpers/model');
const countryTypes = require('../../gen-nodejs/country_types');

class Country extends BaseModel {

  /**
   * Return table name of model
   *
   * @return {String} table name
   */
  get tableName() {
    return 'gis_country';
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
    return 'country_code';
  }

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data, opts) {
    super(data, opts);

    this.countryCode = '';
    this.iso3 = '';
    this.isoNum = 0;
    this.fips = '';
    this.name = '';
    this.capital = '';
    this.areaKm2 = 0;
    this.population = 0;
    this.continent = '';
    this.tld = '';
    this.currencyCode = '';
    this.currencyName = '';
    this.phoneCode = '';
    this.postalCodeFormat = '';
    this.postalCodeRegex = '';
    this.languages = '';
    this.neighbours = '';
    this.equivalenFipsCode = '';
    this.gis_id = null;
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
      iso3: this.iso3,
      isoNum: this.isoNum,
      fips: this.fips,
      name: this.name,
      capital: this.capital,
      area_km2: this.areaKm2,
      population: this.population,
      continent: this.continent,
      tld: this.tld,
      currency_code: this.currencyCode,
      currency_name: this.currencyName,
      phone_code: this.phoneCode,
      postal_code_format: this.postalCodeFormat,
      postal_code_regex: this.postalCodeRegex,
      languages: this.languages,
      neighbours: this.neighbours,
      equivalen_fips_code: this.equivalenFipsCode,
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
   * Converts to thrift object
   *
   * @return {countryTypes.Country} Thrift address model
   */
  toThriftObject(opts) {

    let result = new countryTypes.Country();

    modelHelper.assignCamelCase(result, this, opts);

    if (this.gisId) {
      result.gisId = dataHelper.toDataString(this.gisId);
    }

    if (result.metadata && typeof(result.metadata) !== 'string') {
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
   * @return {addressTypes.CountryOption} Thrift address model
   */
  toThriftOption(opts) {
    let result = new countryTypes.CountryOption();

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

    return response;
  }
}


module.exports = Country;
