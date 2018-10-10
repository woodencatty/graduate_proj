var express = require('express');
var router = express.Router();

const sql = require('./sql.js');
const ble = require('./ble.js');

const fs = require('fs');
const http = require('http');


let refreshInterval = 1;
let IDD_ID = "";
let poster_ID = "";

let User_Name = "";
let User_Number = "";
let User_Exercise = "";
let User_Exercise_Count = 0;
let User_Step = 0;
//direc

var User_Enter = 0;


function initialize() {
  fs.readFile('/home/pi/graduate_proj/DeviceCode/SmartPoster/settings.conf', 'utf8', function (err, data) {
    var config = JSON.parse(data);
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
  console.log(poster_ID);
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
    sql.submitUserStep(User_Number, User_Step);

    countcallback = (count) => {
      User_Exercise_Count = count;
      res.render('detected', {
        username: User_Name,
        query: tts_query,
        count: User_Exercise_Count
      });

    }
    sql.countUserExercise(User_Number, countcallback);

  }
  sql.requestUserName(IDD_ID, Identifycallback);
});

//Need 2 fix

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
 // coachSearch.PherClear();
  IDD_ID = "";
  User_Exercise = "";
  User_Name = "";

  User_Number = "";
  User_Step = 0;
  User_Enter = 0;
  res.render('reset');
});

router.get('/exercise', function (req, res, next) {
  countcallback = (count) => {
  ttscallback = (tts) => {
    step2countcallback = (stepcount) => {
    res.render('exercise', {
      image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png",
      query: tts,
      username:User_Name,
      count:count,
      step:stepcount
    });
  }
    sql.countUserStep(User_Number, step2countcallback);
}
  sql.requestExerciseTTS(User_Exercise, ttscallback);
  }
  sql.countUserExercise(User_Number, countcallback);

});



router.get('/exercise_walk', function (req, res, next) {

  ttscallback = (tts) => {
    stepcountcallback = (stepcount) => {
    sql.addWalkExerciseDone(User_Number);
    res.render('exercise_walk', {
      name: User_Name,
      todaywalk: User_Step,
      todaycalorie: User_Step * 0.66,
      totalwalk: stepcount,
      totalcalorie: stepcount * 0.66,

      image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_" + User_Exercise + ".png",
      query: tts
    });
  }
  sql.countUserStep(User_Number, stepcountcallback);
}
  sql.requestExerciseTTS(User_Exercise, ttscallback);
});

router.get('/exercise_walk_done', function (req, res, next) {
  countcallback = (count) => {

  stepcountcallback = (stepcount) => {

  res.render('exercise_walk_done', {
    name: User_Name,
    count:count,
    todaywalk: User_Step,
    todaycalorie: User_Step * 0.66,
    totalwalk: stepcount,
    totalcalorie: stepcount * 0.66,

    query: "걸어오시느라 수고하셨습니다!" + User_Name + "님, 운동을 마무리 해볼까요?"
  });
  }
  sql.countUserStep(User_Number, stepcountcallback);

  
}
sql.countUserExercise(User_Number, countcallback);

});

router.get('/end', function (req, res, next) {
  stepcountcallback = (stepcount) => {
    res.render('end', {
      query: "운동을 모두 끝냈습니다. 얼마나 했는지 알아볼까요?",
      name: User_Name,
      todaywalk: User_Step,
      todaycalorie: User_Step * 0.66,
      totalwalk: stepcount,
      totalcalorie: stepcount * 0.66
    });
  }

  sql.countUserStep(User_Number, stepcountcallback);
});

router.get('/pause', function (req, res, next) {

  sql.undoExerciseDone(User_Number, User_Exercise);
  countcallback = (count) => {

    res.render('pause', {
      query: "다음에 꼭 같이해요.",
      count: count
    });
  }
  sql.countUserExercise(User_Number, countcallback);

});

// need to fix
router.get('/wrong_direction', function (req, res, next) {
  res.render('wrong_direction', {
    image: "http://192.9.44.54:8081/smash/resources/img/programimg/programImg_walk331to305.png",
    query: "여기가 아니에요!" + User_Name + "님"
  });

});


initialize();

module.exports = router;