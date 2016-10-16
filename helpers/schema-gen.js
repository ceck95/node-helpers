/*
 * @Author: toan.nguyen
 * @Date:   2016-05-28 09:48:58
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-14 11:23:34
 */

'use strict';

const Joi = require('joi');
const Hoek = require('hoek');

const dataHelpers = require('./data');

class SchemaHelper {

  /**
   * Generates generator schema
   *
   * @param  {Joi.object} data Data joi object
   * @param  {Object} meta Meta data (optional)
   *
   * @return {Joi.object}     Pagination Joi object
   */
  static paginate(data, meta) {
    meta = Hoek.applyToDefaults({
      message: Joi.string(),
      pageSize: Joi.number(),
      pageNumber: Joi.number(),
      count: Joi.number(),
      totalPages: Joi.number(),
      total: Joi.number()
    }, meta || {});

    var schema = Joi.object().keys({
      data: data,
      meta: Joi.object().keys(meta),
      links: {
        current: Joi.any(),
        first: Joi.any(),
        last: Joi.any(),
        next: Joi.any(),
        prev: Joi.any()
      }
    });

    return schema;
  }

  /**
   * Generates basic response schema
   *
   * @param  {Joi.object} data Data joi object
   * @param  {Object} meta Meta data (optional)
   *
   * @return {Joi.object}     Pagination Joi object
   */
  static basicResponse(data, meta, extra) {

    meta = Hoek.applyToDefaults({
      message: Joi.string()
    }, meta || {});

    let params = {
      data: data || {},
      meta: Joi.object().keys(meta),
      links: {
        current: Joi.any()
      }
    };

    if (!dataHelpers.isEmpty(extra)) {
      for (let k in extra) {
        if (!params[k]) {
          params[k] = extra[k];
        }
      }
    }

    let schema = Joi.object().keys(params);

    return schema;
  }


}

module.exports = SchemaHelper;
