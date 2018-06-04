const noble = require('noble');
const restAPI = require('./rest_api.js');

var DeviceName = "";

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning(['ff10'], true);
    } else {
        noble.stopScanning();
    }
});
noble.on('discover', function (peripheral) {
    if(peripheral.advertisement.localName == "Linker01"){
        if(peripheral.rssi <= 40){
            console.log("블루투스> 찾았음(discovery) ------------------------- ");
            console.log("블루투스> 이름: " + peripheral.advertisement.localName);
            console.log("블루투스> 주소: " + peripheral.address);
            console.log("블루투스> 신호세기(RSSI): " + peripheral.rssi);
            console.log("------------------------------------");
                DeviceName =  peripheral.advertisement.localName;
            connectAndSetUp(peripheral);
        }}
});

function connectAndSetUp(peripheral) {
    peripheral.connect(function (error) {
        console.log("연결중입니다.");
        var serviceUUIDs = ['ff10'];
        var characteristicUUIDs = ['ff11'];
        peripheral.discoverSomeServicesAndCharacteristics
            (serviceUUIDs, characteristicUUIDs,
            onServicesAndCharacteristicsDiscovered);
    });
    // attach disconnect handler
    peripheral.on('disconnect', onDisconnect);
    setTimeout(() => {
        peripheral.disconnect();
        }, 5000);
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    console.log("데이터를 받으려 시도합니다.");
    if (error) {
        console.log('Error discovering services and characteristics ' + error);
        return;
    }
    var LinkerCharacteristic = characteristics[0];
    console.log("데이터를 받습니다.");
        LinkerCharacteristic.read ((error, data)=>{
            console.log("데이터는 다음과 같습니다.");
            console.log(data);
           });

}

module.exports = {
    IDD_found:(callback)=> {
        callback(DeviceName);
    },
    reset:()=>{
        DeviceName = "";
    }
  }
  

function onDisconnect(){
    console.log("연결이 해지되었습니다");
}