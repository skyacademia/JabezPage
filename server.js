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
    db.all('SELECT m.id, m.MemberYoutubeTitle, m.MemberYoutubeLink, m.MemberYoutubeThumbnailLink, m.ContentSectionNum, cs.contentSectionName as ContentSectionName FROM Member_Information_tbl as m INNER JOIN contentSection_Information_tbl as cs on m.ContentSectionNum = cs.id ORDER BY m.ID LIMIT 16', (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        const rowData = rows;
        db.all('SELECT * FROM contentSection_Information_tbl', (err, rows) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log('Query successfully executed.');
            const contentSectionData = rows;
            res.render('./admin/adminManageContent.ejs', { data: rowData, contentSectionData: contentSectionData });
            console.log("page rendering success.");
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
  }
  else {
    res.redirect('/admin/login');
  }
});

app.get('/admin/manageContentSection', (req, res) => {
  if (req.session.isLogin != true) {
    res.redirect('/admin/login');
  }

  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져온 뒤 adminIndex.ejs에 담아 전송
  db.all('SELECT * FROM contentSection_Information_tbl', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Query successfully executed.');
      res.render('./admin/adminManageContentSection.ejs', { data: rows });
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
});

// 계정 관리를 클릭하면 adminManageACcount.ejs을 render
app.get('/admin/manageAccount', (req, res) => {
  if (req.session.isLogin) {
    res.render('./admin/adminManageAccount.ejs', { result: false });
  } else {
    res.redirect('/admin/login');
  }
});

// API 요청 시 컨텐츠 페이지를 관리하는 contentSection 정보를 가져옴
app.get('/api/section/get', (req, res) => {
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT * FROM contentSection_Information_tbl`, (err, rows) => {
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

// API 요청 시 컨텐츠 페이지를 관리하는 contentSection 정보를 추가
app.post('/api/section/create', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  const sectionName = req.body.sectionName;
  const sectionColor = req.body.sectionColor;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에 데이터를 추가
  const sqlQuery = `INSERT INTO contentSection_Information_tbl (contentSectionName,contentSectionColor) VALUES (?,?)`;
  db.run(sqlQuery, [sectionName, sectionColor], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에 추가되면 manageContent 페이지로 이동
      console.log('Query successfully executed. 컨텐츠 페이지 추가 성공');
      res.redirect('/admin/manageContentSection');
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

app.post('/api/section/update', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  const contentSectionName = req.body.contentSectionName;
  const contentSectionColor = req.body.contentSectionColor;
  const contentSectionId = req.body.contentSectionId;
  const contentSectionIdArray = [];
  const contentSectionNameArray = [];
  const contentSectionColorArray = [];
  if (typeof contentSectionId === 'string') {
    contentSectionIdArray.push(contentSectionId);
    contentSectionNameArray.push(contentSectionName);
    contentSectionColorArray.push(contentSectionColor);
  }
  else {
    contentSectionIdArray.push(...contentSectionId);
    contentSectionNameArray.push(...contentSectionName);
    contentSectionColorArray.push(...contentSectionColor);
  }
  const inputInfo = [];

  contentSectionIdArray.forEach((id, index) => {
    inputInfo.push({ id: id, contentSectionName: contentSectionNameArray[index], contentSectionColor: contentSectionColorArray[index] });
  });
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에 데이터를 추가
  const caseClauses = inputInfo.map(pair => `WHEN id = ${pair.id} THEN '${pair.contentSectionName}'`).join(' ');
  const caseClauses2 = inputInfo.map(pair => `WHEN id = ${pair.id} THEN '${pair.contentSectionColor}'`).join(' ');
  const sqlQuery = `UPDATE contentSection_Information_tbl SET contentSectionName = CASE ${caseClauses} END, contentSectionColor = CASE ${caseClauses2} END WHERE id IN (${contentSectionIdArray.join(', ')})`;
  db.run(sqlQuery, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에 추가되면 manageContent 페이지로 이동
      console.log('Query successfully executed. 컨텐츠 페이지 정보 수정 성공');
      res.redirect('/admin/manageContentSection');
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

app.post('/api/section/delete', (req, res) => {
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
  const placeholders = typeof checkboxes != "string" ? checkboxes.map((checkbox) => '?').join(',') : "?";
  const sqlQuery = `DELETE FROM contentSection_Information_tbl WHERE ID IN (${placeholders})`;
  db.run(sqlQuery, checkboxes, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에서 삭제되면 manageContent 페이지로 이동
      console.log('Query successfully executed.');
      console.log('Delete success : ', checkboxes);
      res.redirect('/admin/manageContentSection');
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

// api/content/get/:contentSectionNum 요청이 들어오면 db에서 contentSectionNum에 해당하는 데이터를 조회한 뒤 첫번째 데이터를 전송
app.get('/api/content/get/SectionNum/:sectionId', (req, res) => {
  const contentSectionNum = req.params.sectionId;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT * FROM Member_Information_tbl WHERE ContentSectionNum = ? ORDER BY ID LIMIT 1`, contentSectionNum, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('rows : ', rows);
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

app.get('/api/content/get/section/:contentSectionId', (req, res) => {
  const contentSectionId = req.params.contentSectionId;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database. : ', `api/content/get/section/{contentSectionId}`);
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT m.id, m.MemberYoutubeTitle, m.MemberYoutubeLink, m.MemberYoutubeThumbnailLink, m.ContentSectionNum, cs.contentSectionName AS ContentSectionName FROM Member_Information_tbl as m INNER JOIN contentSection_Information_tbl as cs on m.ContentSectionNum = cs.id where m.ContentSectionNum=? LIMIT 16`, contentSectionId, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('rows : ', rows);
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
// sectionId와 id, count를 받아서 sectionId에 해당하는 데이터 중 id보다 큰 데이터를 최대 count만큼 가져옴
app.get('/api/content/get/section/:contentSectionId/:id/:count', (req, res) => {
  const contentSectionId = req.params.contentSectionId;
  const id = req.params.id;
  const count = req.params.count;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT m.id, m.MemberYoutubeTitle, m.MemberYoutubeLink, m.MemberYoutubeThumbnailLink, m.ContentSectionNum, cs.contentSectionName as ContentSectionName FROM Member_Information_tbl as m INNER JOIN contentSection_Information_tbl as cs on m.ContentSectionNum = cs.id WHERE m.ROWID>? AND m.ContentSectionNum=? ORDER BY m.ROWID LIMIT ?`,
    [id, contentSectionId, count], (err, rows) => {
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
app.get('/api/content/get/:id/:count', (req, res) => {
  const id = req.params.id;
  const count = req.params.count;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 가져옴
  db.all(`SELECT m.id, m.MemberYoutubeTitle, m.MemberYoutubeLink, m.MemberYoutubeThumbnailLink, m.ContentSectionNum, cs.contentSectionName as ContentSectionName FROM Member_Information_tbl as m INNER JOIN contentSection_Information_tbl as cs on m.ContentSectionNum = cs.id WHERE m.ROWID > ? ORDER BY m.ROWID LIMIT ?;`, [id, count], (err, rows) => {
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
  const contentSectionNum = req.body.contentSectionName;
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
  const sqlQuery = `INSERT INTO Member_Information_tbl (MemberYoutubeTitle, MemberYoutubeLink, MemberYoutubeThumbnailLink, ContentSectionNum) VALUES (?,?,?,?)`;
  db.run(sqlQuery, [youtubeTitle, embedUrl, thumbnailUrl, contentSectionNum], (err) => {
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

// client가 '/api/content/update'으로 post 요청하면 sqplite3로 연결한 뒤 데이터베이스에서 데이터를 수정
app.post('/api/content/update', (req, res) => {
  if (req.session.isLogin != true) {
    console.log("로그인이 되어있지 않습니다.");
    res.redirect('/admin/login');
  }
  const contentSectionNums = req.body.contentSectionNum;
  const ids = Array.isArray(req.body.idToUpdate) ? req.body.idToUpdate : [req.body.idToUpdate];
  const inputInfo = [];
  ids.forEach((id, index) => {
    inputInfo.push({ id: id, contentSectionNum: contentSectionNums[index] });
  });
  // id을 key, contentSectionNum을 value로 하는 객체를 만듦
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 데이터를 수정
  const caseClauses = inputInfo.map(pair => `WHEN id = ${pair.id} THEN ${pair.contentSectionNum}`).join(' ');
  const sqlQuery = `UPDATE Member_Information_tbl SET ContentSectionNum = CASE ${caseClauses} END WHERE id IN (${ids.join(', ')})`;
  db.run(sqlQuery, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에 수정되면 manageContent 페이지로 이동
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
  const placeholders = typeof checkboxes != "string" ? checkboxes.map((checkbox) => '?').join(',') : "?";
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

app.get('/api/reservation/get/:year/:month', (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const yearMonthString = year + '-' + month + '%';
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  }
  );
  // 데이터베이스에서 데이터를 가져온 뒤 데이터를 전송
  db.all('SELECT * FROM reservation_Information_tbl WHERE startDateTime LIKE ? ORDER BY startDateTime ASC', yearMonthString, (err, rows) => {
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
  }
  );
});

app.post('/api/reservation/create', (req, res) => {
  const reservationDate = req.body.reservationDate;
  const activity = req.body.activity;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const name = req.body.reservationPerson;
  const password = req.body.password;

  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });

  const sqlSelectQuery = `SELECT * FROM reservation_Information_tbl WHERE startDateTime LIKE ?`;
  db.all(sqlSelectQuery, `${reservationDate}%`, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      if (rows.length > 0) {
        const newStartTime = startTime.split(':')[0];
        const newEndTime = endTime.split(':')[0];

        rows.forEach((row) => {
          const startTime = row.startDateTime.split(' ')[1].split(':')[0];
          const endTime = row.endDateTime.split(' ')[1].split(':')[0];

          // 예약 시작 시간이 이미 예약된 시간과 겹치는지 확인
          if (newStartTime >= startTime && newStartTime < endTime) {
            console.log('예약 시작 시간이 이미 예약된 시간과 겹칩니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
          // 예약 종료 시간이 이미 예약된 시간과 겹치는지 확인
          if (newEndTime > startTime && newEndTime <= endTime) {
            console.log('예약 종료 시간이 이미 예약된 시간과 겹칩니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
          // 예약 시작 시간과 종료 시간이 이미 예약된 시간을 포함하는지 확인
          if (newStartTime < startTime && newEndTime >= endTime) {
            console.log('예약 시간이 이미 예약된 시간을 포함합니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
        });
      }

      // 데이터베이스에 데이터를 추가
      const formattedStartDateTime = reservationDate + " " + startTime + ':00';
      const formattedEndDateTime = reservationDate + " " + endTime + ':00';
      const encryptedPasswordAndSalt = encryptPassword(password);
      const encryptedPassword = encryptedPasswordAndSalt[0];
      const salt = encryptedPasswordAndSalt[1];

      const sqlInsertQuery = `INSERT INTO reservation_Information_tbl (activity, startDateTime, endDateTime, reservationPerson, password, salt) VALUES (?,?,?,?,?,?)`;
      db.run(sqlInsertQuery, [activity, formattedStartDateTime, formattedEndDateTime, name, encryptedPassword, salt], (err) => {
        if (err) {
          console.error(err.message);
        } else {
          // 데이터베이스에 추가되면 성공 메시지 전송
          console.log('Query successfully executed.');
          res.send({ success: true });
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
  }
  );
});

app.post('/api/reservation/auth', (req, res) => {
  const id = req.body.reservationId;
  const password = req.body.password;
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 id와 password가 일치하는 데이터가 있는지 확인하고 있으면 true, 없으면 false 전송
  const sqlQuery = `SELECT * FROM reservation_Information_tbl WHERE id = ?`;
  db.all(sqlQuery, id, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      if (rows.length > 0) {
        const salt = rows[0].salt;
        const encryptedPassword = encryptPassword(password, salt)[0];
        const dbPassword = rows[0].password;
        if (encryptedPassword === dbPassword) {
          req.session.reservationAuth = true;
          req.session.save();
          res.send({ success: true });
        } else {
          res.send({ success: false });
        }
      } else {
        res.send({ success: false });
      }
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

app.post('/api/reservation/delete', (req, res) => {
  const id = req.body.reservationId;
  // 예약 수정 또는 삭제를 위한 인증이 되어있지 않은 경우
  if (req.session.reservationAuth !== undefined && req.session.reservationAuth !== true) {
    console.log("예약 삭제를 위한 인증이 되어있지 않습니다.");
    return res.send({ success: false });
  }
  // 로그인이 되어있지 않은 경우
  else if (req.session.isLogin !== undefined && req.session.isLogin !== true) {
    console.log("로그인이 되어있지 않습니다.");
    return res.redirect('/admin/login');
  }
  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  // 데이터베이스에서 id로 조회한 뒤, 비밀번호가 일치한지 확인하고 같으면 데이터를 삭제
  db.run(`DELETE FROM reservation_Information_tbl WHERE id = ?`, id, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // 데이터베이스에서 삭제되면 성공 메시지 전송
      console.log('Query successfully executed.');
      res.send({ success: true });
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

app.post('/api/reservation/update', (req, res) => {
  const id = req.body.reservationId;
  const activity = req.body.activity;
  const reservationDate = req.body.reservationDate;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const name = req.body.reservationPerson;
  const password = req.body.password;

  // 예약 수정 또는 삭제를 위한 인증이 되어있지 않은 경우
  if (req.session.reservationAuth !== undefined && req.session.reservationAuth !== true) {
    console.log("예약 수정을 위한 인증이 되어있지 않습니다.");
    return res.send({ success: false });
  }
  // 로그인이 되어있지 않은 경우
  else if (req.session.isLogin !== undefined && req.session.isLogin !== true) {
    console.log("로그인이 되어있지 않습니다.");
    return res.redirect('/admin/login');
  }

  let db = new sqlite3.Database('./database/Jabez_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  }
  );

  const query = `SELECT * FROM reservation_Information_tbl WHERE startDateTime LIKE ?`;
  db.all(query, `${reservationDate}%`, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      if (rows.length > 0) {
        console.log('rows : ', rows);
        const newStartTime = startTime.split(':')[0];
        const newEndTime = endTime.split(':')[0];
        const filteredRows = rows.filter((row) => parseInt(row.id) !== parseInt(id));
        console.log('filteredRows : ', filteredRows);
        filteredRows.forEach((row) => {
          const startTime = row.startDateTime.split(' ')[1].split(':')[0];
          const endTime = row.endDateTime.split(' ')[1].split(':')[0];

          // 예약 시작 시간이 이미 예약된 시간과 겹치는지 확인
          if (newStartTime >= startTime && newStartTime < endTime) {
            console.log('예약 시작 시간이 이미 예약된 시간과 겹칩니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
          // 예약 종료 시간이 이미 예약된 시간과 겹치는지 확인
          if (newEndTime > startTime && newEndTime <= endTime) {
            console.log('예약 종료 시간이 이미 예약된 시간과 겹칩니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
          // 예약 시작 시간과 종료 시간이 이미 예약된 시간을 포함하는지 확인
          if (newStartTime < startTime && newEndTime >= endTime) {
            console.log('예약 시간이 이미 예약된 시간을 포함합니다.');
            res.send({ success: false, message: '이미 예약된 시간입니다.' });
          }
        });

        // 수정한 시간이 겹치지 않으면 데이터베이스에서 id로 조회한 뒤, 비밀번호가 일치한지 확인 후 데이터 수정
        const sqlQuery = `SELECT * FROM reservation_Information_tbl WHERE id = ?`;
        db.all(sqlQuery, id, (err, rows) => {
          if (err) {
            console.error(err.message);
          } else {
            if (rows.length > 0) {
              const dbPassword = rows[0].password;
              const dbSalt = rows[0].salt;
              const formattedStartDateTime = reservationDate + " " + startTime + ':00';
              const formattedEndDateTime = reservationDate + " " + endTime + ':00';

              // undefined가 아니면 비밀번호를 변경하고, undefined면 비밀번호를 변경하지 않음
              if (encryptPassword(password, dbSalt)[0] === dbPassword) {
                db.run(`UPDATE reservation_Information_tbl SET activity = ?, startDateTime = ?, endDateTime = ?, reservationPerson = ? WHERE id = ?`,
                  [activity, formattedStartDateTime, formattedEndDateTime, name, id], (err) => {
                    if (err) {
                      console.error(err.message);
                    } else {
                      // 데이터베이스에 수정되면 성공 메시지 전송
                      console.log('Query successfully executed.');
                      res.send({ success: true });
                    }
                  });
              } else {
                const encryptedPasswordAndSalt = encryptPassword(password);
                const encryptedPassword = encryptedPasswordAndSalt[0];
                const newSalt = encryptedPasswordAndSalt[1];
                db.run(`UPDATE reservation_Information_tbl SET activity = ?, startDateTime = ?, endDateTime = ?, reservationPerson = ?, password=?, salt=? WHERE id = ?`,
                  [activity, formattedStartDateTime, formattedEndDateTime, name, encryptedPassword, newSalt, id], (err) => {
                    if (err) {
                      console.error(err.message);
                    } else {
                      // 데이터베이스에 수정되면 성공 메시지 전송
                      console.log('Query successfully executed.');
                      res.send({ success: true });
                    }
                  });
              }
            } else {
              res.send({ success: false });
            }
          }
        });
      }
    }
  });


  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  }
  );
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
      let todayVisits = 0;
      if (rows.length > 0) {
        todayVisits = rows[0].count;
      }
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
