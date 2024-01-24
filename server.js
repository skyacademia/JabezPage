const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
let isLogin = false;
app.use(morgan('combined'));

// body-parser를 사용하기 위한 코드
app.use(bodyParser.urlencoded({extended: false}));

// 서버를 80 포트로 실행
app.listen(8080, () => {
  console.log('server running on port 8080');
});

// client가 '/'으로 접속하면 index.html을 전송
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// client가 '/admin'으로 접속하면 admin.html을 전송
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/adminSignIn.html');
});
// client가 ID, PW를 입력하고 '/admin/login'으로 요청하면 계정이 존재하는지 확인
app.post('/admin/login', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      isLogin = false;
      console.error(err.message);
    }else{
      console.log('Connected to the database.');
    } 
  });
  // 데이터베이스에서 id와 password가 일치하는 데이터가 있는지 확인하고 있으면 main 페이지로 이동, 없으면 다시 로그인 페이지로 이동
  const sqlQuery = `SELECT * FROM Account_Information_tbl WHERE id = '${id}' AND password = '${password}'`;
  db.all(sqlQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
    }else{
      console.log('Query successfully executed.');
      if(rows.length > 0){
        isLogin = true;
        res.redirect('/admin/main');
      }else{
        isLogin = false;
        res.redirect('/admin');
      }
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

// client가 '/admin/main'으로 접속 요청 시 로그인이 되어있는지 확인 후 로그인이 되어있으면 adminIndex.html을 전송, 로그인이 되어있지 않으면 adminSignIn.html을 전송
app.get('/admin/main', (req, res) => {
  // 로그인이 되어있는지 확인하는 코드
  if(isLogin){
    res.sendFile(__dirname + '/adminIndex.html');
  }else{
    res.sendFile(__dirname + '/adminSignIn.html');
  }
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
