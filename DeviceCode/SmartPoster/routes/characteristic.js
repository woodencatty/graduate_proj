var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SPCharacteristic = function() {
  SPCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(SPCharacteristic, BlenoCharacteristic);

SPCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SPCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

SPCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  console.log('SPCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('SPCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};


module.exports = SPCharacteristic;