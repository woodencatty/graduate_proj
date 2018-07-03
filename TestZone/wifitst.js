var wifi = require('node-wifi');
 
// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});
 
// Scan networks
wifi.getCurrentConnections(function(err, currentConnections) {
    if (err) {
        console.log(err);
    }
    console.log(currentConnections);
    /*
    // you may have several connections
    [
        {
            iface: '...', // network interface used for the connection, not available on macOS
            ssid: '...',
            bssid: '...',
            mac: '...', // equals to bssid (for retrocompatibility)
            channel: <number>,
            frequency: <number>, // in MHz
            signal_level: <number>, // in dB
            security: '...' //
            security_flags: '...' // encryption protocols (format currently depending of the OS)
            mode: '...' // network mode like Infra (format currently depending of the OS)
        }
    ]
    */
});