const BodyParser = require('body-parser');
const Express = require('express');
require('express-async-errors');
const Nconf = require('nconf');

class App {
  start() {
    try {
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

  stop() {
    this._stopApp();
    console.info('Cerebro : server shutting down');
  }
}

module.exports = App;
