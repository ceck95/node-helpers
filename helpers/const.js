/*
 * @Author: toan.nguyen
 * @Date:   2016-05-30 08:35:24
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-06 17:02:26
 */

'use strict';

const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DISABLED: 2,
  DELETED: 3
};

class ConstHelper {

  /**
   * Returns list of month in a years
   *
   * @return {Array} List of months in string
   */
  get months() {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  /**
   * Returns model status
   *
   * @return {Object}
   */
  get status() {
    return STATUS;
  }
}

module.exports = ConstHelper;
