const Discord = require('discord.js');
const client = new Discord.Client();
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
   client.user.setActivity("Type $help",{type: 'WATCHING'})
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`);
  console.log('╚[═════════════════════════════════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════════════════════════════]╗');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('╚[════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════]╗')
  console.log(' Bot Is Online')
  console.log('╚[════════════]╝')
  console.log('')
  console.log('')
});
 
const ytdl = require("ytdl-core");
const { Client, Util } = require('discord.js');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
 
 
 
var prefix = "$" 
client.on('message', async msg => {
    if (msg.author.bot) return undefined;
   
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
   
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
 
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
 
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send(':x: **يجب تواجدك بروم صوتي **');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
           
            return msg.channel.send(':no_good: **لا يتواجد لدي صلاحية للتكلم بهذا الروم**');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send(':no_good: **لا يتواجد لدي صلاحية للتكلم بهذا الروم**');
        }
 
        if (!permissions.has('EMBED_LINKS')) {
            return msg.channel.sendMessage(":no_good: **يجب توآفر برمشن `EMBED LINKS`لدي **")
        }
 
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
           
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return msg.channel.send(`:white_check_mark:  **${playlist.title}** تم الإضافة إلى قأئمة التشغيل`);
        } else {
            try {
 
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                    const embed1 = new Discord.RichEmbed()
                    .setDescription(`**الرجاء إختيار رقم المقطع** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
 
                    .setFooter("Some Problem? contact Developer! : Da Shine#0022")
                    msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
                   
                    // eslint-disable-next-line max-depth
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 15000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send(':no_good: **لم يتم إختيار مقطع صوتي**');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(':no_good: **لا يتوفر نتائج بحث** ');
                }
            }
 
            return handleVideo(video, msg, voiceChannel);
        }
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send(':no_entry: **أنت لست بروم صوتي **');
        if (!serverQueue) return msg.channel.send(':x:  **لا يتوفر مقطع لتجاوزة**');
        serverQueue.connection.dispatcher.end(':white_check_mark:  **تم تجاوز هذا المقطع**');
        return undefined;
    } else if (command === `leave`) {
        if (!msg.member.voiceChannel) return msg.channel.send(':x: **يجب تواجدك بروم صوتي **');
        if (!serverQueue) return msg.channel.send(':x: **لا يتوفر مقطع لإيقافه**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end(':white_check_mark: **تم إيقاف هذا المقطع**');
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send(':x: **أنت لست بروم صوتي **');
        if (!serverQueue) return msg.channel.send(':x: **لا يوجد شيء قيد التشغيل**');
        if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send(':x: **لا يوجد شيء حالي قيد التشغيل**');
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`)
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `queue`) {
       
        if (!serverQueue) return msg.channel.send(':no_good: **لا يوجد شيء حالي قيد التشغيل**');
        let index = 0;
       
        const embedqu = new Discord.RichEmbed()
 
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`)
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `stop`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send(':white_check_mark:تم إيقاف الموسيقى مؤقتا!');
        }
        return msg.channel.send(':no_good: **لا يوجد شيء حالي ف العمل**');
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send(' :white_check_mark: **تم استئناف الموسيقى **');
        }
        return msg.channel.send(':no_good: **لا يوجد شيء حالي قيد التشغيل **');
    }
 
    return undefined;
});
 
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
   

    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);
 
        queueConstruct.songs.push(song);
 
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`**لا أستطيع دخول هذا الروم** ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(`:white_check_mark:  **${song.title}** تم اضافه الاغنية الي القائمة!`);
    }
    return undefined;
}
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
 
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
 
    serverQueue.textChannel.send(`:white_check_mark: بدء تشغيل : **${song.title}**`);
}
 
const adminprefix = "$vip";
const devs = ['274923685985386496'];
client.on('message', message => {
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!devs.includes(message.author.id)) return;
   
if (message.content.startsWith(adminprefix + 'setgdame')) {
  client.user.setGame(argresult);
    message.channel.sendMessage(`**${argresult} تم تغيير بلاينق البوت إلى **`)
} else
  if (message.content.startsWith(adminprefix + 'setname')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : تم تغيير أسم البوت إلى`)
