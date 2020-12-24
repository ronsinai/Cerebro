const BodyParser = require('body-parser');
const Express = require('express');
require('express-async-errors');
const Nconf = require('nconf');

const Diagnoses = require('./diagnoses');
const MQ = require('./utils/mq');

class App {
  async start() {
    try {
      await this._connectToMQ();
      this._initApp();
    }
    catch (err) {
      console.error(err);
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

    this.app.use((err, req, res, next) => {
      const status = Object.getPrototypeOf(err).status || 500;
      res.status(status).send(err);
    });

    this.appInstance = this.app.listen(Nconf.get('PORT'), (err) => {
      if (err) throw err;
      console.info(`Cerebro : server running on ${Nconf.get('PORT')}`);
    });
  }

  _stopApp() {
    this.appInstance.close();
  }

  // eslint-disable-next-line class-methods-use-this
  async _connectToMQ() {
    await MQ.connect(Nconf.get('AMQP_URI'));
    const queues = [].concat(...Object.values(Diagnoses));
    await MQ.assertQueues(queues);
    console.info(`Cerebro : connected to rabbitmq at ${Nconf.get('AMQP_URI')}`);
  }

  // eslint-disable-next-line class-methods-use-this
  async _closeMQConnection() {
    await MQ.close();
    console.info(`Cerebro : disconnected from rabbitmq at ${Nconf.get('AMQP_URI')}`);
  }

  async stop() {
    try {
      this._stopApp();
      await this._closeMQConnection();
    }
    catch (err) {
      console.error(err);
      throw err;
    }
    console.info('Cerebro : server shutting down');
  }
}

module.exports = App;
