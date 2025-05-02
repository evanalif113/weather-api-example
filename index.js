const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// ===== Middleware =====
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Untuk parsing JSON

// ===== Koneksi MySQL =====
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weather_db'
});

// ===== ROUTE: GET kirim via URL-encoded =====
// contoh: GET /api/data/send?temperature=24.5&humidity=60&pressure=1013&dew=18.2&rainfall=0
app.get('/api/data/send', (req, res) => {
  const { temperature, humidity, pressure, dew, rainfall } = req.query;

  if (!temperature || !humidity || !pressure || !dew || !rainfall) {
    return res.status(400).send('Semua parameter (temperature, humidity, pressure, dew, rainfall) wajib diisi.');
  }

  const sql = `INSERT INTO weather_data (temperature, humidity, pressure, dew, rainfall) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [temperature, humidity, pressure, dew, rainfall], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    res.send(`Data diterima via GET: temperature=${temperature}, humidity=${humidity}, pressure=${pressure}, dew=${dew}, rainfall=${rainfall}`);
  });
});

// ===== ROUTE: POST kirim via URL-encoded =====
// contoh: POST /api/data/send dengan body: { "temperature": 24.5, "humidity": 60, "pressure": 1013, "dew": 18.2, "rainfall": 0 }
app.post('/api/data/send', (req, res) => {
  const { temperature, humidity, pressure, dew, rainfall } = req.body;

  if (!temperature || !humidity || !pressure || !dew || !rainfall) {
    return res.status(400).send('Semua parameter (temperature, humidity, pressure, dew, rainfall) wajib diisi.');
  }

  const sql = `INSERT INTO weather_data (temperature, humidity, pressure, dew, rainfall) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [temperature, humidity, pressure, dew, rainfall], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    res.send(`Data diterima via POST: temperature=${temperature}, humidity=${humidity}, pressure=${pressure}, dew=${dew}, rainfall=${rainfall}`);
  });
});

// ===== ROUTE: GET ambil semua data =====
// GET /api/data/all
app.get('/api/data/all', (req, res) => {
  const sql = `SELECT id, temperature, humidity, pressure, dew, rainfall, created_at FROM weather_data ORDER BY created_at DESC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal mengambil data.');
    }
    res.json(results);
  });
});

// ===== ROUTE: GET ambil satu record by ID =====
// GET /api/data/:id
app.get('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT id, temperature, humidity, pressure, dew, rainfall, created_at FROM weather_data WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal mengambil data.');
    }
    if (results.length === 0) {
      return res.status(404).send('Data tidak ditemukan.');
    }
    res.json(results[0]);
  });
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`- Kirim data via GET  : /api/data/send?temperature=..&humidity=..&pressure=..&dew=..&rainfall=..`);
  console.log(`- Kirim data via POST : /api/data/send (body JSON)`);
  console.log(`- Ambil semua data     : /api/data/all`);
  console.log(`- Ambil data by ID     : /api/data/:id`);
});