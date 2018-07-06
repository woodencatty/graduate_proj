const Accel = require('./sensor.js');   //가속도 센서 모듈 import

//센서의 X, Y, Z값을 받아온다.
var StepCount = 0;

var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

function loadFile() {
    var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
}
 
loadFile(); 


//변환하여 저장할 값.
module.exports = {
    setStepCount: () => {
        GetAccelCallback = (AccelX, AccelY, AccelZ, GyroX, GyroY, GyroZ, MagnX, MagnY, MagnZ) => {
            var output = net.run({ x축_가속도: AccelX, y축_가속도: AccelY, z축_가속도: AccelZ, 
                x축_자이로: GyroX, y축_자이로: GyroY, z축_자이로: GyroZ, 
                x축_지자기: MagnX, y축_지자기: MagnY, z축_지자기: MagnZ }); 
//                var parsedoutput = JSON.parse(output);
                console.log(output);
                if(parsedoutput.Standing > 1.0){ console.log("Standing" + parsedoutput.Standing);
                }else  if(parsedoutput.Walking > 1.0){console.log("Walking" + parsedoutput.Walking);
                }else  if(parsedoutput.Descending > 1.0){console.log("Descending" + parsedoutput.Descending);
                }else  if(parsedoutput.Ascending > 1.0){console.log("Ascending" + parsedoutput.Ascending);
                }else {
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
