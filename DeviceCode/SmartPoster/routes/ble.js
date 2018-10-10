var bleno = require('bleno');
var SPCharacteristic = require('./characteristic');

var name = 'smartPoster';
var serviceUuids = ['sp01']

var BlenoPrimaryService = bleno.PrimaryService;



bleno.on('stateChange', (state)=>{
  if(state === 'poweredOn' ){
  bleno.startAdvertising(name, serviceUuids, (error)=>{
    console.log(error);
  });
  } else {
  bleno.stopAdvertising();
}
});


bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ec00',
        characteristics: [
          new SPCharacteristic()
        ]
      })
    ]);
  }
});