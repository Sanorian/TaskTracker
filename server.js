const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.get('/login', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const password = req.query.password;
    let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(err.message);
            res.send({res:'bad'});
        }
      });
    db.all('SELECT * FROM users WHERE username = ? and password = ?',[username, password], (err, rows) => {
        if (err) {
          console.log(err);
          res.send({res:'bad'});
        }
        if (rows.length==1){
            res.send({res:'good', userid: rows[0].userid});
        } else {
            res.send({res:'bad'});
        }
        });
    db.close( (err) => {
        if (err) {
            reject(err.message);
    }
    });
});

app.get('/registration', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const password = req.query.password;
    let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(err.message);
            res.send({res:'bad'});
        }
      });
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          console.log(err);
        }
        let already = false;
        rows.forEach((user) =>{
          if (user.username == username){
            already = true;
          }
        });
        if (already){
          res.send({res:'already'})
        } else {
          newId = Number(rows[rows.length-1].userid)+1;
          db.run(`INSERT INTO users (userid, username, password) VALUES(?, ?, ?)`, [newId, username, password], function(err) {
            if (err) {
              res.send({res:'bad'});
              return console.log(err.message);
            }
            res.send({res:'good'});
          });
        }
      });
    
      db.close( (err) => {
        if (err) {
            reject(err.message);
        }
      });
});

app.get('/gettasks', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const userid = req.query.userid;
    let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(err.message);
            res.send({res:'bad'});
        }
    });
    db.all('SELECT * FROM tasks WHERE userid = ?', [userid], (err, rows) => {
        if (err) {
          console.log(err);
          res.send({res:'bad'});
        }
        res.send(rows);
    });
    db.close( (err) => {
        if (err) {
            reject(err.message);
        }
    });
});

app.get('/deletetask', (req, res)=>{
  res.header('Access-Control-Allow-Origin', '*');
  const taskId = req.query.id;
  let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        reject(err.message);
        res.send({res:'bad'});
    }
  });
  db.run(`DELETE FROM tasks WHERE id=?`, [taskId], function(err) {
    if (err) {
      res.send({res:'bad'});
      return console.log(err.message);
    }
    res.send({res:'good'});
  });
  db.close( (err) => {
    if (err) {
        reject(err.message);
}
});
});

port=3000;
app.listen(port, () => {
    console.log(`Server running on port${port}`);
    console.log('http://localhost:3000');
});