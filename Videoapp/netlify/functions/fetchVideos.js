const mysql = require('mysql');

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'database-1.cpcoaa4m8rfg.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'video_database'
});

exports.handler = (event, context, callback) => {
    const query = 'SELECT * FROM video_translations';
    db.query(query, (err, results) => {
        if (err) {
            callback(null, {
                statusCode: 500,
                body: 'Veritabanı sorgusunda hata oluştu.',
            });
            return;
        }

        // HTML çıktısı
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <title>Video Bilgileri</title>
            </head>
            <body>
                <h1>Video Bilgileri</h1>
                <script>
                    function speakText(text) {
                        const msg = new SpeechSynthesisUtterance(text);
                        msg.lang = 'tr-TR';
                        window.speechSynthesis.speak(msg);
                    }
                </script>
        `;

        results.forEach(row => {
            htmlContent += `
                <h2>${row.video_name}</h2>
                <textarea rows="5" cols="60" readonly id="text_${row.video_id}">${row.turkish_text}</textarea>
                <br>
                <button onclick="speakText(document.getElementById('text_${row.video_id}').value)">Seslendir</button>
                <br>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${row.video_id}" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                <hr>
            `;
        });

        htmlContent += `
            </body>
            </html>
        `;

        callback(null, {
            statusCode: 200,
            headers: { "Content-Type": "text/html" },
            body: htmlContent,
        });
    });
};