return message.reply("**لا يمكنك تغيير الاسم يجب عليك الانتظآر لمدة ساعتين . **");
} else
  if (message.content.startsWith(adminprefix + 'setavatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
      } else    
if (message.content.startsWith(adminprefix + 'setT')) {
  client.user.setGame(argresult, "https://www.twitch.tv/idk");
    message.channel.sendMessage(`**تم تغيير تويتش البوت إلى  ${argresult}**`)
}
 
});
client.on("message", message => {
    if (message.content === `${prefix}help`) {
  const embed = new Discord.RichEmbed()
      .setColor("#0c0c0c")
      .setDescription(`
**$play <title|URL|subcommand>** - plays the provided song
**$skip** - votes to skip the current song
**$stop** - stops the current song and clears the queue
**$pause** - pauses the current song
**$resume** - resume the current song
**$volume [0-100]** - sets or shows volume
**$leave** - leave the bot from voice channel
**$np** - To see the song currently in use
**$queue [pagenum]** - shows the current queue
 `)
   message.channel.sendEmbed(embed)
   
   }
   });

// Help commands:
        case "help":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}help command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}help command!`);

        try {
            message.reply(":inbox_tray: **Please check your direct messages**");

            message.react('✅');

            message.author.send({embed: {
            color: 3447003,
            title: "Bot's commands",
            fields: [{
                name: "Regular commands",
                value: `**${settings.botPREFIX}help** - This message!\n\
