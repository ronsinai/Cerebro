const Redis = require('../../server/utils/redis');

const initDB = async (config) => {
  await Redis.initDB(config);
};

module.exports = {
  initDB,
};
