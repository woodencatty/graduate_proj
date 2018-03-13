
// accel_graph.js
const accel = require('./build/Release/accel');
const fs = require('fs');

setTimeout(()=>{ 
  setInterval(()=>{
  let log = accel.AccelX()+"\t"+accel.AccelY()+"\t"+accel.AccelZ()+"\t"+accel.GyroX()+"\t"+accel.GyroY()+"\t"+accel.GyroZ()+"\t"+accel.MagnX()+"\t"+accel.MagnY()+"\t"+accel.MagnZ()+"\tStanding\n"
  console.log(log);
  
  fs.appendFile('data_log_Standing.txt', log, (err) => {
    if (err) throw err;
  });
  
  }, 100);
 }, 30000);


setTimeout(()=>{ process.exit(1); }, 60000);
