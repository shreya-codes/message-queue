const amqp = require('amqplib/callback_api');
var randomSentence = require('random-sentence');

function showTime() {
	let time = new Date();
	const date =
		time.getDate() + '/' + time.getMonth() + '/' + time.getFullYear();
	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();
	let am_pm = 'AM';
	if (hour > 12) {
		hour -= 12;
		am_pm = 'PM';
	} else if (hour === 0) {
		hour = 12;
		am_pm = 'AM';
	}
	hour = hour < 10 ? '0' + hour : hour;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;
	let timeDate = {
		time: hour + ':' + min + ':' + sec + ' ' + am_pm,
		date: date,
	};
	return timeDate;
}

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
			msg: randomSentence({ words: Math.floor(Math.random() * 10 + 1) }),
			timeStamp: showTime().time,
			priority: Math.floor(Math.random() * 10 + 1),
		};

		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(information)));
		setInterval(() => {
			let information = {
				msg: randomSentence({ words: 7 }),
				date: showTime().date,
				timeStamp: showTime().time,
				priority: Math.floor(Math.random() * 10 + 1),
			};

			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(information)));
			console.log(JSON.stringify(information));
		}, 50);
	});
});
