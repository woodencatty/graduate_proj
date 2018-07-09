var McpAdc = require('mcp-adc');
var adc = new McpAdc.Mcp3008();

var channel_0 = 0;
var channel_1 = 1;

var User_Enter = 0;

setInterval(()=>{
    adc.readRawValue(channel_0, function(value0) {
      adc.readRawValue(channel_1, function(value1) {
        console.log("Raw value:\t" + value0);
        console.log("Raw value:\t" + value1);
        if(value0>500 || value1>500){
          User_Enter=1;
          console.log("User enter!" + User_Enter);
        }

      });
});

  },100);