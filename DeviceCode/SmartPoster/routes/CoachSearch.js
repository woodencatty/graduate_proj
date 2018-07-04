var noble = require('noble');

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        console.log("scanning");
        noble.startScanning(["ec00"], false); 
        } else {
      noble.stopScanning();
    }
  });
  
  noble.on('discover', function(peripheral) {
      console.log('Found device with local name: ' + peripheral.advertisement.localName);
      console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
      console.log(peripheral);

        peripheral.connect(function(error) {
          console.log(error);
          noble.stopScanning();
        });
  });

  module.exports = {
  	PherClear: () => {
        noble.on('stateChange', function(state) {
          if (state === 'poweredOn') {
              console.log("scanning");
              noble.startScanning(["ec00"], false); 
              } else {
            noble.stopScanning();
          }
        });
     }
  }

function keepconnect(){
  console.log("keep connected");
}