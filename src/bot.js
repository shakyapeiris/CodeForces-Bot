require('dotenv').config();

const axios = require('axios');
const {
	Client,
	IntentsBitField,
	WebhookClient,
	EmbedBuilder,
} = require('discord.js');

const launchDate = new Date('2022-10-12T07:30:00').getTime();
const currentDate = new Date(
	new Date().toLocaleString('en-US', {
		timeZone: 'Asia/Kolkata',
	})
).getTime();
const interval = 86400000;

const intents = new IntentsBitField();
intents.add(
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.MessageContent
);

const webhookClient = new WebhookClient({
	id: process.env.WEBHOOK_CLIENT_ID,
	token: process.env.WEBHOOK_CLIENT_TOKEN,
});

const client = new Client({ intents: intents });

const tracker = [];

const getProblem = (problemArr) => {
	const randomNum = Math.round(Math.random() * problemArr.length);
	const index = problemArr.length % randomNum;
	if (tracker.find((i) => i == index)) {
		return getProblem(problemArr);
	}
	console.log(index);
	tracker.push(index);
	return problemArr[index];
};

const getQuestion = (delay) => {
	setTimeout(async () => {
		axios
			.get('https://codeforces.com/api/problemset.problems')
			.then((res) => {
				const filteredProblems = res.data.result.problems.filter(
					(p) => p.rating <= 1100 && p.rating >= 900
				);
				const problem = getProblem(filteredProblems);
				const tags =
					problem.tags.length > 0
						? problem.tags.join(', ')
						: 'No tags';
				console.log(problem);
				console.log(tags);

				const problemURL = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
				const embed = new EmbedBuilder()
					.setURL(problemURL)
					.setTitle(problem.name)
					.setAuthor({
						name: 'CodeForces',
						iconURL:
							'https://repository-images.githubusercontent.com/316181742/36bfe3d9-b397-4364-830c-2b1315618042',
						url: 'http://codeforces.com/',
					})
					.setDescription(
						`Probelm ${problem.index} given for the contest ${problem.contestId}`
					)
					.setColor(0x0099ff)
					.setThumbnail(
						'https://avatars.githubusercontent.com/u/24797792?s=280&v=4'
					)
					.addFields([
						{
							name: 'Rating',
							value: problem.rating.toString(),
							inline: true,
						},
						{ name: 'Tags', value: tags, inline: true },
					]);
				client.channels.cache
					.get(process.env.CHANNEL_ID)
					.send("Checkout todays's daily coding problem");
				client.channels.cache.get(process.env.CHANNEL_ID).send({
					body: 'Checkout this problem',
					embeds: [embed],
				});
				getQuestion(delay);
			});
	}, delay);
};

client.on('ready', async () => {
	console.log(`${client.user.tag} has logged in...`);
	console.log(launchDate - currentDate);
	setTimeout(() => {
		console.log('Bot launched successfully!');
		getQuestion(interval);
	}, launchDate - currentDate);
});

client.on('messageCreate', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith('!')) {
		const messageBody = message.content.substring(
			1,
			message.content.length
		);
		console.log(messageBody);
		switch (messageBody) {
			case 'solved':
				client.channels.cache
					.get(message.channelId)
					.send(
						`<@${message.author.id}> solved todays daily coding problem`
					);
			default:
				client.channels.cache
					.get(message.channelId)
					.send('Invalid Command');
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
