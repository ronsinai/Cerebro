const Axios = require('axios');
const Nconf = require('nconf');

Nconf.use('memory');
Nconf.argv().env().defaults({
  PORT: 2004,
  NODE_ENV: 'test',
});

const Cerebro = require('../server');

before(() => {
  this.cerebroInstance = new Cerebro();
  this.cerebroInstance.start();
  Axios.defaults.baseURL = `http://localhost:${Nconf.get('PORT')}`;
});

after(() => {
  this.cerebroInstance.stop();
});
