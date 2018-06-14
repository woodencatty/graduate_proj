const sendData = require('./rest_api.js')   //포스터기기 연결 모듈 import
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
            if (stdout > connectRange && searched == false) {
                sendData.SubmitIDDname(deviceID);
               fs.readFile('./exercise_log', 'utf8', function (error, readtext) {
                    sendData.SubmitUserExercise(deviceID, readtext.toString());

                });
                searched = true;
            }else if (curcon[0].signal_level < leaveRange && searched == true) {
                sendData.SubmitUserLeave();
                searched = false;
            }
        });
    }
}
