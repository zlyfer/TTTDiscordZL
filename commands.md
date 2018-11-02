# Commands
Each command - unless declared otherwise - can be used either in the in game chat or via Discord.

## Index
1. [Index](#index)
2. [Help](#help)
3. [Mute](#manually-mute-yourself)
4. [Unmute](#manually-unmute-yourself)
5. [Link](#link-steamid64-with-discordid)
6. [Generate New Token](#generate-new-token) (Discord only!)

## Help
Use the command `~zltd~help` in the in game chat or within the Discord text channel to receive help/a list of available commands.

## Manually Mute Yourself
This command was implemented in any case you want to mute yourself securely.
Use following command to mute yourself manually if needed: `~zltd~mute`.
The bot/server script will send a notification to everyone that you muted yourself in the in game chat or Discord channel whether which one you used.

## Manually Unmute Yourself
Normally the bot unmutes everyone if needed (upon new round/revive) but sometimes it is necessary to unmute yourself.
Due to the system on how the bot knows who to mute a simple server-side unmute is not enough - the bot will mute you again.
Use following command to unmute yourself manually if needed: `~zltd~unmute`.
The bot/server script will send a notification to everyone that you unmuted yourself in the in game chat or Discord channel whether which one you used.

## Link SteamID64 With DiscordID
Use the command `~zltd~link [DiscordID]` in the in game chat or `~zltd~link [SteamID64]` within the Discord text channel to link your DiscordID with your SteamID64.
See [Link SteamID64 With DiscordID](idlink.md) for further information.

## Generate New Token
Upon invitation the Discord bot will send you your token.
As [mentioned](README.md#install-garrys-mod-server-script) you need this token for _TTTDiscordZL.lua_.
Normally the first generated token is enough and all you need; However in some cases you might want to generate a new token.
Use the command `~zltd~token` to generate a new token.
Make sure to update _TTTDiscordZL.lua_ accordingly.
