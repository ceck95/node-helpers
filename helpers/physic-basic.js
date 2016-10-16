/*
 * @Author: toan.nguyen
 * @Date:   2016-06-25 14:15:59
 * @Last Modified by:   toan.nguyen
 * @Last Modified time: 2016-10-14 15:51:45
 */

'use strict';

const Hoek = require('hoek');
const unitHelpers = require('./unit');

class PhysicBasic {

  /**
   * Calculates estimated ETA
   *
   * @param  {Double} distance The distance for computing
   * @param  {Double} velocity Average velocity of the target
   * @param  {Object} opts     Optional settings
   *
   * @return {Double}          Average ETA
   */
  static calculateETA(distance, velocity, opts) {

    Hoek.assert(distance >= 0, 'Distance must larger or equal than 0');
    Hoek.assert(velocity > 0, 'Velocity must larger than 0');

    opts = Hoek.applyToDefaults({
      minETA: 0,
      distanceUnit: 'km',
      velocityUnit: 'km/h',
      outputUnit: 'h'
    }, opts || {});

    let velocityUnits = opts.velocityUnit.split('/');

    if (opts.distanceUnit !== velocityUnits[0]) {
      distance = unitHelpers.convertLength(distance, opts.distanceUnit, velocityUnits[0]);
    }


    let eta = distance / velocity,
      result = unitHelpers.convertTime(eta, velocityUnits[1], opts.outputUnit);

    if (result < opts.minETA) {
      result = opts.minETA;
    }
    return result;
  }
}

module.exports = PhysicBasic;
