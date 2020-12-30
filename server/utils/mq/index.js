const Amqp = require('amqplib');

const DURABLE = true;

let connection;
let channel;

const connect = async (url) => {
  if (!channel) {
    connection = await Amqp.connect(url);
    channel = await connection.createChannel();
  }

  return channel;
};

const assertExchange = async (exchange, exchangeType, options = {}) => {
  // eslint-disable-next-line no-param-reassign
  options.durable = DURABLE;
  await channel.assertExchange(exchange, exchangeType, options);
};

const close = async () => {
  await channel.close();
  await connection.close();
};

const getMQ = () => channel;

module.exports = {
  connect,
  assertExchange,
  close,
  getMQ,
};
