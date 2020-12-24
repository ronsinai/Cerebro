const { getMQ } = require('.');

class MQOperations {
  constructor(options = {}) {
    this.channel = getMQ();

    this.PERSISTENT = true;

    this.options = options;
    this.options.persistent = this.PERSISTENT;
  }

  async sendToQueue(queue, content) {
    // eslint-disable-next-line max-len
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)), this.options);
  }
}

module.exports = MQOperations;
