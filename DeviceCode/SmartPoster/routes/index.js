var express = require('express');
var router = express.Router();


//const sensor = require('./sensor.js');
//const AP = require('./hotSpot.js');
//const restAPI = require('./rest_api.js');
const sql = require('./sql.js');
const fs = require('fs');
const http = require('http');

let refreshInterval = 1;
let IDD_ID = "";
let APD_ID="";

let User_Name = "";
let User_Number = "";
let User_Exercise = "";
let User_Step = 0;
//direct

function Setup_IDD_Socket() {
  http.createServer((request, response) => {
    if (request.method == 'POST') {
      if (request.url == '/identify/information') {
        IDD_ID = request.headers.idd_id;
        response.writeHead(200);
        response.end("gotit"); //IDD에 확인메세지 전송
        console.log("Hi! " + IDD_ID); //환자 식별
      } else if (request.url == '/patient/exercise') {
        response.writeHead(200);
        User_Step = request.headers.exercise;
        console.log(request.headers.exercise);
        console.log(request.headers.idd_id);
        IDD_ID = request.headers.idd_id;
        response.end("gotit");
      } else if (request.url == '/patient/leave') {
        response.writeHead(200);
        response.end("good-bye");
        IDD_ID = "";
      } else {
        console.log("error");
        response.writeHead(404);
        response.end();
      }
    }
  }).listen(3010, () => {
    console.log('Socket is Running (3010) ...');
  });
}


function initialize() {
  fs.readFile('./settings.conf', 'utf8', function (err, data) {
    var config = JSON.parse(data);
    Setup_IDD_Socket();
    // AP.setupAP(config.ssid, config.password, true, config.adaptor);
    interval = config.refreshInterval;
    APD_ID = config.deviceName;
  });
  console.log("Page is Running..(3000)");
}


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("routed to /")
  Statuscallback = (returnData) => {

    /*  detectcallback = (deviceName)=>{
        IDD_ID = deviceName;
      }
      bluetooth.IDD_found(detectcallback);*/

    console.log("get data : " + returnData);
    if (returnData == "1") {
      if (IDD_ID == "") {
        res.render('index', {
          Interval: refreshInterval,
          temp: 0,
          humi: 0
        });

        /* sensorcallback = (temp, humi)=>{
           res.render('index', { Interval: refreshInterval, temp: temp, humi: humi });
         }
         sensor.getTemp(sensorcallback);*/
      } else {
        res.redirect('/detected');
      }
    } else {
      res.redirect('/unactivated');
    }
  }
  sql.requestDeviceStatus(APD_ID, Statuscallback);

});

router.get('/unactivated', function (req, res, next) {
  res.render('index_unactive');
});

router.get('/detected', function (req, res, next) {
  Identifycallback = (user_Name, user_Number) => {
    User_Name = user_Name; // 환자이름 빼먹음;
    User_Number = user_Number;
    var tts_query = "안녕하세요! " + User_Name + "님! 같이 운동 해볼까요?"
    res.render('detected', {
      username: User_Name,
      query: tts_query
    });
  }
  sql.requestUserName(IDD_ID, Identifycallback);
});

router.get('/search_exercise', function (req, res, next) {
  dentifycallback = (returnData) => {
    User_Exercise = returnData; // 환자이름 빼먹음;
    if (returnData == "walkProgram") {
      res.redirect('/exercise_walk');
    } else if (returnData == "end") {

    } else {
      res.redirect('/exercise');
    }

  }
  sql.requestUserExercise(User_Number, dentifycallback);
});

router.get('/reset', function (req, res, next) {
  IDD_ID = "";
  User_Exercise = "";
  User_Name = "";

  res.render('reset');
});

router.get('/exercise', function (req, res, next) {

  res.render('exercise', {
    image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png"
  });

});


router.get('/exercise_walk', function (req, res, next) {

  res.render('exercise', {
    image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png"
  });
  sql.submitUserStep(User_Number, User_Step);

});


initialize();

module.exports = router;