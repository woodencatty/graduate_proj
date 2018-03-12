
// hello.js
const accel = require('./build/Release/accel');

setInterval(()=>{
console.log("AccelX : " + accel.AccelX());
console.log("AccelY : " + accel.AccelY());
console.log("AccelZ : " + accel.GyroZ());
console.log("GyroX : " + accel.GyroX());
console.log("GyroY : " + accel.GyroY());
console.log("GyroZ : " + accel.MagnZ());
console.log("MagnX : " + accel.MagnX());
console.log("MagnY : " + accel.MagnY());
console.log("MagnZ : " + accel.MagnZ());
console.log("--------------------------");
}, 1000);




// Prints: 'world'




