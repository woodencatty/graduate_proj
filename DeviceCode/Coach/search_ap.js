const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
const exercise = require('./svm_exercise.js')   //운동량 측정 모듈 import
var wifi = require('node-wifi');

var searched = false;
var connectRange = 0;
var leaveRange = 0;
var deviceID = "";

const fs = require('fs');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');

wifi.init({
  iface : null // network interface, choose a random wifi interface if set to null
});


console.log('Poster scanning');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});
  console.log("connected to poster");
  
  setInterval(()=>{
    bleno.updateRssi((error, rssi)=>{
      if (error) {
          console.error(error);
          return;
      }
      console.log(rssi);            //todo : check signal
      if (rssi > connectRange) {
          console.log("Poster Detected");
          if(searched == false){
              console.log("ID Sent");
              sendData.SubmitIDDname(deviceID);
             fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
                  sendData.SubmitUserExercise(deviceID, readtext);
                  exercise.resetStepCount();
              });
              searched = true;
          }
      }else if (rssi < leaveRange && searched == true) {
          console.log("Leaving");
          sendData.SubmitUserLeave();
          searched = false;
      }
  });
  }, 500)


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
    connectRange = connectRange1;
    leaveRange = leaveRange1;
    deviceID = deviceID1;
  }
}    