**${settings.botPREFIX}modhelp** - Commands for admins and mods\n\
**${settings.botPREFIX}ownerhelp** - Owner's commands\n\
**${settings.botPREFIX}bluehelp** - secret\n\
**${settings.botPREFIX}ping** - How much ms?\n\
**${settings.botPREFIX}info** - Give you info about the bot\n\
**${settings.botPREFIX}8ball** - Ask the bot a (yes/no) question\n\
**${settings.botPREFIX}weather** - Send a place in the world\n\
**${settings.botPREFIX}invite** - Invite the bot\n\
**${settings.botPREFIX}server** - Join NotABot's server\n\
**${settings.botPREFIX}coinflip** - Flips a coin!\n\
**${settings.botPREFIX}userinfo** - Mention user for info\n\
**${settings.botPREFIX}avatar** - Get user's avatar\n\
**${settings.botPREFIX}stats** - Bot's stats\n\
**${settings.botPREFIX}serverinfo** - See server stats\n\
**${settings.botPREFIX}botservers** - Bot's servers\n\
**${settings.botPREFIX}quote** - Quotes by people\n\
**${settings.botPREFIX}notice** - I'll hug you\n\
**${settings.botPREFIX}issue** - Report a bug\n\
**${settings.botPREFIX}request** - Request new features\n\
**${settings.botPREFIX}roll** - Rolls a random number!\n\
**${settings.botPREFIX}dick** - Sizing a dick.\n\
**${settings.botPREFIX}dog** - Sends a picture of dog!\n\
**${settings.botPREFIX}translate** - Translates a textץ\n\
**${settings.botPREFIX}anime** - Sends a anime picץ\n\
**${settings.botPREFIX}caps** - Random capsץ\n\
**${settings.botPREFIX}advice** - Gives you an adviceץ\n\
**${settings.botPREFIX}donate** - Help NotABot?\n\
**${settings.botPREFIX}say** - Tell me what to say.\n\
**${settings.botPREFIX}calc** - Math questions calculator.`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© SenpaiBot"
            }
          }
        });

        message.author.send('KawaiiBot | Made by illusive');
        }
        catch(err) {
            message.channel.send('I could not send you my commands!');
        } 
        break;

    case "modhelp":
    console.log(`${message.author.tag} used the ${settings.botPREFIX}modhelp command!`);
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}modhelp command!`);

    message.react('✅');
    
    message.reply(":inbox_tray: **Please check your direct messages (Moderation commands)**");

    message.author.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Bot's commands",
        fields: [{
            name: "Moderation commands",
            value: `**${settings.botPREFIX}ban** - Bans a user from your server! (Moderators only!)\n\
**${settings.botPREFIX}kick** - Kicks a user out of the server! (Mederation only!)\n\
**${settings.botPREFIX}mute** - Muted a user with a **muted** role! (Moderation only!)\n\
**${settings.botPREFIX}unmute** - Unmutes a user and removes the **muted** role. (Moderation only!)\n\
**${settings.botPREFIX}softban** - Kicks a user and deletes his messages. (Moderation only!)\n\
**${settings.botPREFIX}clear** - Clear messages / user's messages! (Moderation only!)`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© KawaiiBot"
        }
      }
    });
    message.author.send('KawaiiBot | Made by illusive');
    break;

    case "ownerhelp":
    console.log(`${message.author.tag} used the ${settings.botPREFIX}ownerhelp command!`);
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}ownerhelp command!`);

    if (message.author.id == 229192961907228674) {
        message.react('✅');

        message.reply(":inbox_tray: **Please check your direct messages (Owner commands)**");

        message.author.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Bot's commands",
            fields: [{
                name: "Bot's owner commands",
                value: `**${settings.botPREFIX}botname** - Changes the bot's username. **Usage: ${settings.botPREFIX}botname [NAME]**\n\
**${settings.botPREFIX}botavatar** - Changes the bot's avatar. **Usage: ${settings.botPREFIX}botavatar [LINK]**\n\
**${settings.botPREFIX}botnick** - Changed the nickname in a server. **Usage: ${settings.botPREFIX}botnick [NICKNAME]**\n\
**${settings.botPREFIX}eval** - Evaluates a code. **Usage: ${settings.botPREFIX}eval [CODE]**\n\
**${settings.botPREFIX}shutdown** - Closes the CMD window!\n\
**${settings.botPREFIX}botstatus** - Change the bot's status! **Usage: ${settings.botPREFIX}botstats [STATUS]**`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© SenpaiBot"
            }
          }
        });
        message.author.send('KawaiiBot | Made by illusive');
    } else {
        message.react('❌');
        message.channel.send(`\`📛\` Only the owner of the bot can use this command.`);
    }
    break;

    case "bluehelp":
    console.log(`${message.author.tag} used the ${settings.botPREFIX}bluehelp command!`);
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}bluehelp command!`);

    if (message.author.id == '229192961907228674') {
        message.react('✅');

        message.reply(':wink: **Hello there my lord! Check your DM**');

        message.author.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Bot's commands",
            fields: [{
                name: "illusive's commands",
                value: `**${settings.botPREFIX}todo** - Shows illusive's TODO list.\n\
**${settings.botPREFIX}eval** - Evaluates a code.\n\
**${settings.botPREFIX}shutdown** - Closes the CMD window.`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© SenpaiBot"
            }
          }
        });
        message.author.send('SenpaiBot | Made by illusive');
    } else {
        message.react('❌');
        message.channel.send(`\`📛\` You're not allowed to execute this command, only my lord can use this command!\n\
        \`Lord: illusive\``);
    }
    break;
    }
});

        case "clear":
            console.log(`${message.author.tag} used the ${settings.botPREFIX}clear command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}clear command!`);

            if (!message.guild.member(message.author).hasPermission('MANAGE_MESSAGES')) return message.reply(':lock: **You** need `MANAGE_MESSAGES` permissions to execute `clear`');
            if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.reply(':lock: **I** need `MANAGE_MESSAGES` Permissions to execute `clear`');
            const firstUserClear = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !firstUserClear) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            message.channel.fetchMessages({
                limit: amount,
            }).then((messages) => {
                if (firstUserClear) {
                    const filterBy = firstUserClear ? firstUserClear.id : client.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                }
                message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            });
            break;

            case "botstatus":
            console.log(`${message.author.tag} used the ${settings.botPREFIX}botstatus command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}botstatus command!`);

            let setStatusArgs = message.content.split(' ').slice(1).join(' ');
            
            if (!message.author.id == settings.ownerID) return message.channel.send(`\`📛\` You're not allowed to execute this command!`);
            if (!setStatusArgs) return message.channel.send(`**Missing argument.**\nExample: **${settings.botPREFIX}setstatus [online, idle, dnd, invisible]**`);
            if (!setStatusArgs == "online" || "idle" || "dnd" || "invisible") return message.channel.send(`**Wrong argument.**\nExample: **${settings.botPREFIX}setstatus [online, idle, dnd, invisible]**`);

            client.user.setStatus(setStatusArgs)
            .then(message.channel.send(' :ok_hand: **Done**'));
            break;

            case "calc":
            console.log(`${message.author.tag} used the ${settings.botPREFIX}calc command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}calc command!`);
                let math = require('math-expression-evaluator');
                let calcArgs = message.content.split(' ').slice(1).join(' ');

                if (!calcArgs[0]) {
                    message.channel.send({embed: {
                        color: 3447003,
                        footer: {
                          icon_url: client.user.avatarURL,
                          text: "Please input an expression."
                        }
                      }
                    });
                }
                let calcResult;
                try {
                    calcResult = math.eval(calcArgs);
                } catch (e) { 
                    calcResult = 'Error: "Invalid Input"';
                }

                message.channel.send({embed: {
                    color: 3447003,
                    author: {
                      name: 'SenpaiBot\'s calculator',
                      icon_url: client.user.avatarURL
                    },
                    fields: [
                        { name: "Input", value: `\`\`\`js\n${calcArgs}\`\`\`` },
                      { name: "Output", value: `\`\`\`js\n${calcResult}\`\`\`` }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© SenpaiBot"
                    }
                  }
                });
            break;

        case "donate":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}donate command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}donate command!`);

        message.channel.send(`Hey there, Do want to donate for \`SenpaiBot\`? This is the link https://PayPal.me/SenpaiBot , but, Why would you donate us?\n\
**1.** I'm doing it for free and trying to help people with SenpaiBot\n\
**2.** SenpaiBot is under 24/7 host and I need to pay for it..\n\
**3.** I'm working on this bot everyday and putting my daily effort in it!\n\
**Thank you if you decided to become a patron!** :heart:`);
        break;

        case "server":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}server command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}server command!`);
        message.channel.send(`You can join KawaiiBot Support by clicking on this link:\n**https://discord.gg/3XZUuf9**`);
        break;

        case "stats":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}stats command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}stats command!`);

        let { version } = require("discord.js");
        let statsmoment = require("moment");
        require("moment-duration-format");
        let duration = statsmoment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

message.channel.send({embed: {
    color: 3447003,
    author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
    },
    title: "Stats:",
    fields: [
      { name: ":fire: Memory", value: `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`, inline: true},
      { name: ":clock1030:  Uptime", value: `**${duration}**`, inline: true},
      { name: ":speech_balloon: Servers", value: `**${client.guilds.size.toLocaleString()}**`, inline: true},
      { name: ":runner: Users", value: `**${client.users.size.toLocaleString()}**`, inline: true},
      { name: ":incoming_envelope: Discord.js", value: `**v${version}**`, inline: true},
      { name: ":white_check_mark: Node.js", value: `**${process.version}**`, inline: true}
    ],
    timestamp: new Date(),
    footer: {
        icon_url: client.user.avatarURL,
        text: "© SenpaiBot"
    }
  }
});
        
 
 
 
client.login(process.env.BOT_TOKEN);
