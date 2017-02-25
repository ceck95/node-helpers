/**
 * @Author: Tran Van Nhut <nhutdev>
 * @Date:   2017-02-25T10:46:13+07:00
 * @Email:  tranvannhut4495@gmail.com
* @Last modified by:   nhutdev
* @Last modified time: 2017-02-25T10:53:39+07:00
 */



'use strict';

const Boom = require('boom');
const Hoek = require('hoek');

const internals = {
  schemeName: 'node-bearer-token'
};

/**
 * Implementation handler
 *
 * @param  {Server} server  HAPI server
 * @param  {Object} options Scheme options
 *
 * @return {Object}         Authorization scheme
 */
internals.implementation = (server, options) => {

  Hoek.assert(options, 'Missing bearer auth strategy options');
  Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in bearer scheme');

  options.accessTokenName = options.accessTokenName || 'accessToken';
  options.allowQueryToken = options.allowQueryToken === false ? false : true;
  options.allowMultipleHeaders = options.allowMultipleHeaders === true ? true : false;
  options.tokenType = options.tokenType || ['Basic', 'Bearer'];

  const settings = Hoek.clone(options);

  settings.headerRegExp = new RegExp(options.tokenType + '\\s+([^;$]+)', 'i');

  const scheme = {
    authenticate: (request, reply) => {

      const req = request.raw.req;
      let authorization = req.headers.authorization;

      if (settings.allowQueryToken && !authorization && request.query[settings.accessTokenName]) {
        authorization = options.tokenType + ' ' + request.query[settings.accessTokenName];
        delete request.query[settings.accessTokenName];
      }

      if (!authorization) {
        return reply(Boom.unauthorized(null, options.tokenType));
      }

      if (settings.allowMultipleHeaders) {
        const headers = authorization.match(settings.headerRegExp);
        if (headers !== null) {
          authorization = headers[0];
        }
      }

      const parts = authorization.split(/\s+/);

      if (typeof(options.tokenType) === 'object') {

        let checkFailTokenType = false;
        let tokenTypeCurrent = null;

        for (let e of options.tokenType) {

          if (parts[0].toLowerCase() !== e.toLowerCase()) {
            checkFailTokenType = true;
          }

          if (parts[0].toLowerCase() === e.toLowerCase()) {
            checkFailTokenType = false;
            tokenTypeCurrent = e;
            settings.tokenTypeCurrent = e;
            break;
          }

        }

        if (checkFailTokenType) {
          return reply(Boom.unauthorized(null, tokenTypeCurrent));
        }

        settings.headerRegExp = new RegExp(tokenTypeCurrent + '\\s+([^;$]+)', 'i');

      } else {

        if (parts[0].toLowerCase() !== options.tokenType.toLowerCase()) {
          return reply(Boom.unauthorized(null, options.tokenType));
        }

      }

      const token = parts[1];

      return settings.validateFunc.call(request, token, settings, (err, isValid, credentials, artifacts) => {

        if (err) {
          return reply(err, {
            credentials,
            log: {
              tags: ['auth', 'bearer'],
              data: err
            }
          });
        }

        if (!isValid) {
          return reply(Boom.unauthorized('Bad token', options.tokenType, {
            credentials,
            artifacts
          }));
        }

        if (!credentials || typeof credentials !== 'object') {
          return reply(Boom.badImplementation('Bad token string received for Bearer auth validation'), {
            log: {
              tags: 'token'
            }
          });
        }

        return reply.continue({
          credentials,
          artifacts
        });
      });
    }
  };

  return scheme;
};

const authBearerScheme = {

  /**
   * Return Authorize Scheme name
   *
   * @return {String}
   */
  schemeName: internals.schemeName,

  /**
   * Registers module into HAPI server
   *
   * @param  {Server}   server  HAPI Server
   * @param  {Object}   options Option data
   * @param  {Function} next    Next function
   */
  register: (server, options, next) => {
    server.auth.scheme(internals.schemeName, internals.implementation);
    next();
  }
};

authBearerScheme.register.attributes = {
  name: 'node-oauth-bearer',
  version: '0.1.0'
};

module.exports = authBearerScheme;
