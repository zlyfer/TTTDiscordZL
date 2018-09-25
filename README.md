# TTTDiscordZL
### Connect a Garry's Mod Server with a Discord Server!
## Info
To-Do
## Getting Started
### Garry's Mod Server
1. Move TTTDiscordZL.lua to GMOD_SERVER_DIRECTORY/garrysmod/lua/autorun/server.
2. Insert your Discord server ID into the quotation marks at `local DiscordID = ""`.
3. Restart your Garry's Mod server.
4. Only if you want to use your own Discord server & database:
	* Change the url in the quotation marks to your own url pointing to TTTDiscordZL.php at `local Webpage = "https://zlyfer.net/games/gmod_ttt/TTTDiscordZL.php"`
### Setup own database and website
1. Move TTTDiscordZL.php to a directory on your webserver. Make sure it is exactly where `local Webpage` in TTTDiscordZL.lua is pointing to.
2. Create a database called 'TTTDiscordZL' and invite your Discord bot to your Discord server.
	* If you already invited the bot to the server simply restart the Discord bot.
### Setup own Discord Bot
1. Rename token_template.json to token.json and insert your Discord bot token into the quotation marks.
2. Rename mysql_config_template.json to mysql_config.json and add your database credentials.
3. Install bot dependencies and start the bot
	* #### Using [npm](https://www.npmjs.com/)
		* ##### Install dependencies
		  `npm install`
		* ##### Run
	 	 `npm start`
	* #### Using [yarn](https://yarnpkg.com/)
		* ##### Install dependencies
		  `yarn install`
		* ##### Run
	   `yarn start`
## Disclaimer
The bot will be able to server-side un/mute people on your discord server!
At the moment everyone can mute people on your Discord server if they know it's ID and the SteamID64 of a specific person on your Discord server (if linked in database).
Future security measures are already planed.
