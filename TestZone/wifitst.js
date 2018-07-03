var wifi = require('node-wifi');
 
// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});
 
setInterval(()=>{
}, 1000)

wifi.scan(function(err, networks) {
    if (err) {
        console.log(err);
    } else {
        console.log(networks.ssid);
        if(networks.ssid == "WiFi2"){
            wifi.connect({ ssid : "WiFi2", password : "201333558"}, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('Connected');
            });
        }

    }
});