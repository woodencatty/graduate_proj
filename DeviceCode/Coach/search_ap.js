const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
const exercise = require('./svm_exercise.js')   //운동량 측정 모듈 import
var wifi = require('node-wifi');
 
// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});
 
    
var searched = false;
var connectRange = 0;
var leaveRange = 0;
var deviceID = "";


const fs = require('fs');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');


console.log('Poster scanning');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});


bleno.on('accept', (clientAddress)=>{
  console.log("accepted" + clientAddress);

});

bleno.on('rssiUpdate', (rssi)=>{
  console.log("rssiup" + rssi);
  if (rssi > connectRange) {
    console.log("Poster Detected");
    if(searched == false){
        console.log("ID Sent");
        /*sendData.SubmitIDDname(deviceID);
       fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
            sendData.SubmitUserExercise(deviceID, readtext);
            exercise.resetStepCount();
        });*/
        searched = true;
    }     console.log("But already connected");
}else if (rssi < leaveRange && searched == true) {
    console.log("Leaving");

    searched = false;
}
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ec00',
        characteristics: [
          new EchoCharacteristic()
        ]
      })
    ]);
  }
});

module.exports = {

  init: (connectRange1, leaveRange1, deviceID1) => {
    setInterval(()=>{
     
          sendData.SubmitIDDname(deviceID);
       
        fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
       
            sendData.SubmitUserExercise(deviceID, readtext);
      });
      setTimeout(()=>{
          sendData.SubmitUserLeave();
      
      },700)  
    }, 1000);
/*
    setInterval(()=>{
      wifi.scan().then(function (networks) {
        wifi.connect({ ssid : "poster_ap", password : "1q2w3e4r"}, function(err) {
          if (err) {
              console.log(err);
          }
          console.log('Connected');
      });
      }).catch(function (error) {
        // error
      })
    setTimeout(()=>{
      wifi.disconnect(function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Disconnected');
    });
    }, 4000)
    },5000)*/

    wifi.scan(function(err, networks) {
      if (err) {
          console.log(err);
      } else {
          console.log(networks);
          /*
          networks = [
              {
                ssid: '...',
                bssid: '...',
                mac: '...', // equals to bssid (for retrocompatibility)
                channel: <number>,
                frequency: <number>, // in MHz
                signal_level: <number>, // in dB
                security: 'WPA WPA2' // format depending on locale for open networks in Windows
                security_flags: '...' // encryption protocols (format currently depending of the OS)
                mode: '...' // network mode like Infra (format currently depending of the OS)
              },
              ...
          ];
          */
      }
  });
   
    connectRange = connectRange1;
    leaveRange = leaveRange1;
    deviceID = deviceID1;
  }
}    