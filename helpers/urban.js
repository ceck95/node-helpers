/*
 * @Author: toan.nguyen
 * @Date:   2016-05-27 10:58:43
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-08 18:26:43
 */

'use strict';

const Hoek = require('hoek');
const config = require('config');
const req = require('request');
const dataHelper = require('./data');

class UrbanAirship {

  /**
   * Constructor, set default data
   */
  constructor(settings) {

    if (dataHelper.isEmpty(settings)) {
      settings = config.get('vendors.urbanAirship');
    }

    Hoek.assert(settings.appId, 'Urban Airship Application ID `appId` is empty');
    Hoek.assert(settings.masterSecret, 'Urban Airship Application Master Secret `masterSecret` is empty');

    this.config = settings;
    this._key = settings.appId;
    this._secret = settings.secret;
    this._master = settings.masterSecret;
    this._auth = new Buffer(this._key + ":" + this._master, "utf8").toString("base64");

    this.baseUrl = this.config.baseUrl || 'https://go.urbanairship.com';
  }

  /**
   * Create request action to Urban Airship API
   *
   * @param  {String} uri    Request URI
   * @param  {String} method HTTP Request method
   * @param  {Object} data   Request payload
   * @param  {Object} opts   Option object
   *
   * @return {Promise}       Promise result
   */
  createRequest(uri, method, data, opts) {

    opts = opts || {};

    return new Promise((resolve, reject) => {

      var acceptHeader = 'application/vnd.urbanairship+json; version=3;';

      var requestParams = {
        uri: uri,
        baseUrl: this.baseUrl,
        method: method,
        port: 443,
        headers: {
          Authorization: 'Basic ' + this._auth,
          Accept: acceptHeader
        },
        json: true,
      };

      if (method.toLowerCase() !== 'get' && data) {

        requestParams.body = data;

      }

      req(requestParams, (error, response, body) => {

        if (error) {
          return reject(error);
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return resolve(body);
        } else {
          return reject(body);
        }

      });

    });

  }

  /**
   * Returns device endpoint from device ID
   *
   * @param  {String} deviceId The device identifier
   *
   * @return {String}          Device endpoint
   */
  deviceEndpoint(deviceId) {

    switch (deviceId.length) {
    case 64:
      return 'device_tokens';
    case 36:
      return 'apids';
    case 8:
      return 'device_pins';
    default:
      throw new Error("The device ID was not a valid length ID");
    }

  }

  /*
   * Register a new device.
   *
   * @params {String}  deviceId The device identifier
   * @params {String}  data     The JSON payload (optional)
   * @params {Function} callback Callback function
   */
  registerDevice(deviceId, data) {

    var path = '/api/' + this.deviceEndpoint(deviceId) + '/' + deviceId;

    return this.createRequest(path, 'PUT', data);
  }


  /*
   * Unregister a device.
   *
   * @params {String} deviceId The device identifier
   */
  unregisterDevice(deviceId) {
    var path = "/api/" + UrbanAirship.deviceEndpoint(deviceId) + "/" + deviceId;

    return this.createRequest(path, 'DELETE');
  }

  /*
   * Push a notification to a registered device.
   *
   * @params {String} path of the push Notification.
   *  payload the object being sent to Urban Airship as specified http://urbanairship.com/docs/push.html
   *  callback
   */
  pushNotification(payload) {

    return this.createRequest('/api/push', 'POST', payload);
  }

  /**
   * Gets the number of devices tokens authenticated with the application.
   */
  getDeviceTokenCounts() {

    return this.createRequest('/api/device_tokens/count/', 'GET');
  }

  /**
   * Gets the list of iOS devices tokens and their statuses
   */
  getDeviceTokenStatus(since) {
    return this.createRequest('/api/device_tokens/feedback/?since=' + since, 'GET');
  }


  /**
   * Gets the list of Android devices tokens and their statuses
   */
  getApidsStatus(since) {
    return this.createRequest('/api/apids/feedback/?since=' + since, 'GET');
  }

  /**
   * Builds device token audience query
   *
   * @param  {Object} token Device token object
   *
   * @return {Object}       Query object
   */
  _appendDeviceToken(audience, token) {
    Hoek.assert(audience, 'Audience must not be null');
    Hoek.assert(token, 'Device Token must be a object');
    Hoek.assert(token.deviceToken, 'Device Token must not be null');

    let ios = {
        device_token: token.deviceToken
      },
      android = {
        android_channel: token.deviceToken
      };

    switch (token.platform) {
    case 'ios':
      audience.or.push(ios);
      return true;
    case 'android':
      audience.or.push(android);
      return true;
    default:
      audience.or.push(ios, android);
      return false;
    }
  }

  /**
   * Builds request params for urban airship API
   *
   * @param  {Object} opts Request option data
   *
   * @return {Object}      Urban airship request params
   */
  buildParams(opts) {

    Hoek.assert(opts, 'Request option must not be empty');
    Hoek.assert(opts.alert, 'Alert must not be empty');

    opts = Hoek.applyToDefaults({
      deviceTypes: 'all',
      appDefined: null
    }, opts);

    let requestParams = {
      device_types: opts.deviceTypes
    };

    let audience = opts.audience,
      sound = opts.sound;

    if (sound) {
      Hoek.assert(opts.deviceTypes !== 'all', 'Cannot use device_types "all" for sound notification');
    }

    if (!audience) {
      if (!opts.alias && !opts.deviceToken) {
        audience = 'all';
      } else {
        audience = { or: [] };
        if (opts.alias) {
          let alias = Array.isArray(opts.alias) ? opts.alias : [opts.alias];

          alias.forEach((a) => {
            audience.or.push({
              alias: a
            });
          });
        }

        if (opts.deviceToken) {

          let tokens = Array.isArray(opts.deviceToken) ? opts.deviceToken : [opts.deviceToken];

          tokens.forEach((t) => {
            this._appendDeviceToken(audience, t);
          });
        }
      }
    }

    if (opts.deviceTypes === 'all') {
      requestParams.notification = {
        alert: opts.alert,
      };
    } else {
      requestParams.notification = {};

      let deviceTypes = Array.isArray(opts.deviceTypes) ? opts.deviceTypes : [opts.deviceTypes];
      deviceTypes.forEach(t => {
        let params = {
          alert: opts.alert
        };

        if (sound) {
          params.sound = sound;
        }
        requestParams.notification[t] = params;
      });
    }

    let actions = opts.actions;
    if (opts.appDefined) {
      if (!actions) {
        actions = {
          app_defined: opts.appDefined
        };
      } else {
        actions.app_defined = opts.appDefined;
      }
    }

    if (actions) {
      requestParams.notification.actions = actions;
    }
    requestParams.audience = audience;

    return requestParams;
  }
}

module.exports = UrbanAirship;
