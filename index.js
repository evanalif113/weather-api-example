const express    = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql2');

const app = express();
const port = 3000;

// ===== Middleware =====
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// ===== Koneksi MySQL =====
const db = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'weather_db'
});

// ===== ROUTE: GET =====
// contoh: GET /api/data?temp=24.5&hum=60
app.get('/api/data', (req, res) => {
  const temp = req.query.temp;   // string
  const hum  = req.query.hum;

  if (!temp || !hum) {
    return res.status(400).send('Parameter temp dan hum wajib diisi.');
  }

  // Simpan ke DB (opsional)
  const sql = `INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)`;
  db.query(sql, [temp, hum], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    res.send(`Data diterima via GET: temp=${temp}, hum=${hum}`);
  });
});

// ===== ROUTE: POST =====
// contoh: POST /api/data dengan body: temp=24.5&hum=60
app.post('/api/data', (req, res) => {
  const temp = req.body.temp;
  const hum  = req.body.hum;

  if (!temp || !hum) {
    return res.status(400).send('Parameter temp dan hum wajib diisi.');
  }

  // Simpan ke DB (opsional)
  const sql = `INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)`;
  db.query(sql, [temp, hum], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    res.send(`Data diterima via POST: temp=${temp}, hum=${hum}`);
  });
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
