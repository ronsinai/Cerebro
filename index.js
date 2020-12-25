const Nconf = require('nconf');
const Process = require('process');

Nconf.use('memory');
Nconf.argv().env().defaults({
  PORT: 2004,
  NODE_ENV: 'dev',
  LOG_LEVEL: 'info',
  AMQP_URI: 'amqp://localhost:5672',
  REDIS_URI: 'redis://localhost:6379',
  REDIS_INDEX: 0,
}).file({ file: './config.json' });

const App = require('./server');

const appInstance = new App();
appInstance.shutdown = async () => {
  await appInstance.stop();
};

Process.on('SIGINT', appInstance.shutdown);
Process.on('SIGTERM', appInstance.shutdown);

(async () => {
  try {
    await appInstance.start();
  }
  catch (err) {
    await appInstance.stop();
  }
})();
