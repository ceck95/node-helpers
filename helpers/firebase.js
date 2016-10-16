/*
 * @Author: Chien Pham
 * @Date:   2016-07-01 11:53:07
 * @Last Modified by:   Chien Pham
 * @Last Modified time: 2016-07-01 11:53:33
 */

'use strict';

const req = require('request');

class Firebase {

  /**
   * Constructor set default data for firebase cloud message
   * @param  {Object} settings Settings object of firebase
   *
   */
  constructor(settings) {

    this.baseUrl = settings.baseUrl || 'https://fcm.googleapis.com';
    this._key = settings.key;
  }

  /**
   * Create request action to Firebase cloud message API
   * @param  {String} uri    Request URII
   * @param  {String} method HTTP request method
   * @param  {Object} data   Request payload
   * @param  {Object} opts   Options object
   *
   * @return {Promise}        Promise result
   */
  createRequest(uri, method, data, opts) {

    opts = opts || {};
    return new Promise((resolve, reject) => {

      var requestParams = {
        uri: uri,
        baseUrl: this.baseUrl,
        method: method,
        headers: {
          Authorization: 'key=' + this._key,
        },
        json: true,
      };

      if (method.toLowerCase() !== 'get' && data) {
        requestParams.body = data;
      }

      req(requestParams, (error, response, body) => {

        if (error) {
          return reject(response, error);
        }

        if (response.statusCode == 200) {
          return resolve(response, body);
        } else {
          return reject(response, body);
        }

      });
    });
  }

  /*
   * Push a notification to a registered device.
   *
   * @params {String} path of the push Notification.
   *  payload the object being sent to Firebase as specified https://firebase.google.com/docs/cloud-messaging/server#implementing-http-connection-server-protocol
   *  callback
   */
  pushNotification(payload) {

    return this.createRequest('/fcm/send', 'POST', payload);
  }

}

module.exports = Firebase;