var brain = require("brain.js");
var fs = require("fs");

var config = {
   hiddenLayers: [3, 4],
   activation: 'relu'
};

var net = new brain.NeuralNetwork();

function saveFile(){
    fs.writeFile("network.json", JSON.stringify(net.toJSON()), function(err) {
        if(err)
            return console.log(err);

        console.log("The file was saved");
    });
}

net.train([{input: {x축_가속도: -582, y축_가속도: 943, z축_가속도: 667, 
               x축_자이로: -582, y축_자이로: 943, z축_자이로: 667, 
               x축_지자기: -377, y축_지자기: 705, z축_지자기: 993}, 
         output: {Descending: 1}},
         {input: {x축_가속도: -913, y축_가속도: 1550, z축_가속도: 1054, 
               x축_자이로: -913, y축_자이로: 1550, z축_자이로: 1054, 
               x축_지자기: -498, y축_지자기: 963, z축_지자기: 862}, 
         output: {Ascending: 1}},
         {input: {x축_가속도: -462, y축_가속도: 71, z축_가속도: 277, 
               x축_자이로: -462, y축_자이로: 71, z축_자이로: 277, 
               x축_지자기: -1066, y축_지자기: 1014, z축_지자기: 1232}, 
         output: {Walking: 1}},
         {input: {x축_가속도: 25, y축_가속도: -602, z축_가속도: -537, 
               x축_자이로: 25, y축_자이로: -468, z축_자이로: -537, 
               x축_지자기: -390, y축_지자기: 653, z축_지자기: 397}, 
         output: {Running: 1}},
         {input: {x축_가속도: -291, y축_가속도: 1311, z축_가속도: 80, 
               x축_자이로: -291, y축_자이로: 1311, z축_자이로: 80, 
               x축_지자기: -499, y축_지자기: 377, z축_지자기: 702}, 
         output: {Standing: 1}}]);

saveFile();

/*
var output = net.run({x축_가속도: -298, y축_가속도: 1290, z축_가속도: 176, 
               x축_자이로: -298, y축_자이로: 1290, z축_자이로: 199, 
               x축_지자기: -666, y축_지자기: 255, z축_지자기: 107});   // Standing Data

console.log(output);
*/