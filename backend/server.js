const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { error } = require('console');
const { get } = require('http');

const app = express()
app.use(cors())
app.use(express.json()); 

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'R00tp@ssword',
    database: 'limenerp'
})

app.get('/', (re, res)=> {
    return res.json("From Backend");
})

app.get('/api/regular', (req, res)=> {
    const sql = "SELECT * FROM regular";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// API to add a new regular customer 
app.post('/api/regular/add', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        custLName,
        custFName,
        custMName,
        custAddr,
        custEmail,
        custBalance
    } = req.body;

    if (!custLName || !custFName || !custMName || !custAddr || !custEmail || !custBalance) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'INSERT INTO regular (custLName, custFName, custMName, custAddr, custEmail, custBalance) VALUES (?, ?, ?, ?, ?, ?)',
        [custLName, custFName, custMName, custAddr, custEmail, custBalance],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add customer' });
            }
            res.status(201).json({ message: 'Customer added successfully' });
        }
    );
});

app.get('/api/product', (req, res)=> {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/api/product/search', (req, res) => {
    const searchQuery = req.query.query;

    let sql = 'SELECT * FROM product';
    let values = [];

    if (searchQuery) {
        sql += `
            WHERE prodName LIKE ?
            OR prodBrand LIKE ?
            OR prodSKU LIKE ?
            OR prodBarcode LIKE ?
        `;
        values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
    }

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(results);
    });
});




app.listen(8082, ()=> {
    console.log("Server is listening on port 8082");
}) //port is 8082 instead of 8081