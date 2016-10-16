/*
 * @Author: toan.nguyen
 * @Date:   2016-04-30 10:50:23
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-05-19 19:35:28
 */

'use strict';

const config = require('config');
const Hoek = require('hoek');

class UriHelper {

  /**
   * Return URI of current request
   *
   * @param  {Request} request Connection Request
   * @param {object} params query params
   *
   * @return {string}          Current Uri
   */
  static getCurrentUri(request, params) {
    var uri = config.has('server.protocol') ? config.get('server.protocol') : request.connection.info.protocol;
    uri += '://' + (config.has('server.domain') ? config.get('server.domain') : request.info.host);

    if (config.has('server.basePath')) {
      uri += config.get('server.basePath');
    }

    if (params) {
      var queryParams = UriHelper.generateQuery(params);

      return uri + request.url.pathname + '?' + queryParams;
    }

    return uri + request.url.path;
  }

  /**
   * Generates absolute URI from path with params
   *
   * @param  {Request} request Connection Request
   * @param {string} [varname] [description]
   *
   * @return {string}          Absolute URI
   */
  static getAbsoluteUri(request, path, params) {
    var uri = config.has('server.protocol') ? config.get('server.protocol') : request.connection.info.protocol;
    uri += '://' + (config.has('server.domain') ? config.get('server.domain') : request.info.host);
    if (config.has('server.basePath')) {
      uri += config.get('server.basePath');
    }

    if (params) {
      var queryParams = UriHelper.generateQuery(params);

      return uri + path + '?' + queryParams;
    }

    return uri + path;
  }

  /**
   * Generate query from params
   *
   * @param  {object} params query params
   *
   * @return {string}        query url string
   */
  static generateQuery(params) {
    var results = [],
      queryParams = [];
    params = params || {};

    var genSubQuery = function(ret, obj) {
      if (typeof(obj) !== 'object') {
        ret.value = obj;
        return;
      }

      for (var k in obj) {
        var temp = Hoek.clone(ret);
        temp.keys.push(k);
        results.push(temp);
        genSubQuery(temp, obj[k]);
      }
      var index = results.indexOf(ret);
      if (index !== -1) {
        results.splice(index, 1);
      }
    };

    for (var key in params) {
      var item = {
        keys: [key],
        value: ''
      };

      results.push(item);
      genSubQuery(item, params[key]);
    }

    results.forEach(function(element) {
      var textParam = '';
      for (var i = 0; i < element.keys.length; i++) {
        if (i === 0) {
          textParam += element.keys[i];
        } else {
          textParam += '[' + element.keys[i] + ']';
        }
      }

      textParam += '=' + element.value;

      queryParams.push(textParam);
    });

    return queryParams.join('&');
  }

  /**
   * Get endpoint uri from options
   *
   * @param  {object} options endpoint options
   * @param  {string} query   query string
   *
   * @return {string}         endpoint URI
   */
  static getEndpoint(options, query) {
    options = options || {};
    var endpoint = options.host;

    if (options.port) {
      endpoint += ':' + options.port;
    }

    if (options.basePath) {
      endpoint += options.basePath;
    }

    return endpoint + query;
  }

  /**
   * [parseQuery description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  static parseQuery(params) {
    var result = {};
    var headPattern = /^([a-zA-Z]+)/;
    var childPattern = /\[([a-zA-Z]+)\]/g;

    for (var key in params) {
      var headMatches = headPattern.exec(key);
      if (!headMatches) {
        continue;
      }

      if (!result[headMatches[1]]) {
        result[headMatches[1]] = {};
      }
      var iter = result[headMatches[1]];
      var subkey = key,
        parent = result;
      while (1) {

        var childMatches = childPattern.exec(key);
        if (childMatches === null) {
          parent[subkey] = params[key];
          break;
        }

        if (!iter[childMatches[1]]) {
          iter[childMatches[1]] = {};
          parent = iter;
          subkey = childMatches[1];
          iter = iter[childMatches[1]];
        }
      }

    }

    return result;
  }
}

module.exports = UriHelper;
