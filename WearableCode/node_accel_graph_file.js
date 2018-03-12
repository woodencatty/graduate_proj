
// accel_graph.js
const accel = require('./build/Release/accel');
const fs = require('fs');


setInterval(()=>{
let log = "" + accel.AccelX()+","+accel.AccelY()+","+accel.AccelZ()+","+accel.GyroX()+","+accel.GyroY()+","+accel.GyroZ()+","+accel.MagnX()+","+accel.MagnY()+","+accel.MagnZ()+"\n"
console.log(log);

fs.open('data_log.txt', 'a+', function(err, fd) {
    if(err) throw err;
    fs.write(fd, log, 0, log.length, null, function(err, written, buffer) {
      if(err) throw err;
      console.log(err, written, buffer);
      fs.close(fd, function() {
        console.log('Done');
      });
    });
  });

}, 50);

setTimeout(()=>{
process.exit(1);
}, 10000);
