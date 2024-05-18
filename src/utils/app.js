// Import CSV data into PostgeSQL using Node.js

const express = require("express");
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const pool = require('../db');

const app = express();
const upload = multer({ dest: 'uploads' });

app.post('/upload', upload.single('csv'), async (req, res) => {
    const filePath = req.file.path;

    const csvData = [];
    const success = [];
    const errors = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
            csvData.push(data);
        })
        .on('end', async () => {
            for (const row of csvData) {
                try {
                    const userData = userSchema.parse(row);
                    const result = await pool.query(
                        'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
                        [userData.name, userData.email, userData.age]
                    );
                    success.push(result.rows[0]);
                } catch (err) {
                    errors.push(err);
                }
            }
            res.json({ success, errors });
        });
});
module.exports = app;

app.listen(4000, () => {
    console.log('Server started on port 4000');
})