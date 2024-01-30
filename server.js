const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const e = require('express');
const crypto = require('crypto');
const app = express();
const sqliteStoreFactory = require('express-session-sqlite').default;
const SQLiteStore = sqliteStoreFactory(session);

// app.use(morgan('combined'));

// body-parser를 사용하기 위한 코드
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// view engine을 ejs로 설정
app.set('view engine', 'ejs');
// session을 사용하기 위한 코드
app.use(session({
  store: new SQLiteStore(
    {
      // Database library to use. Any library is fine as long as the API is compatible
      // with sqlite3, such as sqlite3-offline
      driver: sqlite3.Database,
      // for in-memory database
      // path: ':memory:'
      path: './database/Jabez_database.db',
      // Session TTL in milliseconds
      ttl: 3600000, // 1 hour
      // Session table name
      table: 'sessions',
    }
  ),
  secret: 'yavesGroupSessionSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // 1 hour
    secure: false,
    httpOnly: true,
  }
}));

// public 폴더를 static 폴더로 지정
app.use(express.static('public'));

// 서버를 8080 포트로 실행
app.listen(8080, () => {
  console.log('server running on port 8080');
});

// 해시함수를 이용해 비밀번호를 암호화하는 함수(sha512, salt, pbkdf2 사용)
function encryptPassword(password, salt = null, iterations = 1111) {
  let _salt = salt;
  if (_salt === null) {
    // Generate a random salt
    _salt = crypto.randomBytes(16);
  }

  const keylen = 64;  // The length of the generated key in bytes
  const digest = 'sha512';  // The HMAC digest algorithm to use

  // Generate a derived key from the password, salt, and iterations
  const derivedKey = crypto.pbkdf2Sync(password, _salt, iterations, keylen, digest);

  // Convert the derived key to a hexadecimal string
  const hashedPassword = derivedKey.toString('hex');

  return [hashedPassword, _salt];
}

// client가 '/'으로 접속하면 index.html을 전송, 사용자가 처음 방문한 경우, 방문자 수를 증가시킴
app.get('/', (req, res) => {
  // 방문한 적이 있는지 확인하는 코드
  if (req.session.isVisited) {
    console.log('visited');
    res.sendFile(__dirname + '/index.html');
  } else {
    // 방문한 적이 없으면 방문자 수를 증가시키는 코드
    let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
      }
    });
    // 방문자 수를 증가시키는 코드
    const currentDate = new Date(); // 현재 날짜(한국 표준시)를 가져옴
    const date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    db.run("INSERT INTO visits_statistics_daily_tbl (date, count) VALUES (?, 1) ON CONFLICT(date) DO UPDATE SET count = count + 1", date, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        // 데이터베이스의 방문자 수가 증가되면 session을 생성하고 index.html을 전송
        console.log('Query successfully executed.');
        req.session.isVisited = true;
        req.session.save();
        res.sendFile(__dirname + '/index.html');
      }
    });
    // 데이터베이스 연결 종료
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Close the database connection.');
      }
    });
  }
});

// client가 '/admin'으로 접속하면 admin.html을 전송
app.get('/admin', (req, res) => {
  if (req.session.isLogin) {
    res.redirect('/admin/main');
  } else {
    res.redirect('/admin/login');
  }
});

// client가 '/admin/main'으로 접속 요청 시 로그인이 되어있는지 확인 후 로그인이 되어있으면 db에서 최대 15개의 데이터를 조회한 뒤 그 데이터를 adminIndex.ejs에 담아 전송, 로그인이 되어있지 않으면 adminSignIn.html을 전송
app.get('/admin/main', (req, res) => {
  // 로그인이 되어있는지 확인하는 코드
  if (req.session.isLogin) {
    let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
      }
    });
    // 데이터베이스에서 데이터를 가져온 뒤 adminIndex.ejs에 담아 전송
    db.all('SELECT * FROM Member_Information_tbl ORDER BY ID LIMIT 16', (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Query successfully executed.');
        res.render('./admin/adminIndex.ejs', { data: rows });
        console.log("page rendering success.");
      }
    });
    // 데이터베이스 연결 종료
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Close the database connection.');
      }
    });

  } else {
    res.redirect('/admin/login');
  }
});

app.get('/admin/login', (req, res) => {
  res.sendFile(__dirname + '/adminSignIn.html');
});

