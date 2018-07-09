var wpi = require('wiring-pi');

wpi.setup('wpi');

var pin = 0;

wpi.pinMode(pin, wpi.INPUT);

setInterval(function() {
  console.log(wpi.digitalRead(pin));
  
}, 500);