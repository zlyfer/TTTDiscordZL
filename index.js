// jshint esversion: 9
const mysql = require("mysql2");
const { Client, GatewayIntentBits } = require("discord.js");
const uniqid = require("uniqid");
const { token } = require("./token.json");
const db_config = require("./db_config.json");
var sql = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

sql.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + sql.threadId);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const botPrefix = "~zltd~";

function checkPerm(guild, permission) {
  const botID = client.user.id;
  const hasPerm = getMember(guild, botID).hasPermission(permission);
  return hasPerm;
}

function getMember(guild, DiscordID) {
  const member = guild.members.cache.get(DiscordID);
  return member;
}

function getDiscordID(GuildID, SteamID64, callback) {
  const query = `
    SELECT DiscordID FROM guild_${GuildID} WHERE SteamID64 = ?
  `;

  sql.query(query, [SteamID64], (err, result) => {
    if (err) throw err;
    if (result && result.length > 0) {
      callback(result[0].DiscordID || false);
    } else {
      callback(false);
    }
  });
}

function getSteamID64(GuildID, DiscordID, callback) {
  const query = `
    SELECT SteamID64 FROM guild_${GuildID} WHERE DiscordID = ?
  `;

  sql.query(query, [DiscordID], (err, result) => {
    if (err) throw err;
    if (result && result.length > 0) {
      callback(result[0].SteamID64 || false);
    } else {
      callback(false);
    }
  });
}

function checkStatus(guild) {
  if (checkPerm(guild, "MUTE_MEMBERS")) {
    const GuildID = guild.id;
    const query = `
      SELECT * FROM guild_${GuildID}
    `;

    sql.query(query, (err, result) => {
      if (err) throw err;
      if (result && result.length > 0) {
        result.forEach((resulti) => {
          const member = getMember(guild, resulti.DiscordID);
          if (member) {
            if (resulti.Muted == "1" && resulti.Connected == "1" && !member.serverMute) {
              member.setMute(true).then(() => {
                console.log(`Muted ${member.user.id} from ${GuildID}. Reason: Set to muted.`);
              });
            } else if (resulti.Muted == "0" && member.serverMute) {
              member.setMute(false).then(() => {
                console.log(`Unmuted ${member.user.id} from ${GuildID}. Reason: Set to unmuted.`);
              });
            }
          }
        });
      }
    });
  }
}

function linkIDs(GuildID, DiscordID, SteamID64) {
  const query = `
    INSERT INTO guild_${GuildID} (DiscordID, SteamID64, Muted, Connected)
    VALUES (?, ?, '0', '0')
    ON DUPLICATE KEY UPDATE
    DiscordID = VALUES(DiscordID),
    SteamID64 = VALUES(SteamID64),
    Muted = VALUES(Muted),
    Connected = VALUES(Connected)
  `;

  sql.query(query, [DiscordID, SteamID64], (err, result) => {
    if (err) throw err;
    console.log("Row inserted or updated");
  });
}

function unmute(GuildID, SteamID64) {
  const query = `
    UPDATE guild_${GuildID} SET Muted = '0' WHERE SteamID64 = ?
  `;

  sql.query(query, [SteamID64], (err, result) => {
    if (err) throw err;
  });
}

function init(guild) {
  const query = `
    CREATE TABLE IF NOT EXISTS tokens (
      GuildID VARCHAR(64) NOT NULL,
      Token VARCHAR(18) NOT NULL,
      TokenSent TINYINT(1) NOT NULL,
      UNIQUE (GuildID)
    )
  `;

  sql.query(query, (err, result) => {
    if (err) throw err;
  });

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
  const query = `
    CREATE TABLE IF NOT EXISTS guild_${guild.id} (
      DiscordID VARCHAR(64) NOT NULL,
      SteamID64 VARCHAR(64) NOT NULL,
      Muted TINYINT(1) NOT NULL,
      Connected TINYINT(1),
      UNIQUE (DiscordID)
    )
  `;

  sql.query(query, (err, result) => {
    if (err) throw err;
  });
}

function checkToken(guild) {
  const query = `
    SELECT TokenSent FROM tokens WHERE GuildID = ?
  `;

  sql.query(query, [guild.id], (err, result) => {
    if (err) throw err;
    if (result && result.length !== 0) {
      const resulti = result[0];
      if (resulti.TokenSent == 1) {
        tokenProcess(false, guild);
      } else if (resulti.TokenSent == 0) {
        tokenProcess("send", guild);
      }
    } else {
      tokenProcess("create", guild);
    }
  });
}

function createToken(guild) {
  const token = uniqid();
  const query = `
    INSERT INTO tokens (GuildID, Token, TokenSent)
    VALUES (?, ?, 0)
    ON DUPLICATE KEY UPDATE Token = VALUES(Token)
  `;

  sql.query(query, [guild.id, token], (err, result) => {
    if (err) throw err;
  });
  sendToken(guild);
}

function sendToken(guild) {
  const query = `
    SELECT Token FROM tokens WHERE GuildID = ?
  `;

  sql.query(query, [guild.id], (err, result) => {
    if (err) throw err;
    if (result.length !== 0) {
      const resulti = result[0];
      guild.owner
        .send(
          `This is your token: \`${resulti.Token}\`.\nYou need to insert this token inside the _TTTDiscordLink.lua_ file.\nFor more information visit https://github.com/zlyfer/TTTDiscordLink#install-garrys-mod-server-script.\nHave fun!`
        )
        .then(() => {
          const updateQuery = `
            UPDATE tokens SET TokenSent = 1 WHERE GuildID = ?
          `;
          sql.query(updateQuery, [guild.id], (err, result) => {
            if (err) throw err;
          });
        });
    }
  });
}

client.on("messageCreate", (message) => {
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
      if (Channel.type == 0) {
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
              reply +=
                "**" +
                key +
                "** __" +
                helpObj[key].parameter +
                "__ - *" +
                helpObj[key].desc +
                "*\n";
            }
            reply +=
              "\nINFO: If you encounter any issues or have questions, feel free to contact me.\n";
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
            message.reply(
              `sorry I didn't understand that. Use **${botPrefix}help** to see all available commands.`
            );
            break;
        }
      } else {
        message.reply(
          `Sorry I am supposed to be controlled via a text channel on a discord server.`
        );
      }
    }
  }
});

client.on("guildCreate", (guild) => {
  init(guild);
});

client.on("ready", () => {
  client.user.setActivity("Use " + botPrefix + "help for help!", { type: "PLAYING" });

  for (let i = 0; i < client.guilds.cache.length; i++) {
    init(client.guilds.cache[i]);
  }

  setInterval(() => {
    for (let i = 0; i < client.guilds.cache.length; i++) {
      checkStatus(client.guilds.cache[i]);
    }
  }, 1000);

  console.log(`Bot is ready.`);
  console.log(`Logged in as ${client.user.tag}!`);
});

/* ---------- Bot Shutdown ---------- */

const handleShutdown = async () => {
  console.info("Logging out and shutting down...");
  await client.destroy();
  process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED: " + err);
});

/* ----------- Bot Startup ---------- */

client.login(token);
