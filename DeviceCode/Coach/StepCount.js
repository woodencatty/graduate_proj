const Accel = require('./sensor.js'); //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.
var StepCount = 0;
var Standing = 0;
var Walking = 0;
var Descending = 0;
var Ascending = 0;



var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

function loadFile() {
    var obj = JSON.parse(fs.readFileSync('./network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
}

loadFile();


//변환하여 저장할 값.
module.exports = {
    setStepCount: () => {
        GetAccelCallback = (AccelX, AccelY, AccelZ, GyroX, GyroY, GyroZ, MagnX, MagnY, MagnZ) => {
            var output = net.run({
                x축_가속도: AccelX,
                y축_가속도: AccelY,
                z축_가속도: AccelZ,
                x축_자이로: GyroX,
                y축_자이로: GyroY,
                z축_자이로: GyroZ,
                x축_지자기: MagnX,
                y축_지자기: MagnY,
                z축_지자기: MagnZ
            });
            //                var parsedoutput = JSON.parse(output);
            Standing = parseInt(output.Standing);
            Walking = parseInt(output.Walking);
            Descending = parseInt(output.Descending);
            Ascending = parseInt(output.Ascending);

            if (Walking > 1) {
                console.log("Walking" + Walking);
                StepCount++;
            } else if (Standing > 1) {
                console.log("Standing" + Standing);
            } else if (Descending > 1) {
                console.log("Descending" + Descending);
                StepCount++;
            } else if (Ascending > 1) {
                console.log("Ascending" + Ascending);
                StepCount++;
            } else {
                console.log("?");
            }
        }
        Accel.getAccel(GetAccelCallback);
    },
    getStepCount: (callback) => {
        callback(StepCount);
    },
    resetStepCount: () => {
        StepCount = 0;
    }
}
