
// accel_graph.js
const accel = require('./build/Release/accel');
const fs = require('fs');

//setTimeout(()=>{ 
  setInterval(()=>{
  let log = accel.AccelX()+"\t"+accel.AccelY()+"\t"+accel.AccelZ()+"\t"+accel.GyroX()+"\t"+accel.GyroY()+"\t"+accel.GyroZ()+"\t"+accel.MagnX()+"\t"+accel.MagnY()+"\t"+accel.MagnZ()+"\tDescending\n"
  console.log(log);
  
  fs.appendFile('data_log_Descending.txt', log, (err) => {
    if (err) throw err;
  });
  
  }, 100);
 //}, 60000);


//setTimeout(()=>{ process.exit(1); }, 120000);
