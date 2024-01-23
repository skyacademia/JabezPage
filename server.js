const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const app = express();

app.use(morgan('combined'));

// 서버를 80 포트로 실행
app.listen(8080, () => {
  console.log('server running on port 80');
});

// client가 '/'으로 접속하면 index.html을 전송
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// client가 '/admin'으로 접속하면 admin.html을 전송
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});


// public 폴더를 static 폴더로 지정
app.use(express.static('public'));

// client가 '/api/memberData/:id'로 접속하면 sqplite3로 연결한 뒤 데이터베이스에서 데이터를 가져와서 전송
app.get('/api/memberData/:id', (req, res) => {
  const id = req.params.id;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }else{
      console.log('Connected to the database.');
    } 
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT * FROM Member_Information_tbl WHERE ID = ${id}`, (err, rows) => {
    if (err) {
      console.error(err.message);
    }else{
      console.log('Query successfully executed.');
      res.send(rows);
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }else{
      console.log('Close the database connection.');
    }
  });
});
