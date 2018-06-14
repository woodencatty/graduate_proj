const mysql = require('mysql');

const client = mysql.createConnection({
    host: '192.9.44.54',
    port: 3306,
    user: 'root',
    password: '!305sns!',
    database: 'smashserver'
});

module.exports = {
    requestDeviceStatus: (ID, callback) => {

        client.query('SELECT activated FROM device WHERE deviceNumber = ?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
          
                callback(rows[0].activated.toString());
        });

    },

    requestUserName: (ID, callback) => {
        client.query('SELECT * FROM patient WHERE deviceNumber = ?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                callback(rows[0].patientName.toString())
            }
        });
    }, 

    requestUserExercise: (ID, callback) => {
    
        client.query('SELECT * FROM patient WHERE deviceNumber = ?', [ID], (err, rows) => {
            console.log(err);
            console.log(rows);
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                let previous_data = rows[0].exercise.toString().split(',');
                let update_data = ""
                if (previous_data[0] == "") {
                   callback("end"); //보내는 부분. 가공이 필요함.    
                    client.query('UPDATE patient SET exercise=? WHERE deviceNumber=?', ["", ID]);
                } else {
                   callback(previous_data[0]); //보내는 부분. 가공이 필요함.    
                    for (let i = 1; i < previous_data.length; i++) {
                        update_data += (previous_data[i] + ",");
                    }
                }
                client.query('UPDATE patient SET exercise=? WHERE deviceNumber=?', [update_data, ID]);
            }
        });
    }

}