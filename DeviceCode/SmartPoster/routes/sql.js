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
            if (!rows.length) {
                console.log("DB query Error!");
            } else {
                callback(rows[0].activated.toString());
            }
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
    }


}