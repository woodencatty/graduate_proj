const accel = require('./build/Release/LSM9DS0');


// 가속도 센서 초기화


//가속도값 측정 모듈화

module.exports = {
  getAccel: (callback) => {
    
        callback(accel.AccelX(), accel.AccelY(), accel.AccelZ())
      .catch((err) => {
        console.log(`LSM9DS0 read error: ${err}`);
      });
  }
}