// client가 '/admin/manageContent'로 접속하면 manageContent.html을 전송
app.get('/admin/manageContent', (req, res) => {
  if (req.session.isLogin) {
    let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
      }
    });
    // 데이터베이스에서 데이터를 가져온 뒤 adminIndex.ejs에 담아 전송
    db.all('SELECT * FROM Member_Information_tbl ORDER BY ID LIMIT 16', (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Query successfully executed.');
        res.render('./admin/adminManageContent.ejs', { data: rows });
        console.log("page rendering success.");
      }
    });
    // 데이터베이스 연결 종료
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Close the database connection.');
      }
    });
  }
  else {
    res.redirect('/admin/login');
  }
});

// 계정 관리를 클릭하면 adminManageACcount.ejs을 render
app.get('/admin/manageAccount', (req, res) => {
  if (req.session.isLogin) {
    res.render('./admin/adminManageAccount.ejs', { result: false });
  } else {
    res.redirect('/admin/login');
  }
});


// api/content/get/:id 요청이 들어오면 db에서 id부터 시작해서 최대 8개의 데이터를 가져와서 전송
app.get('/api/content/get/:id', (req, res) => {
  const id = req.params.id;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT * FROM Member_Information_tbl WHERE ID > ? ORDER BY ID LIMIT 8`, id, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      res.send(rows);
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});


// client가 '/api/memberData/:id'로 접속하면 sqplite3로 연결한 뒤 데이터베이스에서 데이터를 가져와서 전송
app.get('/api/memberData/:id', (req, res) => {
  const id = req.params.id;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT * FROM Member_Information_tbl WHERE ROWID > ? ORDER BY ROWID LIMIT 1`, id, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      res.send(rows);
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});

// client가'/api/content/create'으로 post 요청하면 sqplite3로 연결한 뒤 데이터베이스에 데이터를 추가
app.post('/api/content/create', (req, res) => {
  const source = req.body.youtubeSource;
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }

  // source에서 src 속성과 title 속성을 추출
  const srcUrl = source.split('src="')[1]; // src=" 뒤의 문자열을 추출
  const embedUrl = srcUrl.split('"')[0]; // " 앞의 문자열을 추출, src 속성의 값이 추출됨

  const title = source.split('title="')[1]; // title=" 뒤의 문자열을 추출
  const youtubeTitle = title.split('"')[0]; // " 앞의 문자열을 추출, title 속성의 값이 추출됨

  // embedUrl을 이용해 https://img.youtube.com/vi/HbuAOcKc3YY/maxresdefault.jpg 형식의 url을 만듦
  const thumbnailUrl = `https://img.youtube.com/vi/${embedUrl.split('/')[4]}/maxresdefault.jpg`; // embedUrl에서 / 뒤의 문자열을 추출, video id가 추출됨
  // 데이터베이스에 데이터를 추가
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // youtubeTitle, embedUrl, thumbnailUrl 데이터를 Member_Information_tbl에 추가
  const sqlQuery = `INSERT INTO Member_Information_tbl (MemberYoutubeTitle, MemberYoutubeLink, MemberYoutubeThumbnailLink) VALUES (?,?,?)`;
  db.run(sqlQuery, [youtubeTitle, embedUrl, thumbnailUrl], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에 추가되면 manageContent 페이지로 이동
      console.log('Query successfully executed.');
      res.redirect('/admin/manageContent');
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});

// client가 '/api/content/delete'으로 post 요청하면 sqplite3로 연결한 뒤 데이터베이스에서 데이터를 삭제
app.post('/api/content/delete', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  // 이벤트가 발생한 폼 내부의 모든 체크박스에서 value 값을 가져옴
  const checkboxes = req.body.idToDelete;
  // 데이터베이스에 데이터를 삭제
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // checkboxes에 담긴 id 값을 가진 데이터를 삭제
  const placeholders = checkboxes.map((checkbox) => '?').join(',')
  const sqlQuery = `DELETE FROM Member_Information_tbl WHERE ID IN (${placeholders})`;
  db.run(sqlQuery, checkboxes, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에서 삭제되면 manageContent 페이지로 이동
      console.log('Query successfully executed.');
      console.log('Delete success : ', checkboxes);
      res.redirect('/admin/manageContent');
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});



