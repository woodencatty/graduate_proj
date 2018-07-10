const sendData2 = require('./rest_api_p2.js')   //포스터기기 연결 모듈 import
const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
const exercise = require('./svm_exercise.js')   //운동량 측정 모듈 import

var searched = false;
var connectRange = 0;
var leaveRange = 0;
var deviceID = "";


const fs = require('fs');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');
const { exec } = require('child_process');


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
      exec("iwconfig wlan0| awk -F'[ :]+' '/ESSID/ {print $5}'", (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(stdout);
        if(stdout.indexOf("poster_ap")>0){
          sendData.SubmitIDDname(deviceID);
        }else if(stdout.indexOf("poster_ap_2")>0){
          sendData2.SubmitIDDname(deviceID);
        }else if(stdout.indexOf("WiFi2")>0){
          console.log("hi Wifi2")
        }else{
          console.log("not here");
        }
        fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
          if(stdout.indexOf("poster_ap")>0){
            sendData.SubmitUserExercise(deviceID, readtext);
          }else if(stdout.indexOf("poster_ap_2")>0){
            sendData2.SubmitUserExercise(deviceID, readtext);
          }else{
          }
      });
      setTimeout(()=>{
        if(stdout.indexOf("poster_ap")>0){
          sendData.SubmitUserLeave();
        }else if(stdout.indexOf("poster_ap_2")>0){
          sendData2.SubmitUserLeave();
        }else{
        }

      },700)
      });         
              

      

    }, 1000);
    connectRange = connectRange1;
    leaveRange = leaveRange1;
    deviceID = deviceID1;
  }
}    