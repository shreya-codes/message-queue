const amqp = require('amqplib/callback_api');
var randomSentence = require('random-sentence');

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
		let information = {
			msg: randomSentence({ words: 7 }),
			timeStamp: new Date(),
			priority: Math.floor(Math.random() * 10 + 1),
		};

		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(information)));
		setInterval(() => {
			let information = {
				msg: randomSentence({ words: 7 }),
				timeStamp: new Date(),
				priority: Math.floor(Math.random() * 10 + 1),
			};

			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(information)));
			console.log(JSON.stringify(information));
		}, 100);
	});
});
