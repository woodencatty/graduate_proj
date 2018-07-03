var wifi = require('node-wifi');
 
// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});
 
setInterval(()=>{
}, 1000)

wifi.disconnect(function(err) {
    if (err) {
        console.log(err);
    }
    console.log('Disconnected');
});
// Scan networks
