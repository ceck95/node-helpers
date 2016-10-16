/*
 * @Author: toan.nguyen
 * @Date:   2016-05-01 09:23:50
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-03 15:03:10
 */

'use strict';

const config = require('config');
const exception = require('./helpers/exception');
const resources = require('./includes/resources');

module.exports = {
  Array: require('./helpers/array'),
  HAPI: require('./helpers/hapi'),
  Data: require('./helpers/data'),
  Error: require('./helpers/error'),
  Const: new(require('./helpers/const'))(),
  Postgres: require('./helpers/postgres'),
  Json: require('./helpers/json'),
  DataAccess: require('./helpers/data-access'),

  Model: require('./helpers/model'),
  Log: require('./helpers/log'),
  Uri: require('./helpers/uri'),
  Stringer: require('./helpers/stringer'),
  Token: require('./helpers/token'),
  Auth: require('./helpers/auth'),
  File: require('./helpers/file'),
  Static: require('./helpers/static'),
  AuthBearer: require('./helpers/auth-bearer'),
  Schema: require('./models/schema'),
  Joi: require('./helpers/joi'),
  Math: require('./helpers/math'),
  Unit: require('./helpers/unit'),
  UrbanAirship: require('./helpers/urban'),
  Firebase: require('./helpers/firebase'),
  SchemaGenerator: require('./helpers/schema-gen'),
  Language: require('./helpers/language'),
  Exception: exception.model,
  DefaultException: exception.instance,
  Image: require('./helpers/image'),
  PhysicBasic: require('./helpers/physic-basic'),
  ResponseHandler: require('./models/response/response-handler'),
  Mailer: require('./helpers/mail'),

  schemas: require('./includes/schemas'),
  resources: resources,
  models: require('./includes/models'),
  forms: require('./includes/forms'),
  ttypes: require('./includes/ttypes'),
  auth: {
    Bearer: require('./auth/auth-bearer'),
  },
  errors: require('./includes/errors'),
  isDebug: config.has('isDebug') ? config.get('isDebug') : (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
};
