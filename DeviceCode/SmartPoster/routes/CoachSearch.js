var noble = require('noble');

var pher;

var connectinterval;

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        console.log("scanning");
        noble.startScanning(["ec00"], true); 
        } else {
      noble.stopScanning();
    }
  });
  
  noble.on('discover', function(peripheral) {
      console.log('Found device with local name: ' + peripheral.advertisement.localName);
      console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
      console.log(peripheral);
      pher = peripheral;

        peripheral.connect(function(error) {
          console.log(error);
          connectinterval = setInterval(keepconnect, 5000);
        });
  });
/*
  module.exports = {
  	PherClear: () => {
      pher.disconnect(function(error) {
        clearInterval(connectinterval);
        console.log(error);
    });    }
  }
*/
function keepconnect(){
  console.log("keep connected");
}