print("TTTDiscordZL - by Frederik 'zlyfer' Shull")
print("TTTDiscordZL - Use ~zltd~help or !!help for all commands!")

-- Insert the ID of your Discord Server.
local GuildID = ""
-- Insert the generated token the Discord bot sent you when you invited him.
local Token = ""
-- Change url to TTTDiscordZL.php on your website (Only if you want to use your own database & Discord server!).
local Webpage = "https://zlyfer.net/sites/games/gmod_ttt/TTTDiscordZL.php"
-- Variable for detecting if preround or postround is happening.
local activateMute = false

-- Functions to un/mute players. Use either "all" for all or SteamID64 for a specific target.
local function mute(target)
	http.Fetch(Webpage.."?token="..Token.."&guildid="..GuildID.."&mute="..target)
end
local function unmute(target)
	http.Fetch(Webpage.."?token="..Token.."&guildid="..GuildID.."&unmute="..target)
end
-- Function to link the SteamID64 with the DiscordID from a player.
local function link(DiscordID, SteamID64)
	http.Fetch(Webpage.."?token="..Token.."&guildid="..GuildID.."&linkDiscordID="..DiscordID.."&linkSteamID64="..SteamID64)
end
-- Function to display help message.
local function sendHelp(player)
	player:SendLua([[chat.AddText(Color(255, 255, 255), "Following commands are available:")]])
	player:SendLua([[chat.AddText(Color(3, 169, 2441), "!!help", Color(255, 255, 255), " - Shows this help info.")]])
	player:SendLua([[chat.AddText(Color(3, 169, 2441), "!!mute", Color(255, 255, 255), " - Mute yourself in Discord.")]])
	player:SendLua([[chat.AddText(Color(3, 169, 2441), "!!unmute", Color(255, 255, 255), " - Unmute yourself in Discord.")]])
	player:SendLua([[chat.AddText(Color(3, 169, 2441), "!!link [DiscordID]", Color(255, 255, 255), " - Link your SteamID to your DiscordID.")]])
end

	-- Mute player upon death.
	hook.Add("PlayerDeath", "TTTDiscordZLPlayerDeath", function (victim, inflictor, attacker)
		if GAMEMODE_NAME == "terrortown" then
			if victim:IsBot() == false and activateMute == true then
				if victim:IsGhost() == false then -- Optional: If you have the addon Spectator Deathmatch installed, you want the Ghosts, to be unaffected.
					mute(victim:SteamID64())
					victim:SendLua([[chat.AddText(Color(255, 255, 255), "You got ", Color(244, 67, 54), "muted", Color(255, 255, 255), " in Discord because you died.")]])
				end
			end
		end
	end)
	-- Unmute player upon spawn/revive.
	hook.Add("PlayerSpawn", "TTTDiscordZLPlayerSpawn", function (player)
		if GAMEMODE_NAME == "terrortown" then
			if player:IsBot() == false then
				if player:IsGhost() == false then -- Optional: If you have the addon Spectator Deathmatch installed, you want the Ghosts, to be unaffected.
					unmute(player:SteamID64())
				end
			end
		end
	end)
	-- Unmute all players upon preparing phase. Ensures everyone gets unmuted porperly.
	hook.Add("TTTPrepareRound", "TTTDiscordZLTTTPrepareRound", function ()
		if GAMEMODE_NAME == "terrortown" then
			activateMute = false
			unmute("all")
		end
	end)
	-- Check if round has started.
	hook.Add("TTTBeginRound", "TTTDiscordZLTTTBeginRound", function ()
		if GAMEMODE_NAME == "terrortown" then
			activateMute = true
		end
	end)
	-- Same as above but faster and less secure; If player get killed post round they will be muted again.
	hook.Add("TTTEndRound", "TTTDiscordZLTTTEndRound", function (result)
		if GAMEMODE_NAME == "terrortown" then
			unmute("all")
			activateMute = false
		end
	end)
	-- Mute a player if he connects while a round is running.
	hook.Add("PlayerInitialSpawn", "TTTDiscordZLPlayerInitialSpawn", function(player)
		if activateMute == true then
			mute(player:SteamID64())
			player:SendLua([[chat.AddText(Color(255, 255, 255), "You got ", Color(244, 67, 54), "muted", Color(255, 255, 255), " in Discord because there is an ongoing round.")]])
			player:SendLua([[chat.AddText(Color(255, 255, 255), "Use ", Color(3, 169, 2441), "~zltd~unmute", Color(255, 255, 255), " or ", Color(3, 169, 2441), "!!unmute", Color(255, 255, 255), " to unmute yourself if necessary.")]])
		end
	end)
	-- Unmtute a player when he leaves.
	hook.Add("PlayerDisconnected", "TTTDiscordZLPlayerDisconnected", function(player)
		unmute(player:SteamID64());
	end)
	-- Commands
	hook.Add("PlayerSay", "TTTDiscordZLPlayerSay", function(player, text, team)
		if GAMEMODE_NAME == "terrortown" then
			if (string.lower(text) == "~zltd~help" or string.lower(text) == "!!help") then
				sendHelp(player)
				return ""
			elseif (string.lower(text) == "~zltd~mute" or string.lower(text) == "!!mute") then
				BroadcastLua([[chat.AddText(Color(255, 255, 255), "]]..player:Name()..[[", Color(76, 175, 80), " muted ", Color(255, 255, 255), "him-/herself!")]])
				mute(player:SteamID64())
			elseif (string.lower(text) == "~zltd~unmute" or string.lower(text) == "!!unmute") then
				BroadcastLua([[chat.AddText(Color(255, 255, 255), "]]..player:Name()..[[", Color(244, 67, 54), " unmuted ", Color(255, 255, 255), "him-/herself!")]])
				unmute(player:SteamID64())
			elseif (string.find(string.lower(text), "~zltd~link") or string.find(string.lower(text), "!!link")) then
				local DiscordID = string.sub(text, 12)
				if DiscordID == "" then
					player:SendLua([[chat.AddText(Color(244, 67, 54), "Error: ", Color(255, 255, 255), "Please send me your DiscordID aswell. (~zltd~link [DiscordID])")]])
				else
					player:SendLua([[chat.AddText(Color(255, 255, 255), "I linked your SteamID64 (", Color(3, 169, 2441), "]]..player:SteamID64()..[[", Color(255, 255, 255), ") with your DiscordID (", Color(3, 169, 2441), "]]..DiscordID..[[", Color(255, 255, 255), ").")]])
					link(DiscordID, player:SteamID64())
				end
				return ""
			end
		end
	end)
	-- Optional: Unmute player upon found corpse. Not recommended for large player groups.
	--[[
	hook.Add("TTTBodyFound", "TTTDiscordZLBodyFound", function(player, deadplayer, rag)
		if GAMEMODE_NAME == "terrortown" then
			unmute(deadplayer:SteamID64())
		end
	end)
	]]--
