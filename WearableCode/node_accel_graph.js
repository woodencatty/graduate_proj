
// hello.js
const accel = require('./build/Release/accel');

setInterval(()=>{
console.log(accel.AccelX()+","+accel.AccelY()+","+accel.AccelZ()+","+accel.GyroX()+","+accel.GyroY()+","+accel.GyroZ()+","+accel.MagnX()+","+accel.MagnY()+","+accel.MagnZ());
}, 50);

setTimeout(()=>{
process.exit(1);
}, 10000);


// Prints: 'world'










