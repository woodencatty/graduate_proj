const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
const exercise = require('./svm_exercise.js')   //운동량 측정 모듈 import

var searched = false;

const fs = require('fs');

const exec = require('child_process').exec;


module.exports = {
    searchPoster: (apName, password, connectRange, leaveRange, deviceID) => {

        exec(" iwconfig | grep level | cut -d '=' -f 3 | cut -d ' ' -f 1", (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);            //todo : check signal
            if (stdout > connectRange) {
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

            }else if (stdout < leaveRange && searched == true) {
                console.log("Leaving");
                sendData.SubmitUserLeave();
                searched = false;
            }
        });
    }
}
