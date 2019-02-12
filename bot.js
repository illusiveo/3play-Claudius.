const Discord = require("discord.js");
const settings = require("./settings.json");
const moment = require("moment");

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
        `${settings.botPREFIX}help | ${client.guilds.size} servers`,
        `${settings.botPREFIX}help | with you`,
        `${settings.botPREFIX}help | Konnichi Wa!`,
        `${settings.botPREFIX}help | uwu`,
        `${settings.botPREFIX}help | by: someone`,
        `${settings.botPREFIX}help | ${client.users.size} users!`
    ];

    setInterval(function() {
        client.user.setActivity(`${statusArray[~~(Math.random() * statusArray.length)]}`, { type: settings.statusTYPE });
    }, 100000);
});


var client = new Discord.Client();

// Fortunes for 8ball command
var fortunes = [
    ":8ball: **never, dumbass**",
    ":8ball: **you know that's a no**",
    ":8ball: **sure, why not**",
    ":8ball: **yes lol**",
    ":8ball: **ofc no**",
    ":8ball: **Well, Maybe**",
    ":8ball: **Ask again**",
    ":8ball: **Sometimes**",
    ":8ball: **no lmfao**",
    ":8ball: **HELL NO**",
    ":8ball: **FUCK YEAH**",
    ":8ball: **no no no**"
];

        let question = message.content.split(' ').slice(1).join(' ');

        if (!question) {
            return message.reply('What question should I answer on?\n\**Usage:** `~8ball is Blue Malgeran is sexy af?`');
        }

      message.channel.send({embed: {
        color: 3447003,
        author: {
          name: `8ball`,
          icon_url: 'http://8ballsportsbar.com/wp-content/uploads/2016/02/2000px-8_ball_icon.svg_.png'
        },
        fields: [{
            name: 'Info:',
            value: `**My answer:** ${fortunes[~~(Math.random() * fortunes.length)]}`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© KawaiiBot"
        }
      }
    });
        break;

        case "weather":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}weather command!`);
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}weather command!`);

        let apiKey = settings.weatherAPI;
        const fetch = require('node-fetch');
        let arg = message.content.split(' ').join(' ').slice(9);
        if (!arg) {
            return message.reply('I need a city to check :wink:');
        }
        fetch('http://api.openweathermap.org/data/2.5/weather?q=' + arg + '&APPID=' + apiKey + '&units=metric')
            .then(res => {
                return res.json();
            }).then(json => {
                if (json.main === undefined) {
                    return message.reply(`**${arg}** Isnt inside my query, please check again`);
                }
                let rise = json.sys.sunrise;
                let date = new Date(rise * 1000);
                let timestr = date.toLocaleTimeString();
                let set = json.sys.sunset;
                let setdate = new Date(set * 1000);
                let timesstr = setdate.toLocaleTimeString();
                const embed = new Discord.RichEmbed()
              .setColor(26368)
              .setTitle(`This is the weather for :flag_${json.sys.country.toLowerCase()}: **${json.name}**`)
              .addField('Information:', `**Temp:** ${json.main.temp}°C\n**Wind speed:** ${json.wind.speed}m/s\n**Humidity:** ${json.main.humidity}%\n**Sunrise:** ${timestr}\n**Sunset:** ${timesstr}`);
                message.channel.send({embed})
              .catch(console.error);
            }).catch(err => {
                if (err) {
                    message.channel.send('Something went wrong while checking the query!');
                }
            });
        break;

        
        if(message.mentions.users.first()) { //Check if the message has a mention in it.
            let user = message.mentions.users.first(); //Since message.mentions.users returns a collection; we must use the first() method to get the first in the collection.
            let output = user.username + "#" + user.discriminator /*Username and Discriminator*/ +
            "\nAvatar URL: " + user.avatarURL; /*The Avatar URL*/
            message.channel.sendMessage(output); //We send the output in the current channel.
      } else {
            message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
      }
        break;

        case "serverinfo":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}serverinfo command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}serverinfo command!`);

        let guildmessageServerInfo = message.guild;
        let nameServerInfo = message.guild.name;
        let createdAtServerInfo = moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        let channelsServerInfo = message.guild.channels.size;
        let ownerServerInfo = message.guild.owner.user.tag;
        let memberCountServerInfo = message.guild.memberCount;
        let largeServerInfo = message.guild.large;
        let iconUrlServerInfo = message.guild.iconURL;
        let regionServerInfo = message.guild.region;
        let afkServerInfo = message.guild.channels.get(message.guild.afkChannelID) === undefined ? 'None' : message.guild.channels.get(guildmessageServerInfo.afkChannelID).name;

            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: message.guild.name,
                  icon_url: message.guild.iconURL
                },
                title: "Server Information",
                fields: [{
                    name: "Channels",
                    value: `**Channel Count:** ${channelsServerInfo}\n**AFK Channel:** ${afkServerInfo}`
                  },
                  {
                    name: "Members",
                    value: `**Member Count:** ${memberCountServerInfo}\n**Owner:** ${ownerServerInfo}\n**Owner ID:** ${message.guild.owner.id}`
                  },
                  {
                    name: "More",
                    value: `**Created at:** ${createdAtServerInfo}\n**Large Guild?:** ${largeServerInfo ? 'Yes' : 'No'}\n**Region:** ${regionServerInfo}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: ";p"
                }
              }
            });
        break;

        var hugs = [
            "`＼(^o^)／`",
            "`d=(´▽｀)=b`",
            "`⊂((・▽・))⊃`",
            "`⊂( ◜◒◝ )⊃`",
            "`⊂（♡⌂♡）⊃`",
            "`⊂(◉‿◉)つ`"
        ];
        message.reply(`${hugs[~~(Math.random() * hugs.length)]}`);
        break;

        let dicksize = ["8=D", "8==D", "8===D", "8====D", "8=====D", "8======D", "8=======D", "8========D", "8=========D", "8==========D", "404 not found"];
        let dickuser = message.mentions.users.first();

        if (!dickuser) {
            return message.channel.send('You must mention someone!\n(This is 100% accurate!)');
        }
        if (dickuser.id == "229192961907228674") {
            return message.channel.send(`**${dickuser} Size: ** 8=============================D\nSized by **${message.author.tag}**`);
        }

        message.channel.send(`**${dickuser} Size: ** ${dicksize[~~Math.floor(Math.random() * dicksize.length)]}\nSized by **${message.author.tag}**`);
        break;

        case "dog":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}dog command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}dog command!`);

        const dogsuperagent = require('superagent');

        let {body} = await dogsuperagent
        .get(`https://random.dog/woof.json`);

        let dogpicembed = new Discord.RichEmbed()
        .setColor('#ff9900')
        .setTitle('Dog Picture')
        .setImage(body.url);

        message.channel.send(dogpicembed);
        break;
        
        case "say":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}say command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}say command!`);

        const botsay = message.content.split(' ').slice(1).join(' ');

        if (!botsay) return message.channel.send(':no_good: **Please tell me what to say**');

            message.delete();
            message.channel.send(botsay);
        break;

        case "translate":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}translate command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}translate command!`);

        const translate = require('google-translate-api');

    let toTrans = message.content.split(' ').slice(1);
    let language;

    language = toTrans[toTrans.length - 2] === 'to' ? toTrans.slice(toTrans.length - 2, toTrans.length)[1].trim() : undefined;
    if (!language) {
        return message.reply(`Please supply valid agruments.\n**Example** \`${settings.botPREFIX}translate [text] to [language]\``);
    }
    let finalToTrans = toTrans.slice(toTrans.length - toTrans.length, toTrans.length - 2).join(' ');
    translate(finalToTrans, {to: language}).then(res => {
            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: 'NotABot\'s translator',
                  icon_url: client.user.avatarURL
                },
                fields: [{
                    name: "Translator",
                    value: `**From:** ${res.from.language.iso}\n\`\`\`${finalToTrans}\`\`\`\n**To: **${language}\n\`\`\`${res.text}\`\`\``
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: ";p"
                }
              }
            });
    }).catch(err => {
        message.channel.send({
            embed: {
                description: '❌ We could not find the supplied language.',
                color: 0xE8642B
            }
        });
    });
        break;
        
        const animesf = require('snekfetch');

            let res = await animesf.get('http://api.cutegirls.moe/json');
            if (res.body.status !== 200) {
                return message.channel.send('An error occurred while processing this command.');
            }
            let animepicembed = new Discord.RichEmbed()
            .setColor('#f266f9')
            .setTitle('Anime Picture')
            .setImage(res.body.data.image);
    
            message.channel.send(animepicembed);
        break;


// Bot's token (Synced from settings.json)

client.login(settings.botTOKEN)
