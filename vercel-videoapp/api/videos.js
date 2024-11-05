const mysql = require('mysql');

// Veritabanı bağlantı havuzu oluştur
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'database-1.cpcoaa4m8rfg.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'video_database'
});

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Yalnızca GET isteklerine izin veriliyor.');
    }

    const query = 'SELECT * FROM video_translations';

    // Havuzdan bağlantı al ve sorguyu çalıştır
    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusunda hata oluştu:', err);
            res.status(500).json({ error: 'Veritabanı sorgusunda hata oluştu.' });
            return;
        }
        res.status(200).json(results); // JSON formatında veri döner
    });
};
