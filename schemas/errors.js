/*
 * @Author: toan.nguyen
 * @Date:   2016-08-08 22:57:46
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-08-08 22:58:20
 */

'use strict';

let errorSchema = require('./error');

module.exports = {
  internalServer: {
    description: 'The server encountered an unexpected condition which prevented it from fulfilling the request',
    schema: errorSchema.response,
  },
  badRequest: {
    description: 'Bad request',
    schema: errorSchema.response,
  },
  notFound: {
    description: 'Request not found',
    schema: errorSchema.response,
  },
  forbidden: {
    description: 'Forbidden',
    schema: errorSchema.response,
  }
};
