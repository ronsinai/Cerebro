const { getMQ } = require('.');

class MQOperations {
  constructor(outExchange, options = {}) {
    this.channel = getMQ();

    this.outExchange = outExchange;

    this.PERSISTENT = true;

    this.options = options;
    this.options.persistent = this.PERSISTENT;
  }

  async publish(key, content) {
    // eslint-disable-next-line max-len
    await this.channel.publish(this.outExchange, key, Buffer.from(JSON.stringify(content)), this.options);
  }
}

module.exports = MQOperations;
