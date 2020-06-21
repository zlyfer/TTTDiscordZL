// jshint esversion: 9
process.chdir("/home/zlyfer/DiscordBots/TTTDiscordZL");
const mysql = require("mysql");
const Discord = require("discord.js");
const schedule = require("node-schedule");
const uniqid = require("uniqid");
const token = require("./token.json");
const mysql_config = require("./mysql_config.json");
var sql = mysql.createConnection({
  host: mysql_config.host,
  user: mysql_config.user,
  password: mysql_config.password,
  database: mysql_config.database,
});

sql.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL Database!");
});

const client = new Discord.Client();
client.login(token.token);
const botPrefix = "~zltd~";

function checkPerm(guild, permission) {
  const botID = client.user.id;
  let hasPerm = guild.members.find("id", botID).hasPermission(permission);
  return hasPerm;
}

function getMember(guild, DiscordID) {
  let member = guild.members.find("id", DiscordID);
  return member;
}

function getDiscordID(GuildID, SteamID64, callback) {
  sql.query("SELECT DiscordID FROM `" + GuildID + "` WHERE SteamID64 = " + SteamID64, (err, result) => {
    if (err) throw err;
    if (result) {
      var DiscordID = false;
      for (let i = 0; i < result.length; i++) {
        if ("DiscordID" in result[i]) {
          var DiscordID = result[i].DiscordID;
        }
        callback(DiscordID);
      }
    }
  });
}

function getSteamID64(GuildID, DiscordID, callback) {
  sql.query("SELECT SteamID64 FROM `" + GuildID + "` WHERE DiscordID = " + DiscordID, (err, result) => {
    if (err) throw err;
    if (result) {
      var SteamID64 = false;
      for (let i = 0; i < result.length; i++) {
        if ("SteamID64" in result[i]) {
          var SteamID64 = result[i].SteamID64;
        }
        callback(SteamID64);
      }
    }
  });
}

