const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
const exercise = require('./svm_exercise.js')   //운동량 측정 모듈 import

    
var searched = false;
var connectRange = 0;
var leaveRange = 0;
var deviceID = "coach01";


const fs = require('fs');

console.log('Poster scanning');

setInterval(()=>{
  sendData.SubmitIDDname(deviceID);
fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
    sendData.SubmitUserExercise(deviceID, readtext);
});
setTimeout(()=>{
  sendData.SubmitUserLeave();
},700)  
}, 1000);