var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

function loadFile() {
    var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
}
 
loadFile(); 


var output = net.run({x축_가속도: -335, y축_가속도: -433, z축_가속도: 112, 
    x축_자이로: -335, y축_자이로: -433, z축_자이로: 112, 
    x축_지자기: -977, y축_지자기: 964, z축_지자기: 1170});   // Walking Data

console.log(output);

/*
var run = net.toFunction();
var output = run({x축_가속도: -298, y축_가속도: 1290, z축_가속도: 176, 
    x축_자이로: -298, y축_자이로: 1290, z축_자이로: 199, 
    x축_지자기: -666, y축_지자기: 255, z축_지자기: 107});

console.log(output);
*/