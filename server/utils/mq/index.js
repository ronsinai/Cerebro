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

const assertQueues = async (queues, options = {}) => {
  // eslint-disable-next-line no-param-reassign
  options.durable = DURABLE;

  await Promise.all(
    queues.map(async (queue) => await channel.assertQueue(queue, options)),
  );
};

const bindQueues = async (exchange, patterns) => {
  const queues = Object.keys(patterns);

  await Promise.all(
    queues.map(async (queue) => await Promise.all(
      patterns[queue].map(async (pattern) => await channel.bindQueue(queue, exchange, pattern)),
    )),
  );
};

const close = async () => {
  await channel.close();
  await connection.close();
};

const getMQ = () => channel;

module.exports = {
  connect,
  assertExchange,
  assertQueues,
  bindQueues,
  close,
  getMQ,
};
