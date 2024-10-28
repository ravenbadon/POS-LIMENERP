const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { error } = require('console');
const { get } = require('http');

const app = express()
app.use(cors())

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


app.get('/api/product', (req, res)=> {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/api/product/search', (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Query parameter is missing' });
    }

    console.log("Search Query:", searchQuery); // Debugging Log

    const sql = `
        SELECT * FROM product 
        WHERE prodName LIKE ?
        OR prodBrand LIKE ?
        OR prodSKU LIKE ?
        OR prodBarcode LIKE ?
    `;
    
    const values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    connection.query(sql, values, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});



app.listen(8082, ()=> {
    console.log("Server is listening on port 8082");
})