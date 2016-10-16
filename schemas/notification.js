/*
 * @Author: toan.nguyen
 * @Date:   2016-05-25 09:33:54
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-13 11:17:10
 */

'use strict';


const Joi = require('joi');

let commonNotification = {
    uid: Joi.any(),
    title: Joi.any(),
    type: Joi.any(),
    subjectId: Joi.any(),
    subjectType: Joi.any(),
    createdAt: Joi.number().default(0),
    status: Joi.number().default(0),
    isRead: Joi.boolean().default(false),
  },
  notificationResponseItem = Joi.object(commonNotification).keys({
    message: Joi.any(),
  }),
  notificationResponse = notificationResponseItem,
  notificationResponseServer = Joi.object(commonNotification),
  notificationRequest = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().allow(['', null]),
    subjectId: Joi.string().allow(['', null]),
    subjectType: Joi.string().allow(['', null]),
    userId: Joi.string().allow(['', null]),
    audience: Joi.any(),
    save: Joi.boolean().default(true),
    messageAlert: Joi.boolean().default(false),
  });

module.exports = {
  request: notificationRequest,
  responseItem: notificationResponseItem,
  response: notificationResponse,
  responseServer: notificationResponseServer
};
