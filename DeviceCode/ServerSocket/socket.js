const http = require('http');
const mysql = require('mysql');


const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '!305sns!',
    database: 'smashserver'
});


function Setup_APD_Socket() {
    http.createServer((request, response) => {
        if (request.method == 'GET') {
            if (request.url == '/patient/name') {
                console.log(request.headers.idd_id);
                client.query('SELECT * FROM patient WHERE deviceNumber = ?', [request.headers.idd_id], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                        response.writeHead(404);
                        response.end();
                    } else {
                        response.writeHead(200);
                        response.end(rows[0].patientName.toString()); //보내는 부분. 가공이 필요함.
                    }
                });
            } else if (request.url == '/device/status') {
                console.log(request.headers.apd_id);
                client.query('SELECT activated FROM device WHERE deviceNumber = ?', [request.headers.apd_id], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                        response.writeHead(404);
                        response.end();
                    } else {
                        response.writeHead(200);
                        response.end(rows[0].activated.toString()); //보내는 부분. 가공이 필요함.
                        client.query('SELECT activated FROM device WHERE deviceNumber = ?', [request.headers.apd_id], (err, rows) => {});
                    }
                });

//걷기운동 지정하는부분
} else if (request.url == '/exercise/walk') {
    console.log(request.headers.exercise_id);
    client.query('SELECT url FROM exercise WHERE id = ?', [request.headers.exercise_id], (err, rows) => {
        console.log(err);
        console.log(rows);
        if (!rows.length) {
            console.log("DB query Error!");
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200);
            response.end(rows[0].activated.toString()); //보내는 부분. 가공이 필요함.
            client.query('SELECT url FROM exercise WHERE id = ?', [request.headers.exercise_id], (err, rows) => {});
        }
    });
    //걷기운동(출발지, 목적지, 해당환자번호);'
//작성필요
            } else if (request.url == '/patient/exercise') {
                console.log(request.headers.idd_id);
                client.query('SELECT * FROM patient WHERE deviceNumber = ?', [request.headers.idd_id], (err, rows) => {
                    console.log(err);
                    console.log(rows);
                    if (!rows.length) {
                        console.log("DB query Error!");
                        response.writeHead(404);
                        response.end();
                    } else {
                        let previous_data = rows[0].exercise.toString().split(',');
                        let update_data = ""
                        if (previous_data[0] == "") {
                            response.writeHead(200);
                            response.end("end"); //보내는 부분. 가공이 필요함.    
                            client.query('UPDATE patient SET exercise=? WHERE deviceNumber=?', ["", request.headers.idd_id]);
                        } else {
                            response.writeHead(200);
                            response.end(previous_data[0]); //보내는 부분. 가공이 필요함.    
                            for (let i = 1; i < previous_data.length; i++) {
                                update_data += (previous_data[i] + ",");
                            }
                        }
                        client.query('UPDATE patient SET exercise=? WHERE deviceNumber=?', [update_data, request.headers.idd_id]);
                    }
                });
            } else {
                console.log("GET error");
                response.writeHead(404);
                response.end();
            }
        } /* GET method */
        else if (request.method == 'POST') {
            if (request.url == '/device/error') {
                client.query('INSERT INTO error (apd_id, date, err) VALUES (?,?,?)', [request.headers.apd_id, Date.now(), request.headers.sys_error], (err) => {
                    if (err) {
                        console.log(err);
                        console.log("DB query Error!");
                        response.writeHead(404);
                        response.end();
                    } else {
                        console.log("SUCCESS");
                        response.writeHead(200);
                        response.end();
                    }
                });
            }
            if (request.url == '/patient/exercise') {
                var exercise_arr = request.headers.exercise.split(']');
                client.query('SELECT * FROM patient WHERE deviceNumber = ?', [request.headers.idd_id], (err, rows) => {
                    if (!rows.length) {
                        console.log("DB query Error!");
                    } else {
                        for (let i = 0; i < exercise_arr.length - 1; i++) {
                            client.query('INSERT INTO exercise (name, exercise) VALUES (?,?)', [rows[0].patientName.toString(), exercise_arr[i]], (err) => {
                                if (err) {
                                    console.log(err);
                                    console.log("DB query Error!");
                                    response.writeHead(404);
                                    response.end();
                                } else {
                                    console.log("SUCCESS");
                                    response.writeHead(200);
                                    response.end();
                                }
                            });
                        }
                    }
                });


            } else {
                console.log("POST error");
                response.writeHead(404);
                response.end();
            }
        }
    }).listen(8082, () => {
        console.log('Device Socket Running (8082) ...');
    });
}