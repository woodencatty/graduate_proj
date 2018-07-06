const mysql = require('mysql');

const client = mysql.createConnection({
    host: '192.9.44.54',
    port: 3306,
    user: 'root',
    password: '!305sns!',
    database: 'smashserver'
});

require('date-utils');
let dateTime = new Date();

function getRandomInt() { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (1000)) + 1;
}


module.exports = {
    requestDeviceStatus: (ID, callback) => {

        client.query('SELECT activated FROM device WHERE deviceNumber = ?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                callback("0");
            }
            if(err){
                callback("0");
            }
            callback(rows[0].activated.toString());
        });

    },

    requestUserName: (ID, callback) => {
        client.query('select patientName,patient.patientNumber from device join patient on device.patientNumber = patient.patientNumber and deviceNumber = ?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                callback(rows[0].patientName.toString(), rows[0].patientNumber.toString());
            }
        });
    },

    requestUserExercise: (ID, callback) => {
        client.query('select patientProgram from patient where patientNumber=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                let previous_data = rows[0].patientProgram.toString().split(',');
                let update_data = ""
                if (previous_data[0] == "0") {
                    client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', ["0,0,0,0,0", ID]);
                    callback("end"); //보내는 부분. 가공이 필요함.    
                } else {
                    for (let i = 1; i < 5; i++) {
                        update_data += (previous_data[i] + ",");
                    }
                    client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', [update_data + "0", ID]);
                    callback(previous_data[0]); //보내는 부분. 가공이 필요함.    
                }

            }
        });
    },

    requestExerciseTTS: (Program, callback) => {
        client.query('SELECT content FROM program WHERE programNumber = ?', [Program], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                callback(rows[0].content.toString())
            }
        });
    },


    submitUserStep: (ID, Steps) => {
        client.query('SELECT * FROM exercise WHERE patientNum = ? AND exerciseTime = ?', [ID, dateTime.toFormat("YYYY-MM-DD")], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                client.query('INSERT INTO exercise(exerciseNum,patientNum,exerciseTime,DailyStep) VALUES(?, ?, ?, ?) ', [getRandomInt(), ID, dateTime.toFormat('YYYY-MM-DD'), Steps], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                    } else {

                    }
                });
            } else {
                var addedStep = parseInt(rows[0].DailyStep.toString()) + Steps;
                client.query('UPDATE exercise SET DailyStep=? WHERE patientNum=? AND exerciseTime=?', [addedStep, ID, dateTime.toFormat('YYYY-MM-DD')], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                    } else {

                    }
                });
            }
        });
    },
    addWalkExerciseDone: (ID) => {
        client.query('select patientProgram from patient where patientNumber=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                let previous_data = rows[0].patientProgram.toString().split(',');
                let update_data = "walkfinish331to305," + previous_data[0] + "," + previous_data[1] + "," + previous_data[2] + "," + previous_data[3];

                client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', [update_data, ID]);
            }
        });
    },
    undoExerciseDone: (ID, undoExercise) => {
        client.query('select patientProgram from patient where patientNumber=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                let previous_data = rows[0].patientProgram.toString().split(',');
                let update_data = undoExercise + "," + previous_data[0] + "," + previous_data[1] + "," + previous_data[2] + "," + previous_data[3];

                client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', [update_data, ID]);
            }
        });
    },
    checkArrivePoster: (poster_ID, program_ID, callback) => {

        client.query('SELECT * FROM program WHERE programNumber = ?', [program_ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (rows[0].ArrivePoster.toString() == poster_ID) {
                callback(1);
            } else {
                callback(0);
            }
        });
    },

    countUserExercise: (ID, callback) => {
        client.query('select patientProgram from patient where patientNumber=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                let exercisedata = rows[0].patientProgram.toString().split(',');
                console.log(exercisedata);
                let numberofexercise = 0;
                for(var i=0; i<exercisedata.length; i++){
                    if(exercisedata[i] == "0"){

                    }else{
                        numberofexercise++;
                    }
                }
                callback(numberofexercise);
            }
        });
    },
    countUserStep: (ID, callback) => {
        client.query('select DailyStep from exercise where patientNum=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                var totalstep = 0;
                for (var i = 0; i < rows.length; i++) {
                    totalstep += rows[i].DailyStep;
                }
                callback(totalstep);
            }
        });
    }
}