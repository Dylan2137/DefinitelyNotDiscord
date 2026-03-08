import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'draedon',
    password: '1509',
    database: 'Electron',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;