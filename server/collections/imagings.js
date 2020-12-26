const Joi = require('joi');
const Nconf = require('nconf');

const { getLogger } = require('../utils/logger');
const { imagingSchema } = require('../schemas');
const MQOperations = require('../utils/mq/operations');

const logger = getLogger();

class ImagingsCollection {
  // eslint-disable-next-line space-infix-ops
  constructor(collection = 'imagings') {
    this.mq = new MQOperations(Nconf.get('AMQP_EXCHANGE'));
  }

  // eslint-disable-next-line class-methods-use-this
  _getRoutingKey(imaging) {
    const { type, bodyPart, metadata } = imaging;
    const { sex } = metadata;
    return `${type}.${bodyPart}.${sex}`;
  }

  async diagnose(imaging) {
    try {
      Joi.assert(imaging, imagingSchema);
      const routingKey = this._getRoutingKey(imaging);
      logger.info(`Publishing imaging ${imaging._id} as ${routingKey} to ${Nconf.get('AMQP_EXCHANGE')} exchange`);
      await this.mq.publish(routingKey, imaging);
      logger.info(`Published imaging ${imaging._id} as ${routingKey} to ${Nconf.get('AMQP_EXCHANGE')} exchange`);
    }
    catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = ImagingsCollection;