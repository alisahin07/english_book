const mysql = require('mysql');

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'database-1.cpcoaa4m8rfg.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'video_database'
});

db.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı.');
    }
});

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Yalnızca GET isteklerine izin veriliyor.');
    }

    const query = 'SELECT * FROM video_translations';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Veritabanı sorgusunda hata oluştu.' });
            return;
        }
        res.status(200).json(results); // JSON formatında veri döner
    });
};
