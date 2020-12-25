const { getClient } = require('.');

class RedisOperations {
  constructor() {
    this.client = getClient();
  }

  async setMembers(key, members) {
    return await this.client.sadd(key, members);
  }

  async getMembers(key) {
    return await this.client.smembers(key);
  }
}

module.exports = RedisOperations;
