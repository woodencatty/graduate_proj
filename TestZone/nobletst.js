var noble = require('noble');


noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning(["ec00"], true); 
        } else {
      noble.stopScanning();
    }
  });
  
  noble.on('discover', function(peripheral) {
      console.log('Found device with local name: ' + peripheral.advertisement.localName);
      console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
      console.log();

        peripheral.connect(function(error) {
          setInterval(()=>{
            console.log('connected to peripheral: ' + peripheral.uuid + "and "+ peripheral.rssi);

          }, 1000);
      });
  });