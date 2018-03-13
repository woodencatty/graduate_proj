
// accel_graph.js
const accel = require('./build/Release/accel');
const fs = require('fs');


setInterval(()=>{
let log = accel.AccelX()+","+accel.AccelY()+","+accel.AccelZ()+","+accel.GyroX()+","+accel.GyroY()+","+accel.GyroZ()+","+accel.MagnX()+","+accel.MagnY()+","+accel.MagnZ()+"\n"
console.log(log);

fs.appendFile('data_log.txt', log, (err) => {
  if (err) throw err;
});

}, 50);

setTimeout(()=>{ process.exit(1); }, 300000);
