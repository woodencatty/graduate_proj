var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

function loadFile() {
    var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
}
 
loadFile(); 

var output = net.run(
    {input: {x축_가속도: 999, y축_가속도: -72, z축_가속도: -99, x축_자이로: 199, y축_자이로: -328, z축_자이로: -432, x축_지자기: -256, y축_지자기: 840, z축_지자기: 557}}
);   // Standing Data

console.log(output);