// client가 ID, PW를 입력하고 '/api/loginAuth'으로 요청하면 계정이 존재하는지 확인
app.post('/api/loginAuth', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      req.session.isLogin = false;
      req.session.save();
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 id와 password가 일치하는 데이터가 있는지 확인하고 있으면 main 페이지로 이동, 없으면 다시 로그인 페이지로 이동
  console.log('loginAuth process start.')
  const sqlQuery = `SELECT * FROM Account_Information_tbl WHERE id = ?`;
  db.all(sqlQuery, id, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      if (rows.length > 0) {
        // 입력한 비밀번호와 조회한 salt를 비교해서 암호화된 비밀번호가 조회한 password와 같으면 로그인 성공
        const salt = rows[0].salt;
        console.log("encryp process start.")
        const encryptedPassword = encryptPassword(password, salt)[0];
        console.log("encryp process end.")
        const dbPassword = rows[0].password;
        if (encryptedPassword === dbPassword) {
          req.session.isLogin = true;
          req.session.save();
          console.log('login success.');
          console.log('loginAuth process end.');
          res.redirect('/admin/main');
        } else {
          req.session.isLogin = false;
          req.session.save();
          console.log('login fail. password does not match.');
          console.log('loginAuth process end.');
          res.redirect('/admin');
        }
      } else {
        req.session.isLogin = false;
        req.session.save();
        console.log('login fail. id does not exist.');
        console.log('loginAuth process end.');
        res.redirect('/admin');
      }
    }
  })
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      req.session.isLogin = false;
      req.session.save();
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});

// client가 '/api/account/checkPassword'으로 get 요청하면 sqplite3로 연결한 뒤 데이터베이스에서 페스워드가 일치한지 확인 후 결과 전송
app.post('/api/account/checkPassword', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  const password = req.body.password;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 password가 일치하는 데이터가 있는지 확인하고 있으면 true, 없으면 false 전송
  console.log('checkPassword process start.')
  const sqlQuery = `SELECT * FROM Account_Information_tbl WHERE Id= 'yavesadmin'`;
  db.all(sqlQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      if (rows.length < 0) {
        console.log('admin account check fail. no data.');
        res.send({ success: false });
      }
      // 입력한 비밀번호와 조회한 salt를 이용해서 암호화한 비밀번호가 조회한 password와 같으면 로그인 성공
      const salt = rows[0].salt;
      const encryptedPassword = encryptPassword(password, salt)[0];
      const dbPassword = rows[0].password;
      if (encryptedPassword === dbPassword) {
        console.log('admin account check success.');
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    }
  }
  );
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});



// 계정 확인 요청이 오면 db에서 현재 password를 확인하고 일치하면 새로운 password로 변경
app.post("/api/account/changePW", (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  };
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  let db = new sqlite3.Database("./database/Jabez_database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database.");
    }
  });
  // 데이터베이스에서 password
  console.log("checkPassword process start.");
  const sqlQuery = `SELECT * FROM Account_Information_tbl WHERE Id= 'yavesadmin'`;
  db.all(sqlQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Query successfully executed.");
      if (rows.length < 0) {
        console.log("admin account check fail.");
        res.redirect("/admin/manageAccount");
      }
      const dbSalt = rows[0].salt;
      const encryptedCurrentPassword = encryptPassword(currentPassword, dbSalt)[0];
      const dbPassword = rows[0].password;
      if ((encryptedCurrentPassword === dbPassword) && (newPassword === confirmPassword)) {
        console.log("admin account check success.");
        // newPassword를 암호화해서 해시값과 salt를 추출
        const [encryptedNewPassword, newSalt] = encryptPassword(newPassword);
        const sqlQuery = `UPDATE Account_Information_tbl SET password = ?, salt = ? WHERE password = ? AND Id = 'yavesadmin'`;
        db.run(sqlQuery, [encryptedNewPassword, newSalt, encryptedCurrentPassword], (err) => {
          if (err) {
            console.error(err.message);
          } else {
            // 데이터베이스에서 삭제되면 manageContent 페이지로 이동
            console.log("Query successfully executed.");
            console.log("Password Update success.");
            console.log("checkPassword process end.");
            res.redirect("/admin/manageAccount");
          }
        });
      } else {
        console.log("admin acount check fail. password does not match.");
        console.log("checkPassword process end.");
        res.redirect("/admin/manageAccount");
      }
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Close the database connection.");
    }
  });
});

// logout 요청이 들어오면 session을 삭제하고 로그인 페이지로 이동
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  console.log('logout success.\nsession is deleted.');
  res.redirect('/admin');
});

// 방문자 수 조회 요청이 들어오면 금일 방문자 수와 총 방문자 수를 조회해서 전송
app.get('/api/visit/get', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 금일 방문자 수를 가져옴
  const currentDate = new Date(); // 현재 날짜(한국 표준시)를 가져옴
  const date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
  db.all(`SELECT * FROM visits_statistics_daily_tbl WHERE date = ?`, date, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      const todayVisits = rows[0].count;
      // 총 방문자 수를 가져옴
      db.all('SELECT SUM(count) FROM visits_statistics_daily_tbl', (err, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Query successfully executed.');
          const totalVisits = rows[0]['SUM(count)'];
          res.send({ todayVisits: todayVisits, totalVisits: totalVisits });
        }
      });
    }
  });
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  });
});
