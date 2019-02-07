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


const nsfwGuide = 'https://i.imgur.com/cdakHFu.png'

class Command {
	/**
	 * @param {import('../chitanda')} client 
	 * @param {*} info 
	 * @param {string} module
	 */
	constructor(client, info, module) {
		Command.validateInfo(client, info, module);

		this.client = client;
		this.messageUtil = new MessageUtil(client);
		this.name = info.name;
		this.aliases = info.aliases;
		this.description = info.description;
		this.usages = info.usages;
		this.runIn = info.runIn;
		this.isNSFW = info.isNSFW;
		this.ownerOnly = info.ownerOnly;
		this.module = module;
	}

	static validateInfo(client, info) {
		if (!client) throw new Error('A client must be specified.');

		if (typeof info !== 'object') throw new TypeError('Command info must be an Object.');

		if (typeof info.name !== 'string') throw new Error('Command name must be a string.');
		if (info.name.includes(' ')) throw new Error('Command name must not have space.');
		if (info.name !== info.name.toLowerCase()) throw new Error('Command name must be lowercase.');

		if (!module) throw new Error('Module should not be empty');
	}

	execute(msg, args) {
		if (this.checkChannel(msg)) {
			if (this.checkNsfw(msg)) {
				this.sendFromMessage(msg, {
					embed: Embed.create(nsfwGuide, null, 'This command can only be used in nsfw channel')
				});
			} else if (this.ownerOnly && !config.owner.includes(msg.author.id)) {
				this.sendFromMessage(msg, 'You dont have permission to use this command');
			} else {
				this.run(msg, args);
			}
		}
	}

	/**
	 * 
	 * @param {import('discord.js').Message} msg 
	 * @param {*} content 
	 */
	sendFromMessage(msg, content) {
		return this.sendFromChannel(msg.channel, content);
	}

	/**
	 * 
	 * @param {import('discord.js').TextChannel | import('discord.js').DMChannel | import('discord.js').GroupDMChannel} channel 
	 * @param {*} content 
	 */
	sendFromChannel(channel, content) {
		return channel.send(content)
        .catch((err) => {
            var msg = 'Error! Please report to the support server if something went wrong';
            msg += err.message ? (': `' + err.message + '`') : '';
            channel.send(msg).catch(() => {});
            this.client.errorLogger.commandFail(err);
        })
	}

	checkChannel(msg) {
		return this.runIn.includes(msg.channel.type);
	}

	checkNsfw(msg) {
		return this.isNSFW && !msg.channel.nsfw;
	}
}

module.exports = Command;

const Embed = require('../../util/embed');

const info = {
    name: "cry",
    aliases: [],
    description: "Crying :((",
    runIn: ["text", "dm"],
    ownerOnly: false
}

class Cry extends Command {
    constructor(client, module) {
		super(client, info, module);
	}

    run(msg, args) {
        var message, link;
        message = `${msg.author.toString()} is crying ;-;`;
        link = link ? link : ramMoe.image('cry');
        this.sendFromMessage(msg, {
            embed: Embed.create(link, msg.author.tag, message)
        });
    }
}

const request = require('sync-request');

const baseUrl = 'https://rra.ram.moe';
const imagePath = '/i/r';
const imageTypeParam = '?type=';
const httpMethod = 'GET';

const imageEndpoint = baseUrl + imagePath + imageTypeParam;

class RamMoe {
    constructor() {
        this.tags = [
            "cry", "cuddle", "hug", "kiss", "lewd",
            "lick", "nom", "nyan", "owo", "pat",
            "pout", "rem", "slap", "smug", "stare",
            "tickle", "triggered", "nsfw-gtn",
            "potato", "kermit"
        ];
    }

    image(tag) {
        if (!tag) return null;
        var res = request(httpMethod, imageEndpoint + tag);
        return baseUrl + JSON.parse(res.getBody('utf8')).path;
    }
}

module.exports = RamMoe;
module.exports = Cry;

// set token from heroku, or from setting.json

client.login(process.env.BOT_TOKEN);
