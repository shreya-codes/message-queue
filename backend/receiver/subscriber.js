const amqp = require('amqplib/callback_api');

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

server.listen(4001, () => {
	console.log('server started at port 4001 ');
});

io.on('connection', (socket) => {
	console.log(`user connected ${socket.id}`);

	amqp.connect('amqp://localhost', (connectionError, connection) => {
		if (connectionError) {
			throw connectionError;
		}

		connection.createChannel((channelError, channel) => {
			if (channelError) {
				throw channelError;
			}
			const queueName = 'queueMessage';
			channel.assertQueue(queueName);
			channel.consume(
				queueName,
				(messages) => {
					const msg = messages.content.toString();
					const message = JSON.parse(msg);
					if (message.priority >= 7) {
						socket.emit('message', message);
					}
				},
				{
					noAck: true,
				}
			);
		});
	});
});
