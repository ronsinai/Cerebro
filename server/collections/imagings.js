const Joi = require('joi');

const { getLogger } = require('../utils/logger');
const { imagingSchema } = require('../schemas');
const MQOperations = require('../utils/mq/operations');
const RedisOperations = require('../utils/redis/operations');

const logger = getLogger();

class ImagingsCollection {
  // eslint-disable-next-line space-infix-ops
  constructor(collection = 'imagings') {
    this.mq = new MQOperations();
    this.redis = new RedisOperations();
  }

  async diagnose(imaging) {
    try {
      Joi.assert(imaging, imagingSchema);
      const imagingDiagnoses = await this.redis.getMembers(imaging.type);
      logger.info(`Publishing imaging ${imaging._id} to queues: ['${imagingDiagnoses.join("', '")}']`);

      await Promise.all(
        imagingDiagnoses.map(async (diagnosis) => await this.mq.sendToQueue(diagnosis, imaging)),
      );
      logger.info(`Published imaging ${imaging._id} to queues: ['${imagingDiagnoses.join("', '")}']`);

      return imagingDiagnoses;
    }
    catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

module.exports = ImagingsCollection;