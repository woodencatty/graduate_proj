var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var APDCharacteristic = function() {
  APDCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(APDCharacteristic, BlenoCharacteristic);

APDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('APDCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

APDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('APDCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('APDCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

APDCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('APDCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

APDCharacteristic.prototype.onUnsubscribe = function() {
  console.log('APDCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = APDCharacteristic;