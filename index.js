// process.chdir('/home/zlyfer/DiscordBots/TTTDiscordZL');
const mysql = require('mysql');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const token = require("./token.json");
const mysql_config = require('./mysql_config.json');
var sql = mysql.createConnection({
	host: mysql_config.host,
	user: mysql_config.user,
	password: mysql_config.password,
	database: mysql_config.database
});

sql.connect(function(err) {
	if (err) throw err;
	console.log("Connected to MySQL Database!");
});

const client = new Discord.Client();
client.login(token.token);
const botPrefix = "~zltd~";

function checkPerm(guild, permission) {
	const botID = client.user.id;
	let hasPerm = guild.members.find('id', botID).hasPermission(permission);
	return hasPerm
}

function getMember(guild, DiscordID) {
	let member = guild.members.find('id', DiscordID);
	return member;
}

function getDiscordID(GuildID, SteamID64, callback) {
	sql.query("SELECT DiscordID FROM `" + GuildID + "` WHERE SteamID64 = " + SteamID64, (err, rows) => {
		if (rows) {
			var DiscordID = false;
			for (let i = 0; i < rows.length; i++) {
				if ('DiscordID' in rows[i]) {
					var DiscordID = rows[i].DiscordID;
				}
			}
			callback(DiscordID);
		}
	});
}

function getSteamID64(GuildID, DiscordID, callback) {
	sql.query("SELECT SteamID64 FROM `" + GuildID + "` WHERE DiscordID = " + DiscordID, (err, rows) => {
		if (err) throw err;
		if (rows) {
			var SteamID64 = false;
			for (let i = 0; i < rows.length; i++) {
				if ('SteamID64' in rows[i]) {
					var SteamID64 = rows[i].SteamID64;
				}
			}
			callback(SteamID64);
		}
	});
}

function checkStatus(guild) {
	if (checkPerm(guild, "MUTE_MEMBERS")) {
		let GuildID = guild.id;
		sql.query("SELECT * FROM `" + GuildID + "`", (err, rows) => {
			if (rows) {
				if (rows.length != 0) {
					for (let i = 1; i < 2; i++) {
						let row = rows[i];
						let member = getMember(guild, row.DiscordID);
						if (member) {
							if (row.Muted == '1' && member.serverMute == false) {
								member.setMute(true)
									.then(console.log(`Muted ${member.user.id} from ${GuildID}. Reason: Set to muted.`));
							} else if (row.Muted == '0' && member.serverMute == true) {
								member.setMute(false)
									.then(console.log(`Unmuted ${member.user.id} from ${GuildID}. Reason: Set to unmuted.`));
							}
						}
					}
				}
			}
		});
	}
}

function linkIDs(GuildID, DiscordID, SteamID64) {
	sql.query(`INSERT INTO ${GuildID} (DiscordID, SteamID64, Muted) VALUES (${DiscordID}, ${SteamID64}, '0') ON DUPLICATE KEY UPDATE DiscordID=${DiscordID}, SteamID64=${SteamID64}, Muted='0'`, (err, result) => {
		if (err) throw err;
	});
}

// Not used yet.
// function mute(GuildID, SteamID64) {
// 	sql.query("UPDATE `" + GuildID + "` SET Muted='1' WHERE SteamID64 = " + SteamID64, (err, result) => {
// 		if (err) throw err;
// 	});
// }

function unmute(GuildID, SteamID64) {
	sql.query("UPDATE `" + GuildID + "` SET Muted='0' WHERE SteamID64 = " + SteamID64, (err, result) => {
		if (err) throw err;
	});
}

client.on('message', (message) => {
	var Guild = message.guild;
	var Author = message.author;
	var Channel = message.channel;
	var MessageContent = message.content;
	if (MessageContent.indexOf(botPrefix) != -1) {
		if (!(Author.bot)) {
			MessageContent = MessageContent.replace(botPrefix, "");
			MessageContent = String(MessageContent).split(" ");
			var cmd = MessageContent[0];
			var msg = MessageContent[1];
			if (Channel.type == "text") {
				var GuildID = Guild.id;
				var AuthorID = Author.id;
				var Member = getMember(Guild, AuthorID);
				switch (cmd) {
					case "help":
						var helpObj = {
							"help": {
								"parameter": "none",
								"desc": "Shows this help message."
							},
							"link": {
								"parameter": "SteamID64",
								"desc": "Links your SteamID64 with your DiscordID."
							},
							"unmute": {
								"parameter": "none",
								"desc": "Unmutes you - even if you are already dead."
							}
						}
						var reply = `${Member}: Help is on the way:\n`;
						reply += "Make sure to use **" + botPrefix + "** as prefix!\n";
						reply += "The format is: **COMMAND** __PARAMETER__ - *DESCRIPTION*.\n\n";
						for (var key in helpObj) {
							reply += "**" + key + "** __" + helpObj[key].parameter + "__ - *" + helpObj[key].desc + "*\n";
						}
						reply += "\nINFO: If you encounter any issues or have questions, feel free to contact me.\n";
						Channel.send(reply);
						break;
					case "link":
						if (msg) {
							var SteamID64 = msg;
							linkIDs(GuildID, AuthorID, SteamID64);
							Channel.send(`${Member}: I linked your DiscordID **${AuthorID}** with SteamID64 **${SteamID64}**.`);
						} else {
							Channel.send(`${Member}: Please provide your SteamID64.`);
						}
						break;
					case "unmute":
						getSteamID64(GuildID, AuthorID, function(SteamID64) {
							if (SteamID64) {
								unmute(GuildID, SteamID64);
								Channel.send(`${Member} unmuted him-/herself.`);
							}
						});
						break;
					default:
						Channel.send(`${Member}: Sorry I didn't understand that. Use **${botPrefix}help** to see all available commands.`);
						break;
				}
			} else {
				message.reply(`Sorry, I am supposed to be controlled via a text channel on a discord server.`);
			}
		}
	}
});

function guildInit(guild) {
	var GuildID = guild.id;
	sql.query("CREATE TABLE IF NOT EXISTS `" + GuildID + "` (DiscordID VARCHAR(64) NOT NULL, SteamID64 VARCHAR(64) NOT NULL, Muted TINYINT(1) NOT NULL, UNIQUE ID (DiscordID))", (err, result) => {
		if (err) throw err;
	});
}

client.on('guildCreate', (guild) => {
	guildInit(guild);
});

client.on('ready', () => {
	client.user.setPresence({
			"status": "online",
			"afk": false,
			"game": {
				"name": "Use " + botPrefix + "help for help!"
			}
		})
		.then(console.log("Bot ready."));

	for (let i = 0; i < client.guilds.array().length; i++) {
		guildInit(client.guilds.array()[i]);
	}

	schedule.scheduleJob('*/1 * * * * *', function() {
		var guilds = client.guilds.array();
		for (let i = 0; i < guilds.length; i++) {
			checkStatus(guilds[i]);
		}
	});
});