function checkStatus(guild) {
  if (checkPerm(guild, "MUTE_MEMBERS")) {
    let GuildID = guild.id;
    sql.query("SELECT * FROM `" + GuildID + "`", (err, result) => {
      if (result) {
        if (result.length != 0) {
          for (let i = 1; i < result.length; i++) {
            let resulti = result[i];
            let member = getMember(guild, resulti.DiscordID);
            if (member) {
              if (resulti.Muted == "1" && resulti.Connected == "1" && member.serverMute == false) {
                member
                  .setMute(true)
                  .then(console.log(`Muted ${member.user.id} from ${GuildID}. Reason: Set to muted.`));
              } else if (resulti.Muted == "0" && member.serverMute == true) {
                member
                  .setMute(false)
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
  sql.query(
    "INSERT INTO `" +
      GuildID +
      "` (DiscordID, SteamID64, Muted) VALUES (" +
      DiscordID +
      ", " +
      SteamID64 +
      ", '0') ON DUPLICATE KEY UPDATE DiscordID = " +
      DiscordID +
      ", SteamID64 = " +
      SteamID64 +
      ", Muted = 0" +
      ", Connected = 0",
    (err, result) => {
      if (err) throw err;
    }
  );
}

// Not used yet.
// function mute(GuildID, SteamID64) {
// 	sql.query("UPDATE `" + GuildID + "` SET Muted = '1' WHERE SteamID64 = " + SteamID64, (err, result) => {
// 		if (err) throw err;
// 	});
// }

function unmute(GuildID, SteamID64) {
  sql.query("UPDATE `" + GuildID + "` SET Muted = '0' WHERE SteamID64 = " + SteamID64, (err, result) => {
    if (err) throw err;
  });
}

function init(guild) {
  sql.query(
    "CREATE TABLE IF NOT EXISTS `tokens` (GuildID VARCHAR(64) NOT NULL, Token VARCHAR(18) NOT NULL, TokenSent TINYINT(1) NOT NULL, UNIQUE ID (GuildID))",
    (err, result) => {
      if (err) throw err;
    }
  );
  guildInit(guild);
  checkToken(guild);
}

function tokenProcess(tokenCheck, guild) {
  switch (tokenCheck) {
    case "create":
      createToken(guild);
      break;
    case "send":
      sendToken(guild);
      break;
    case false:
      break;
  }
}

function guildInit(guild) {
  sql.query(
    "CREATE TABLE IF NOT EXISTS `" +
      guild.id +
      "` (DiscordID VARCHAR(64) NOT NULL, SteamID64 VARCHAR(64) NOT NULL, Muted TINYINT(1) NOT NULL, Connected TINYINT(1) UNIQUE ID (DiscordID))",
    (err, result) => {
      if (err) throw err;
    }
  );
}

function checkToken(guild) {
  sql.query("SELECT TokenSent FROM `tokens` WHERE GuildID = " + guild.id, (err, result) => {
    if (err) throw err;
    if (result) {
      if (result.length != 0) {
        let resulti = result[0];
        if (resulti.TokenSent == 1) {
          tokenProcess(false, guild);
        } else if (resulti.TokenSent == 0) {
          tokenProcess("send", guild);
        }
      } else {
        tokenProcess("create", guild);
      }
    }
  });
}

function createToken(guild) {
  let token = uniqid();
  sql.query(
    "INSERT INTO `tokens` (GuildID, Token, TokenSent) VALUES (" +
      guild.id +
      ", '" +
      token +
      "', 0) ON DUPLICATE KEY UPDATE Token = '" +
      token +
      "'",
    (err, result) => {
      if (err) throw err;
    }
  );
  sendToken(guild);
}

function sendToken(guild) {
  sql.query("SELECT Token FROM `tokens` WHERE GuildID = " + guild.id, (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      let resulti = result[0];
      guild.owner
        .send(
          "This is your token: `" +
            resulti.Token +
            "`.\nYou need to insert this token inside the _TTTDiscordZL.lua_ file.\nFor more information visit https://github.com/zlyfer/TTTDiscordZL#install-garrys-mod-server-script.\nHave fun!"
        )
        .then(() => {
          sql.query("UPDATE `tokens` SET TokenSent = '1' WHERE GuildID = " + guild.id, (err, result) => {
            if (err) throw err;
          });
        });
    }
  });
}

client.on("message", (message) => {
  var Guild = message.guild;
  var Author = message.author;
  var Channel = message.channel;
  var MessageContent = message.content;
  if (MessageContent.indexOf(botPrefix) != -1) {
    if (!Author.bot) {
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
              help: {
                parameter: "none",
                desc: "Shows this help message.",
              },
              link: {
                parameter: "SteamID64",
                desc: "Links your SteamID64 with your DiscordID.",
              },
              unmute: {
                parameter: "none",
                desc: "Unmutes you - even if you are already dead.",
              },
              token: {
                parameter: "none",
                desc: "Generate a new token. Only usable by the Discord server owner!",
              },
            };
            var reply = `help is on the way:\n`;
            reply += "Make sure to use **" + botPrefix + "** as prefix!\n";
            reply += "The format is: **COMMAND** __PARAMETER__ - *DESCRIPTION*.\n\n";
            for (var key in helpObj) {
              reply += "**" + key + "** __" + helpObj[key].parameter + "__ - *" + helpObj[key].desc + "*\n";
            }
            reply += "\nINFO: If you encounter any issues or have questions, feel free to contact me.\n";
            message.reply(reply);
            break;
          case "link":
            if (msg) {
              var SteamID64 = msg;
              linkIDs(GuildID, AuthorID, SteamID64);
              // message.reply(`I linked your DiscordID **${AuthorID}** with SteamID64 **${SteamID64}**.`);
              message.react("👍");
              setTimeout(
                function () {
                  message.delete();
                },
                3000,
                message
              );
            } else {
              message.reply(`please provide your SteamID64.`);
              message.delete();
            }
            break;
          case "unmute":
            getSteamID64(GuildID, AuthorID, function (SteamID64) {
              if (SteamID64) {
                unmute(GuildID, SteamID64);
              }
            });
            message.channel.send(`${Member} unmuted him-/herself.`);
            break;
          case "token":
            if (message.author.id == message.guild.owner.id) {
              createToken(message.guild);
            } else {
              message.author.send(`Sorry, only the Discord server owner can request a new token.`);
            }
            break;
          default:
            message.reply(`sorry I didn't understand that. Use **${botPrefix}help** to see all available commands.`);
            break;
        }
      } else {
        message.reply(`Sorry I am supposed to be controlled via a text channel on a discord server.`);
      }
    }
  }
});

client.on("guildCreate", (guild) => {
  init(guild);
});

client.on("ready", () => {
  client.user
    .setPresence({
      status: "online",
      afk: false,
      game: {
        name: "Use " + botPrefix + "help for help!",
      },
    })
    .then(console.log("Bot ready."));

  for (let i = 0; i < client.guilds.array().length; i++) {
    init(client.guilds.array()[i]);
  }

  // schedule.scheduleJob("*/1 * * * * *", function () {
  setInterval(() => {
    for (let i = 0; i < client.guilds.array().length; i++) {
      checkStatus(client.guilds.array()[i]);
    }
  }, 1000);
  // });
});
