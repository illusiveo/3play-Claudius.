const Discord = require("discord.js");
const settings = require("./settings.json");
const moment = require("moment");

var client = new Discord.Client();

// Fortunes for 8ball command
var fortunes = [
    "**Yes**",
    "**No**",
    "**Maybe**",
    "**Ask again**",
    "**Sometimes**",
    "**Okay**",
    "**HELL NO**",
    "**FUCK YEAH**",
    "**no no no**"
];

client.on("ready", function() {
    var clientonmessage = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${client.user.tag}
Working on ${client.guilds.size} servers!
${client.channels.size} channels and ${client.users.size} users cached!
I am logged in and ready to roll!
LET'S GO!
------------------------------------------------------
------------------------------------------------------
-----------------Bot's commands logs------------------`

    console.log(clientonmessage);
    //The default game.
    //client.user.setActivity(`${client.guilds.size} servers | ${settings.botPREFIX}help`, { type: settings.statusTYPE });

    // Cool interval loop for the bot's game.
    let statusArray = [
        `${settings.botPREFIX}help | ${client.guilds.size} servers!`,
        `${settings.botPREFIX}help | ${client.channels.size} channels!`,
        `${settings.botPREFIX}help | By : illusive!`,
        `${settings.botPREFIX}help | ${client.users.size} users!`
    ];

    setInterval(function() {
        client.user.setActivity(`${statusArray[~~(Math.random() * statusArray.length)]}`, { type: settings.statusTYPE });
    }, 100000);
});

// awooooo command.

const { Command } = require('klasa');

module.exports = class AwooCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Awooo!'
		});
	}

	async run(msg) {
		const { url } = await this.wolkeClient.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed().setImage(url));
	}
};

// hug command.

const { Command } = require('klasa');


module.exports = class HugCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['EMBED_MESSAGE'],
			description: 'Hug someone or get hugged'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeClient.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} hugged ${member}` : `${msg.member} got hugged`)
			.setImage(url)
		);
	}
};

// set token from heroku, or from setting.json

client.login(process.env.BOT_TOKEN);
