var noble = require('noble');

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        console.log("scanning");
        noble.startScanning(); 
        } else {
      noble.stopScanning();
    }
  });
  

  noble.on('scanStart', function()
  {
      console.log('Scanning for peripherals ...');
  });
  
  noble.on('scanStop', function()
  {
      console.log('Scan stopped.');
  
      setTimeout(function()
      {
          noble.startScanning();
      }, 500);
  });


  noble.on('discover', function(peripheral)
  {
      console.log('Found peripheral.');
  
      if(peripheral.advertisement.localName == 'echo'){
        peripheral.connect(function(err)
        {
            handleConnect(err, peripheral);
        });
      }
  });
  
  
  function handleConnect(err, peripheral)
  {
      console.log('Connected.');
  
      peripheral.once('disconnect', function()
      {
          handleDisconnect(peripheral);
      });
  }
  
  
  function handleDisconnect(peripheral)
  {
      console.log('Connection lost.');
  
      noble.stopScanning();
  }

  module.exports = {
  	PherClear: () => {

     }
  }
