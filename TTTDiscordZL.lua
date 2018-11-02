print("TTTDiscordZL - by Frederik 'zlyfer' Shull!")
print("TTTDiscordZL - Use ~zltd~help for all commands!")

-- Insert the ID of your Discord Server.
local GuildID = ""
-- Insert the generated token the Discord bot sent you when you invited him.
local Token = ""
-- Change url to TTTDiscordZL.php on your website (Only if you want to use your own database & Discord server!).
local Webpage = "https://zlyfer.net/sites/games/gmod_ttt/TTTDiscordZL.php"
-- Variable for detecting if the round is still preparing.
local isPreparing = false;

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

-- Mute player upon death.
hook.Add("PlayerDeath", "TTTDiscordZLPlayerDeath", function (victim, inflictor, attacker)
	if GAMEMODE_NAME == "terrortown" and victim:IsBot() == false and isPreparing == false then
		if victim:IsGhost() == false then -- Optional: If you have the addon Spectator Deathmatch installed, you want the Ghosts, to be unaffected.
			mute(victim:SteamID64())
		end
	end
end)
-- Unmute player upon spawn/revive.
hook.Add("PlayerSpawn", "TTTDiscordZLPlayerSpawn", function (player)
	if GAMEMODE_NAME == "terrortown" and player:IsBot() == false then
		if player:IsGhost() == false then -- Optional: If you have the addon Spectator Deathmatch installed, you want the Ghosts, to be unaffected.
			unmute(player:SteamID64())
		end
	end
end)
-- Unmute all players upon preparing phase. Ensures everyone gets unmuted porperly.
hook.Add("TTTPrepareRound", "TTTDiscordZLPrepareRound", function ()
	if GAMEMODE_NAME == "terrortown" then
		isPreparing = true;
		unmute("all")
	end
end)
-- Check if round has started.
hook.Add("TTTBeginRound", "TTTDiscordZLBeginRound", function ()
	if GAMEMODE_NAME == "terrortown" then
		isPreparing = false;
	end
end)
-- Same as above but faster and less secure; If player get killed post round they will be muted again.
hook.Add("TTTEndRound", "TTTDiscordZLEndRound", function (result)
	if GAMEMODE_NAME == "terrortown" then
		unmute("all")
	end
end)
-- Commands
hook.Add("PlayerSay", "TTTDiscordZLPlayerSay", function(player, text, team)
	if GAMEMODE_NAME == "terrortown" then
		if (string.lower(text) == "~zltd~help") then
			player:SendLua([[chat.AddText(Color(255,255,255), "Following commands are available:")]])
			player:SendLua([[chat.AddText(Color(3, 169, 244), "~zltd~mute", Color(255,255,255), " - Mute yourself in Discord.")]])
			player:SendLua([[chat.AddText(Color(3, 169, 244), "~zltd~unmute", Color(255,255,255), " - Unmute yourself in Discord.")]])
			player:SendLua([[chat.AddText(Color(3, 169, 244), "~zltd~link [DiscordID]", Color(255,255,255), " - Link your SteamID to your DiscordID.")]])
			return ""
		elseif (string.lower(text) == "~zltd~mute") then
			BroadcastLua([[chat.AddText(Color(255, 255, 255), "]]..player:Name()..[[", Color(244, 67, 54), " muted ", Color(255, 255, 255), "him-/herself!")]])
			mute(player:SteamID64())
		elseif (string.lower(text) == "~zltd~unmute") then
			BroadcastLua([[chat.AddText(Color(255, 255, 255), "]]..player:Name()..[[", Color(76, 175, 80), " unmuted ", Color(255, 255, 255), "him-/herself!")]])
			unmute(player:SteamID64())
		elseif (string.find(string.lower(text), "~zltd~link")) then
			local DiscordID = string.sub(text, 12)
			if DiscordID == "" then
				player:SendLua([[chat.AddText(Color(244, 67, 54), "Error: ", Color(255, 255, 255), "Please send me your DiscordID aswell. (~zltd~link [DiscordID])")]])
			else
				player:SendLua([[chat.AddText(Color(255, 255, 255), "I linked your SteamID64 (", Color(3, 169, 244), "]]..player:SteamID64()..[[", Color(255, 255, 255), ") with your DiscordID (", Color(3, 169, 244), "]]..DiscordID..[[", Color(255, 255, 255), ").")]])
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
