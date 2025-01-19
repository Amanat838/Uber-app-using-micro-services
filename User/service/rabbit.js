const amqp = require('amqplib');

let channel, connection;

async function connect() {
    try {
        connection = await amqp.connect(process.env.RABBIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

async function publishToQueue(queueName, data) {
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(data));
        console.log(`Message sent to queue ${queueName}`);
    } catch (error) {
        console.error('Error publishing to queue', error);
    }
}

async function subscribeToQueue(queueName, callback) {
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                channel.ack(msg);
            }
        });
        console.log(`Subscribed to queue ${queueName}`);
    } catch (error) {
        console.error('Error subscribing to queue', error);
    }
}

connect();

module.exports = {
    publishToQueue,
    subscribeToQueue,
    connect
};