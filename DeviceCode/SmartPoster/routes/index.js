var express = require('express');
var router = express.Router();

//const sensor = require('./sensor.js');
//const AP = require('./hotSpot.js');
const restAPI = require('./rest_api.js');
const bluetooth = require('./ble_central.js')   

const fs = require('fs');
const http = require('http');

let refreshInterval = 1;
let APD_ID = "";
let IDD_ID = "";

let User_Name = "";
let User_Exercise = "";

function initialize() {
  fs.readFile('./settings.conf', 'utf8', function (err, data) {
    var config = JSON.parse(data);
      interval = config.refreshInterval;
    APD_ID = config.deviceName;
    restAPI.init(config.serverIP, config.serverPort);
  });
  console.log("Page is Running..(3000)");
setInterval(() => {
  
  detectcallback = (deviceName)=>{
    IDD_ID = deviceName;
  }
  bluetooth.IDD_found(detectcallback);
}, 1000);

}


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("routed to /")
  Statuscallback = (returnData) => {

    console.log("get data : " + returnData);
    if(returnData == "1"){
      if (IDD_ID == "") {
        res.render('index', { Interval: refreshInterval, temp: 0, humi: 0});
        
       /* sensorcallback = (temp, humi)=>{
          res.render('index', { Interval: refreshInterval, temp: temp, humi: humi });
        }
        sensor.getTemp(sensorcallback);*/
      } else {
        res.redirect('/detected');
      }}else {res.redirect('/unactivated');}
  }
  restAPI.requestDeviceStatus("SP01",  Statuscallback);

});

router.get('/unactivated', function (req, res, next) {
  res.render('index_unactive');
});

router.get('/detected', function (req, res, next) {
  Identifycallback = (returnData) => {
    User_Name = returnData; // 환자이름 빼먹음;
    var tts_query = "안녕하세요! "+User_Name+"님! 같이 운동 해볼까요?"
    res.render('detected', { username: User_Name, query: tts_query});
  }
  restAPI.requestUserInfo(IDD_ID,Identifycallback);
});

router.get('/search_exercise', function (req, res, next) {
  dentifycallback = (returnData) => {
    User_Exercise = returnData; // 환자이름 빼먹음;
    if(returnData == exercise_walk){
      res.redirect('/exercise_walk');  
    } else{
      res.redirect('/exercise');
    }
    
  }
  restAPI.requestUserExercise(IDD_ID,dentifycallback);
});

router.get('/reset', function (req, res, next) {
  IDD_ID = "";
  User_Exercise = "";
  User_Name = "";
  
  res.render('reset');
});

router.get('/exercise', function (req, res, next) {
  exercisecallback = (returnData) =>{

    res.render('exercise', {image: returnData});
  }
  restAPI.requestExerciseURL(User_Exercise,exercisecallback);
});


router.get('/exercise_walk', function (req, res, next) {

  res.render('exercise_walk');
  
});


initialize();

module.exports = router;
