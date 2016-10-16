/*
 * @Author: toan.nguyen
 * @Date:   2016-05-24 11:26:12
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-06-23 09:40:58
 */

'use strict';

const Joi = require('joi');

var geoPointResponse = Joi.object().keys({
    type: Joi.any().default('Point'),
    coordinates: Joi.array().items(Joi.number())
      .length(2).required().description('[ <longitude> , <latitude> ]')
  }).description('View more at http://geojson.org/geojson-spec.html#point'),
  geoPointRequest = geoPointResponse,
  coordinatesRequest = Joi.array().items(Joi.number())
  .length(2).required().description('[ <longitude> , <latitude> ]'),
  coordinatesResponse = coordinatesRequest;

module.exports = {
  point: {
    request: geoPointRequest,
    response: geoPointResponse
  },
  coordinates: {
    request: coordinatesRequest,
    response: coordinatesResponse
  }

};
