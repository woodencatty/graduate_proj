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
                callback(rows[0].patientName.toString(), rows[0].patientNumber.toString())
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
                if (previous_data[0] == "") {
                    callback("end"); //보내는 부분. 가공이 필요함.    
                    client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', ["0,0,0,0,0", ID]);
                } else {
                    callback(previous_data[0]); //보내는 부분. 가공이 필요함.    
                    for (let i = 1; i < 5; i++) {
                        update_data += (previous_data[i] + ",");
                    }
                    client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', [update_data + "0", ID]);
                }
                
            }
        });
    },

    requestUserwalk: (ID, callback) => {
        client.query('select exerciseTime, DailyStep from exercise where patientNum=?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                callback(rows); //보내는 부분. 가공이 필요함.    
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
        let total_step = Steps;
        client.query('SELECT * FROM exercise WHERE patientNum = ? AND exerciseTime = ?', [ID, dateTime.toFormat("YYYY-MM-DD")], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                client.query('INSERT INTO exercise(exerciseNum,patientNum,programNum,exerciseTime,DailyStep)  VALUES(?, ?, ?, ?, ?) ', [getRandomInt(), ID,"walkProgram", dateTime.toFormat('YYYY-MM-DD'), Steps], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                    } else {

                    }
                });
            } else {
                total_step = total_step + rows[0].DailyStep.toString();
                client.query('DELETE FROM exercise WHERE patientNum=? AND exerciseTime=?', [ID, dateTime.toFormat('YYYY-MM-DD')], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                client.query('INSERT INTO exercise(exerciseNum,patientNum,programNum,exerciseTime,DailyStep)  VALUES(?, ?, ?, ?, ?) ', [getRandomInt(), ID,"walkProgram", dateTime.toFormat('YYYY-MM-DD'), total_step], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                    } else {

                    }
                });
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
            let update_data = "walkProgramDone, " + previous_data;
           
            client.query('UPDATE patient SET patientProgram=? WHERE patientNumber=?', [update_data + "0", ID]);
        }
    });
},


}