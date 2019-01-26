const Discord = require("discord.js");
const settings = require("./settings.json");
const moment = require("moment");

var client = new Discord.Client();

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
    let statusArray = [
        `${settings.botPREFIX}help | ${client.guilds.size} servers!`,
        `${settings.botPREFIX}help | ${client.channels.size} channels!`,
        `${settings.botPREFIX}help | ${client.users.size} users!`
    ];
 
client.login(process.env.BOT_TOKEN);
