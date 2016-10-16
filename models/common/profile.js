/*
 * @Author: toan.nguyen
 * @Date:   2016-05-23 01:49:13
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-03 20:21:37
 */

'use strict';

const Hoek = require('hoek');
const moment = require('moment');
const BaseModel = require('../base');
const dataHelper = require('../../helpers/data');
const modelHelper = require('../../helpers/model');
const stringer = require('../../helpers/stringer');
const jsonHelper = require('../../helpers/json');
const constHelper = new(require('../../helpers/const'))();
const profileTypes = require('../../gen-nodejs/profile_types');

class Profile extends BaseModel {

  /**
   * Pre-processing data before insert and update
   */
  beforeSave(isNewRecord) {
    super.beforeSave(isNewRecord);

    if (isNewRecord && this.status === null) {
      this.status = constHelper.status.ACTIVE;
    }

    if (this.settings && typeof (this.settings) !== 'string') {
      this.settings = JSON.stringify(this.settings);
    }

    this.dateOfBirth = dataHelper.toUtcString(this.dateOfBirth);
    this.createdAt = dataHelper.toUtcString(this.createdAt);
    this.updatedAt = dataHelper.toUtcString(this.updatedAt);
  }

  /**
   * Refresh verification code
   *
   * @return {String} New verfication code
   */
  refreshVerificationCode(opts) {
    opts = Hoek.applyToDefaults({
      type: 'number',
      length: 4,
      expiresIn: 60,
      timeUnit: 'seconds'
    }, opts || {});

    switch (opts.type) {
    case 'character':
      this.verificationCode = stringer.randomChars(opts.length);
      break;

    case 'number':
      /* falls through */
    default:
      this.verificationCode = stringer.randomNumberChars(opts.length);
    }

    this.verificationExpiry = moment().add(opts.expiresIn, opts.timeUnit);

    return this.verificationCode;
  }

  /**
   * Checks if verification code is expired
   *
   * @return {Boolean}
   */
  get isVerificationExpired() {
    if (!this.verificationExpiry) {
      return true;
    }

    let now = new Date();
    this.verificationExpiry = new Date(this.verificationExpiry);

    return this.verificationExpiry.getTime() < now.getTime();
  }

  /**
   * Returns age of driver
   *
   * @return {integer}
   */
  get age() {
    let dob = moment(this.dateOfBirth);

    if (!dob.isValid()) {
      return 0;
    }
    return moment().diff(moment(this.dateOfBirth), 'years');
  }

  /**
   * Returns avatar URL
   *
   * @params  {String} type Avatar type
   *
   * @return {String}
   */
  getAvatarUrl(type) {
    if (!this.avatar) {
      return '';
    }

    if (this.avatar.getImageUrl) {
      return this.avatar.getImageUrl(type);
    }

    this.avatar = jsonHelper.parse(this.avatar);
    if (dataHelper.isEmpty(this.avatar)) {
      return '';
    }

    if (!this.avatar[type]) {
      return '';
    }

    return this.avatar[type].url;
  }

  /**
   * Applies thrift model
   *
   * @param  {Object} model Thrift model
   */
  applyThrift(model, opts) {

    opts = opts || {};
    modelHelper.assignCamelCase(model, this);

    if (model.uid) {
      model.uid = dataHelper.toDataString(model.uid);
    }

    if (model.nexid) {
      model.nexid = dataHelper.toDataString(model.nexid);
    }

    if (model.addressId) {
      model.addressId = dataHelper.toDataString(model.addressId);
    }

    if (model.dateOfBirth) {
      model.dateOfBirth = dataHelper.toUtcString(model.dateOfBirth);
    } else if (model.dateOfBirth == '0') {
      model.dateOfBirth = null;
    }

    if (model.verificationExpiry) {
      model.verificationExpiry = dataHelper.toUtcString(model.verificationExpiry);
    }

    if (model.createdAt) {
      model.createdAt = dataHelper.toDateString(model.createdAt);
    }

    if (model.updatedAt) {
      model.updatedAt = dataHelper.toDateString(model.updatedAt);
    }

    if (model.createdBy) {
      model.createdBy = dataHelper.toDataString(model.createdBy);
    }

    if (model.updatedBy) {
      model.updatedBy = dataHelper.toDataString(model.updatedBy);
    }

    if (model.avatar && typeof (model.avatar) !== 'string') {
      model.avatar = JSON.stringify(model.avatar);
    }

    if (model.metadata && typeof (model.metadata) !== 'string') {
      model.metadata = JSON.stringify(model.metadata);
    }

    if (model.settings && typeof (model.settings) !== 'string') {
      model.settings = JSON.stringify(model.settings);
    }

    if (this.address) {
      model.address = opts.isForm ? this.address.toThriftInsert() : this.address.toThriftObject();
    }
  }

  /**
   * Convert to response object
   *
   * @param {Object} opts Option data
   *
   * @return {Object} Response object
   */
  responseObject(opts) {

    opts = opts || {};

    let result = modelHelper.toObject(this, opts);

    if (modelHelper.checkAvailableKey('avatar', opts)) {
      result.avatar = this.getAvatarUrl('original');
    }

    if (modelHelper.checkAvailableKey('age', opts)) {
      result.age = this.age;
    }

    if (modelHelper.checkAvailableKey('phoneNumber', opts)) {
      result.phoneNumber = dataHelper.localePhoneNumber(this.phoneNumber, this.countryCode || 'VN');
    }

    if (modelHelper.checkAvailableKey('dateOfBirth', opts)) {
      result.dateOfBirth = dataHelper.toTimestamp(this.dateOfBirth);
    }

    if (modelHelper.checkAvailableKey('createdAt', opts)) {
      result.createdAt = dataHelper.toTimestamp(this.createdAt);
    }

    if (modelHelper.checkAvailableKey('updatedAt', opts)) {
      result.updatedAt = dataHelper.toTimestamp(this.updatedAt);
    }

    if (this.address && modelHelper.checkAvailableKey('address', opts)) {
      result.address = this.address.responseSimpleObject({
        excepts: ['country']
      });
    }

    return result;
  }

  /**
   * Converts to thrift verification form
   *
   * @param  {Object} data Input data
   * @param  {[type]} opts Options
   *
   * @return {profileTypes.ProfileVerificationForm}      Verification form
   */
  toThriftVerificationForm(data, opts) {


    data = data || this;

    let model = new profileTypes.ProfileVerificationForm();

    modelHelper.assignCamelCase(model, data, opts);
    model.uid = dataHelper.toDataString(model.uid);

    if (data.verificationExpiry) {
      model.verificationExpiry = dataHelper.toUtcString(data.verificationExpiry);
    }

    return model;
  }

  /**
   * Returns all service action strings
   *
   * @return {Array}
   */
  get defaultServiceActions() {
    return super.defaultServiceActions.concat([
      'getByEmail', 'getByUsername', 'getByPhone', 'updateMetadata',
      'updateAvatar', 'updateVerificationCode', 'updateNotificationToken',
      'getOneRelationByNexId', 'getOneByNexId'
    ]);
  }
}


module.exports = Profile;
