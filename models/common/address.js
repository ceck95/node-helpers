/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-11 22:57:55
 */

'use strict';

const Hoek = require('hoek');
const BaseModel = require('../base');
const dataHelper = require('../../helpers/data');
const modelHelper = require('../../helpers/model');
const addressTypes = require('../../gen-nodejs/address_types');

const countryResources = require('../../resources/countries');

class Address extends BaseModel {

  /**
   * Constructor, set default data
   *
   * @param  {Object} data Raw data object
   */
  constructor(data, opts) {
    super(data, opts);

    this.uid = null;
    this.address = '';
    this.ward = '';
    this.wardId = null;
    this.district = '';

    this.districtCode = null;
    this.province = '';
    this.provinceCode = '';
    this.countryCode = null;

    this.userId = null;
    this.type = [];
    this.parentId = null;
    this.latitude = 0;

    this.longitude = 0;
    this.metadata = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = null;

    this.updatedBy = null;
    this.status = null;

    if (data) {
      modelHelper.assignData(this, data, opts);
      if (data.coordinates) {
        this.longitude = data.coordinates[0];
        this.latitude = data.coordinates[1];
      }
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
      address: this.address,
      ward: this.ward,
      ward_id: this.wardId,
      district: this.district,

      district_code: this.districtCode,
      province: this.province,
      province_code: this.provinceCode,
      country_code: this.countryCode,
      user_id: this.userId,
      parent_id: this.parentId,
      latitude: this.latitude,
      longitude: this.longitude,

      type: this.type,
      metadata: this.metadata,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      created_by: this.createdBy,

      updated_by: this.updatedBy,
      status: this.status,
    };
  }

  /**
   * Check if coordinates are empty
   *
   * @return {Boolean}
   */
  get isEmptyCoordinates() {
    return !this.longitude && !this.latitude;
  }

  /**
   * Get Coordinate in array
   *
   * @return {Array}
   */
  get coordinates() {
    return [this.longitude, this.latitude];
  }

  /**
   * Set coordinates into model
   *
   * @params {Array} coordinates Coordinates array
   */
  set coordinates(coordinates) {
    this.longitude = coordinates[0];
    this.latitude = coordinates[1];
  }

  /**
   * Returns full address text
   *
   * @return {String}
   */
  get fullAddress() {
    return this.getFullAddress();
  }

  /**
   * Get full address text
   *
   * @param  {Object} opts Option data
   *
   * @return {String}
   */
  getFullAddress(opts) {
    opts = Hoek.applyToDefaults({
      excepts: []
    }, opts || {});

    let parts = [];

    if (this.address && opts.excepts.indexOf('address') === -1) {
      parts.push(this.address);
    }

    if (this.ward && opts.excepts.indexOf('ward') === -1) {
      parts.push(this.ward);
    }

    if (this.district && opts.excepts.indexOf('district') === -1) {
      parts.push(this.district);
    }

    if (this.province && opts.excepts.indexOf('province') === -1) {
      parts.push(this.province);
    }

    // if (this.countryCode && opts.excepts.indexOf('country') === -1) {
    //   let country = countryResources[this.countryCode];
    //   parts.push(country);
    // }

    return parts.join(', ');
  }

  /**
   * Pre-processing data before insert and update
   */
  beforeSave(isNewRecord) {
    super.beforeSave(isNewRecord);

    if (this.metadata && typeof (this.metadata) !== 'string') {
      this.metadata = JSON.stringify(this.metadata);
    }
  }


  /**
   * Converts to thrift object
   *
   * @return {addressTypes.Address} Thrift address model
   */
  toThriftObject() {

    var model = new addressTypes.Address();

    modelHelper.assignCamelCase(model, this);

    model.uid = dataHelper.toDataString(model.uid);
    model.userId = dataHelper.toDataString(model.userId);
    model.parentId = dataHelper.toDataString(model.parentId);

    model.createdBy = dataHelper.toDataString(model.createdBy);
    model.updatedBy = dataHelper.toDataString(model.updatedBy);

    model.createdAt = dataHelper.toUtcString(model.created);
    model.updatedAt = dataHelper.toUtcString(model.updated);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }


    return model;
  }

  /**
   * Converts to thrift insert object
   *
   * @return {addressTypes.AddressInsert} Thrift address model
   */
  toThriftInsert() {

    var model = new addressTypes.AddressInsert();

    modelHelper.assignCamelCase(model, this);

    model.uid = dataHelper.toDataString(model.uid);
    model.userId = dataHelper.toDataString(model.userId);
    model.parentId = dataHelper.toDataString(model.parentId);

    model.createdBy = dataHelper.toDataString(model.createdBy);
    model.updatedBy = dataHelper.toDataString(model.updatedBy);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }

    return model;
  }

  /**
   * Converts to thrift form object
   *
   * @return {addressTypes.AddressForm} Thrift address model
   */
  toThriftForm() {

    var model = new addressTypes.AddressForm();

    modelHelper.assignCamelCase(model, this);

    model.uid = dataHelper.toDataString(model.uid);
    model.userId = dataHelper.toDataString(model.userId);
    model.locationId = dataHelper.toDataString(model.locationId);
    model.parentId = dataHelper.toDataString(model.parentId);

    model.createdBy = dataHelper.toDataString(model.createdBy);
    model.updatedBy = dataHelper.toDataString(model.updatedBy);

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }


    return model;
  }

  /**
   * Converts to thrift object
   *
   * @return {addressTypes.Address} Thrift address model
   */
  toSimpleThriftObject() {

    var model = new addressTypes.SimpleAddress();
    model.uid = dataHelper.toDataString(this.uid);
    model.address = this.address;

    model.coordinates = [this.longitude, this.latitude];

    return model;
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseObject(opts) {
    opts = Hoek.applyToDefaults({
      attributes: ['uid', 'userId', 'address', 'ward', 'district',
        'province', 'country', 'coordinates', 'status'
      ]
    }, opts || {});

    let response = modelHelper.toObject(this, opts);

    if (modelHelper.checkAvailableKey('coordinates', opts)) {
      response.coordinates = this.coordinates;
    }

    if (modelHelper.checkAvailableKey('wardCode', opts)) {
      response.wardCode = this.wardId;
    }

    return response;
  }

  /**
   * Convert to response object
   *
   * @return {Object} Response object
   */
  responseSimpleObject(opts) {

    var response = {
      uid: dataHelper.toDataString(this.uid),
      address: this.getFullAddress(opts),
      coordinates: [this.longitude, this.latitude]
    };

    return response;
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get serviceActions() {
    return [
      'updateBySubject', 'getBySubject',
      'getBySubjects', 'getOrCreateBySubject'
    ];
  }
}


module.exports = Address;
