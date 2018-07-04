var express = require('express');
var router = express.Router();

//const sensor = require('./sensor.js');
//const AP = require('./hotSpot.js');
//const restAPI = require('./rest_api.js');
const sql = require('./sql.js');
const fs = require('fs');
const http = require('http');
const coachSearch = require('./CoachSearch.js');


let refreshInterval = 1;
let IDD_ID = "";
let poster_ID = "";

let User_Name = "";
let User_Number = "";
let User_Exercise = "";
let User_Step = 20;
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
    interval = config.refreshInterval;
    poster_ID = config.deviceName;
  });
  console.log("Page is Running..(3000)");
}


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("routed to /")
  Statuscallback = (returnData) => {
    console.log("get data : " + returnData);
    if (returnData == "1") {
      if (IDD_ID == "") {
        res.render('index', {
          Interval: refreshInterval
        });
      } else {
        res.redirect('/detected');
      }
    } else {
      res.redirect('/unactivated');
    }
  }
  sql.requestDeviceStatus(poster_ID, Statuscallback);

});

router.get('/unactivated', function (req, res, next) {
  res.render('index_unactive');
});

router.get('/detected', function (req, res, next) {
  Identifycallback = (user_Name, user_Number) => {
    User_Name = user_Name; // 환자이름 빼먹음;
    User_Number = user_Number;
    var tts_query = "안녕하세요! " + User_Name + "님! 같이 운동 해볼까요?"

    countcallback = (count) => {

      res.render('detected', {
        username: User_Name,
        query: tts_query,
        count: count
      });

    }
    countUserExercise(User_Number, countcallback);

  }
  sql.requestUserName(IDD_ID, Identifycallback);
});

router.get('/search_exercise', function (req, res, next) {
  dentifycallback = (returnData) => {
    User_Exercise = returnData; // 환자이름 빼먹음;
    if (returnData == "walk331to305") {
      User_Exercise = returnData; // 환자이름 빼먹음;
      res.redirect('/exercise_walk');
    } else if (returnData == "end") {
      res.redirect('/end');
    } else if (returnData == "walkfinish331to305") {
      checkcallback = (isCorrect) => {
        if (isCorrect == 1) {
          res.redirect('/exercise_walk_done');
        } else {
          res.redirect('/wrong_direction');
        }
      }
      sql.checkArrivePoster(poster_ID, returnData, checkcallback);
    } else {
      res.redirect('/exercise');
    }

  }
  sql.requestUserExercise(User_Number, dentifycallback);
});

router.get('/reset', function (req, res, next) {
  coachSearch.PherClear();
  IDD_ID = "";
  User_Exercise = "";
  User_Name = "";

  User_Number = "";
  User_Step = 0;
  res.render('reset');
});

router.get('/exercise', function (req, res, next) {
  ttscallback = (tts) => {
    res.render('exercise', {
      image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png",
      query: tts,
    });
  }
  sql.requestExerciseTTS(User_Exercise, ttscallback);
});



router.get('/exercise_walk', function (req, res, next) {
  ttscallback = (tts) => {
    sql.addWalkExerciseDone(User_Number);
    res.render('exercise_walk', {
      image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png",
      query: tts
    });
  }
  sql.requestExerciseTTS(User_Exercise, ttscallback);
});

router.get('/exercise_walk_done', function (req, res, next) {
  sql.submitUserStep(User_Number, User_Step);
  res.render('exercise_walk_done', {
    query: "걸어오시느라 수고하셨습니다!" + User_Name + "님"
  });

});

router.get('/end', function (req, res, next) {
  stepcountcallback = (stepcount) => {
    res.render('end', {
      query: "운동을 모두 끝냈습니다. 얼마나 했는지 알아볼까요?",
      name: User_Number,
      todaywalk: User_Exercise,
      todaycalorie: User_Exercise * 0.66,
      totalwalk: stepcount,
      totalcalorie: stepcount * 0.66
    });
  }

  countUserStep(User_Number, stepcountcallback);
});

router.get('/pause', function (req, res, next) {
  countcallback = (count) => {

    res.render('pause', {
      query: "다음에 꼭 같이해요.",
      count: count
    });
  }
  countUserExercise(User_Number, countcallback);

});


router.get('/wrong_direction', function (req, res, next) {
  res.render('wrong_direction', {
    image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_walk331to305.png",
    query: "여기가 아니에요!" + User_Name + "님"
  });

});


initialize();

module.exports = router;