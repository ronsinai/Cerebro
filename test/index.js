const Axios = require('axios');
const Nconf = require('nconf');

Nconf.use('memory');
Nconf.argv().env().defaults({
  PORT: 2004,
  NODE_ENV: 'test',
  LOG_LEVEL: 'silent',
  AMQP_URI: 'amqp://localhost:5672',
  REDIS_URI: 'redis://localhost:6379',
  REDIS_INDEX: 1,
}).file({ file: './config.json' });

const Cerebro = require('../server');
const { initDB } = require('./utils/redis');

before(async () => {
  this.cerebroInstance = new Cerebro();
  await this.cerebroInstance.start();
  Axios.defaults.baseURL = `http://localhost:${Nconf.get('PORT')}`;
});

beforeEach(async () => initDB(Nconf.get('diagnoses')));

after(async () => {
  await this.cerebroInstance.stop();
});
