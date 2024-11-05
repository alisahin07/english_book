const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  // Veritabanı bağlantısını oluşturuyoruz
  const db = await mysql.createConnection({
    host: 'database-1.cpcoaa4m8rfg.eu-west-1.rds.amazonaws.com', // veritabanı host adresi
    user: 'admin', // veritabanı kullanıcı adı
    password: 'password', // veritabanı şifresi
    database: 'video_database', // veritabanı adı
  });

  try {
    // SQL sorgusunu çalıştır
    const [rows] = await db.query('SELECT * FROM video_translations');
    res.status(200).json(rows); // JSON olarak veri döndür
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).send('Veritabanına erişilemiyor');
  } finally {
    db.end(); // Bağlantıyı kapat
  }
};
