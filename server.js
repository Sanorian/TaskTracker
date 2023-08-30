const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.get('/login', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const password = req.query.password;
    console.log(username, password);
});

app.get('/registration', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const password = req.query.password;
    console.log(username, password);

});

app.get('/gettasks', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const password = req.query.password;
    //SELECT * FROM tasks WHERE userid = (SELECT userid FROM users WHERE username = ? and password = ?),[username, password]
    //Запрос
});

port=3000;
app.listen(port, () => {
    console.log(`Server running on port${port}`);
    console.log('http://localhost:3000');
});