/*
 * @Author: toan.nguyen
 * @Date:   2016-05-02 13:11:52
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-11 15:21:01
 */

'use strict';

const config = require('config');
const BPromise = require('bluebird');
const nodemailer = require('nodemailer');

class MailHelper {


  constructor(options) {
    this.options = options || config.get('email.default');
    var conn = this.connectionString(this.options);


    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport(conn);
  }

  /**
   * Creates connection string from options
   * Set default host is gmail
   *
   * @param  {object} options mail options
   *
   * @return {string}         Connection string
   */
  connectionString(options) {

    if (options.connection) {
      return options.connection;
    }

    var protocol = options.protocol || 'smtps',
      email = options.email,
      password = options.password,
      host = options.host || 'smtp.gmail.com',
      port = options.port;

    return protocol + '://' + email + ':' + password + '@' + host + (port ? ':' + port : '');
  }

  /**
   * Send mail to someone
   *
   * @param  {object}   params   Input Params, including reveiver mail address, subject and body
   * @param  {Function} callback Callback function
   */
  send(params) {

    return new BPromise((resolve, reject) => {
      let mailFrom = params.from;
      if (!params.from) {
        if (this.options.sender) {
          mailFrom = '"' + this.options.sender + '" <' + this.options.email + '>';
        } else {
          mailFrom = this.options.email;
        }
      }

      let mailOptions = {
        from: mailFrom, // sender address
        to: params.to, // list of receivers
        subject: params.subject, // Subject line
      };

      if (params.html) {
        mailOptions.html = params.html;
      } else {
        mailOptions.text = params.text;
      }

      return this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }

        return resolve(info);
      });
    });

  }
}

module.exports = MailHelper;
