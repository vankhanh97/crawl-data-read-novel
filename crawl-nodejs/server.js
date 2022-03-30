const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const request = require('request-promise');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.get('/',function(req,res){
    request('https://m.truyencv.vn/truyen/ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi/chuong-132/', (error, response, html) => {
    }).then((data) => {
        const $ = cheerio.load(data); // load HTML

        let text1 = $('.css-rz9p0m').text();
        let text2 = $('.css-400zec').text();
        let text3 = $('.e1vvrs4i1').text();
        res.render('index', {
            title1: text1,
            title2: text2,
            content: text3
        });
    })
});
app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM main_table;');
        console.log(result)
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})
app.use('/', router);
const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`Server started on Port ${port}`));



