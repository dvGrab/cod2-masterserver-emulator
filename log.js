var colors = require("colors");
var winston = require("winston");
var methods = {};

winston.add(winston.transports.File, { filename: "./log.log"});
winston.remove(winston.transports.Console);

methods.writeLog = function(strInfo, strMessage)
{ 
    winston.info("[" + strInfo.toUpperCase() + "]", strMessage);

    if(!strInfo.search("info"))
        return console.log("[INFO]".green + " " + strMessage); 

    if(!strInfo.search("recv"))
        return console.log("[RECV]".yellow + " " + strMessage);

    if(!strInfo.search("error"))
        return console.log("[ERROR]".red + " " + strMessage);
        
    if(!strInfo.search("unknown"))
        return console.log("[UNKNOWN]".red + " " + strMessage);

    if(!strInfo.search("disconnect"))
        return console.log("[DISCONNECT]".blue + " " + strMessage);

    if(!strInfo.search("update"))
        return console.log("[UPDATE]".cyan + " " + strMessage);

    return console.log(strMessage);
};

module.exports = methods;