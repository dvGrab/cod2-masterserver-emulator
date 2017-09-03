const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const color = require("colors");

const Log = require("./log.js");
const Parser = require("./parser.js");

const maxServers = 2;
const Server = [];

server.on("message", serverReceive);
server.on("error", serverError);
server.on("listening", serverListening);

function serverReceive(strMessage, clientInfo)
{
    var fixxedMessage = strMessage.toString();
    fixxedMessage = fixxedMessage.toString().substr(4, fixxedMessage.lenght);

    if(fixxedMessage.indexOf("statusResponse") != -1)
    {
        var serverID = 0;
        var splitInfo = fixxedMessage.split("\\");
        if(Parser.readSettingValue("gamename", splitInfo) == "Call of Duty 2")
        {
            if(!isServerListed(clientInfo))
            {
                serverID = getFreeServer(clientInfo);
                Server[serverID].updateInfos(splitInfo, clientInfo);
                Log.writeLog("update", "Server '" + Server[serverID].serverName + "' has been added to the list!");
            }
            else
            {
                serverID = getServerSlot(clientInfo);
                Server[serverID].updateInfos(splitInfo, clientInfo);
                Log.writeLog("update", "Server '" + Server[serverID].serverName + "' has been update!");
            }
        }
        else{
            return Log.writeLog("error", "Server " + clientInfo.address + ":" + clientInfo.port + " has send wrong informations!");
        }

        return 1;
    }

    if(fixxedMessage.indexOf("heartbeat") != -1)
    {
        if(fixxedMessage.indexOf("flatline") != -1)  
        {
            var serverID = getServerSlot(clientInfo);
            Log.writeLog("disconnect", "Server " + Server[serverID].serverName + " has been disconnected!");     
            return Server[serverID] =  new serverClass;
        }

        if(fixxedMessage.indexOf("COD-2") != -1)
        {
            var packetHead = new Buffer([0xFF, 0xFF, 0xFF, 0xFF]);
            var packetMain = new Buffer("getstatus");
            server.send([packetHead, packetMain], clientInfo.port, clientInfo.address);
            return Log.writeLog("recv", "Server " + clientInfo.address + ":" + clientInfo.port + " has send a heartbeat!");
        }   
    }

     return Log.writeLog("unknown", "Received from " + clientInfo.address + ":" + clientInfo.port + ": " + fixxedMessage);
}

function serverError(err)
{
     Log.writeLog("error", "Error:\n " + err.stack);
}

function serverListening()
{
    for(var i = 0; i < maxServers; i++)
        Server[i] = new serverClass();

    Log.writeLog("info", "Server has been started on " + server.address().address + ":" + server.address().port + "!");
}

server.bind({ port: "20710" });

function serverClass()
{
    this.serverName = "Unknown";
    this.gameType = "Unknown";
    this.lastSettings = "Unknown";
    this.Address = "Unknown";
    this.Port = "Unknown";

    this.updateInfos = function(strSettings, clientInfo)
    {
        this.lastSettings = strSettings;
        this.serverName = Parser.readSettingValue("sv_hostname", this.lastSettings);
        this.gameType = Parser.readSettingValue("g_gametype", this.lastSettings);
        this.Address = clientInfo.address;
        this.Port = clientInfo.port;
    }
}

function getFreeServer(clientInfo)
{
    for(var i = 0; i < maxServers; i++)
    {
        if(Server[i].Address != "Unknown")
            continue;

        return i;
    }
}

function isServerListed(clientInfo)
{
    for(var i = 0; i < maxServers; i++)
    {
        if(clientInfo.address != Server[i].Address)
            continue;

        return 1;
    }

    return 0;
}

function getServerSlot(clientInfo)
{
    for(var i = 0; i < maxServers; i++)
    {
        if((Server[i].Address != clientInfo.address) && (Server[i].Port != clientInfo.Port))
            continue;

        return i;
    }
}