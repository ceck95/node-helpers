/*
 * @Author: toan.nguyen
 * @Date:   2016-09-08 09:39:11
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-09-08 10:30:04
 */

'use strict';

const Hoek = require('hoek');
const stringer = require('./stringer');
const arrayHelpers = require('./array');

class DataAccessHelpers {

  /**
   * Gets service action of model
   *
   * @param  {Object} model  Model instance
   * @param  {String} action Service action
   *
   * @return {String}        Service model action
   */
  static getServiceName(model, action) {
    Hoek.assert(model, 'Model instance must not empty');
    Hoek.assert(action, 'Action name must not empty');

    let className = model.constructor.name;

    return stringer.pascalToCamelCase(className) + stringer.camelCaseToPascal(action);
  }

  /**
   * Gets service action of model
   *
   * @param  {Object} model  Model instance
   * @param  {String} actions Service action
   *
   * @return {String}        Service model action
   */
  static getServiceNames(model, actions) {
    Hoek.assert(model, 'Model instance must not empty');
    Hoek.assert(!arrayHelpers.isEmpty(actions), 'Action name must not empty');

    let results = new Array(actions.length);

    for (let i = actions.length - 1; i >= 0; i--) {
      let action = actions[i];
      results[i] = this.getServiceName(model, action);
    }

    return results;
  }
}

module.exports = DataAccessHelpers;
