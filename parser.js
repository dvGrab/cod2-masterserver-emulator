var Log = require("./log.js");
var methods = {};

methods.readSettingValue = function(strConfig, strSettingsArray)
{
    for(var i = 0; i < strSettingsArray.length; i++)
    {
        if(strSettingsArray[i].indexOf(strConfig) != -1)
            return strSettingsArray[i + 1];
    }

    return Log.writeLog("error", "Failed to read " + strConfig + "!");
}


module.exports = methods;