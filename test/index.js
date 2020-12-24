const Axios = require('axios');
const Nconf = require('nconf');

Nconf.use('memory');
Nconf.argv().env().defaults({
  PORT: 2004,
  NODE_ENV: 'test',
  LOG_LEVEL: 'silent',
  AMQP_URI: 'amqp://localhost:5672',
}).file({ file: './config.json' });

const Cerebro = require('../server');

before(async () => {
  this.cerebroInstance = new Cerebro();
  await this.cerebroInstance.start();
  Axios.defaults.baseURL = `http://localhost:${Nconf.get('PORT')}`;
});

after(async () => {
  await this.cerebroInstance.stop();
});
