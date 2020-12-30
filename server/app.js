const BodyParser = require('body-parser');
const Express = require('express');
require('express-async-errors');
const Nconf = require('nconf');

const { getLogger } = require('./utils/logger');
const MQ = require('./utils/mq');
const Routes = require('./routes');

const logger = getLogger();

class App {
  async start() {
    try {
      await this._connectToMQ();
      this._initApp();
    }
    catch (err) {
      logger.error(err);
      throw err;
    }
  }

  _initApp() {
    this.app = Express();
    this.app.use(BodyParser.urlencoded({ extended: false }));
    this.app.use(BodyParser.json());

    this.app.get('/', (req, res) => {
      res.status(200).send({
        status: true,
        response: 'App and Running!',
      });
    });

    this.app.use(Routes());

    this.app.use((err, req, res, next) => {
      const status = Object.getPrototypeOf(err).status || 500;
      res.status(status).send(err);
    });

    this.appInstance = this.app.listen(Nconf.get('PORT'), (err) => {
      if (err) throw err;
      logger.info(`Cerebro : server running on ${Nconf.get('PORT')}`);
    });
  }

  _stopApp() {
    this.appInstance.close();
  }

  // eslint-disable-next-line class-methods-use-this
  async _connectToMQ() {
    await MQ.connect(Nconf.get('AMQP_URI'));
    await MQ.assertExchange(Nconf.get('AMQP_EXCHANGE'), Nconf.get('AMQP_EXCHANGE_TYPE'));
    logger.info(`Cerebro : connected to rabbitmq at ${Nconf.get('AMQP_URI')}`);
  }

  // eslint-disable-next-line class-methods-use-this
  async _closeMQConnection() {
    await MQ.close();
    logger.info(`Cerebro : disconnected from rabbitmq at ${Nconf.get('AMQP_URI')}`);
  }

  async stop() {
    try {
      this._stopApp();
      await this._closeMQConnection();
    }
    catch (err) {
      logger.error(err);
      throw err;
    }
    logger.info('Cerebro : server shutting down');
  }
}

module.exports = App;
