const express = require("express");
// const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// let http = require("http");
const app = express();
// let server = http.createServer(app);

const sqlite3 = require("sqlite3").verbose();
// const url = require("url");
// let sql;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "./public")));

//connect to database
const db = new sqlite3.Database(__dirname + "/database.sqlite");
// const db = new sqlite3.Database(
//   "./family.db",
//   sqlite3.OPEN_READWRITE,
//   (err) => {
//     if (err) return console.log(err.message);
//   }
// );

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./public/form.html"));
// });
const tablename = "family";

// Create a table
const CREATE_FAMILY_TABLE = `CREATE TABLE if not exists ${tablename} (ID INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, age INT, city TEXT)`;
const DROP_TABLE = `DROP TABLE if exists ${tablename}`;

app.get("/", (req, res) => {
  db.run(CREATE_FAMILY_TABLE);
  db.run(
    `INSERT INTO ${tablename} (firstname, lastname, age, city) VALUES ('Ronny',  'Olsen', 44, 'Kragerø');`
  );
  db.run(
    `INSERT INTO ${tablename} (firstname, lastname, age, city) VALUES ('Jonas',  'Andreassen', 27, 'Skien');`
  );
  db.run(
    `INSERT INTO ${tablename} (firstname, lastname, age, city) VALUES ('Luna',  'Langeland', 20, 'Oslo');`
  );
  db.run(
    `INSERT INTO ${tablename} (firstname, lastname, age, city) VALUES ('Lita',  'Langeland', 17, 'Kragerø');`
  );

  res.send("Family Table created successfully");
});

app.get("/drop", (req, res) => {
  db.run(DROP_TABLE);
  res.send("Table dropped");
});

//use postman GET
app.get("/show", (req, res) => {
  console.log(req.body);

  // let firstName = req.body.firstName;
  let data = [];
  db.serialize(() => {
    db.each(
      `SELECT * FROM ${tablename}`,
      (err, row) => {
        // console.log(row.firstname);
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

//use postman POST
app.post("/family", (req, res) => {
  console.log(req.body);

  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let personAge = req.body.age;
  let personCity = req.body.city;

  db.run(
    "INSERT INTO family (firstname, lastname, age, city) VALUES ('" +
      firstName +
      "',  '" +
      lastName +
      "',  '" +
      personAge +
      "',  '" +
      personCity +
      "')"
  );
  res.send("Saved");
});

//use postman PUT
app.put("/update", (req, res) => {
  console.log(req.body);

  db.serialize(() => {
    db.run(
      `UPDATE ${tablename} SET city = ? WHERE ID = ?`,
      [req.body.city, req.body.ID],
      () => {
        res.send("saved");
      }
    );
  });
});

//use postman DELETE
app.put("/delete", (req, res) => {
  console.log(req.body);

  db.serialize(() => {
    db.run(`DELETE FROM ${tablename} WHERE ID = ?`, [req.body.ID], () => {
      res.send("saved");
    });
  });
});

// delete data
// sql = "DELETE FROM family WHERE id = ?;";
// db.run(sql, [5], (err) => {
//   if (err) return console.log(err.message);
// });

// app.listen(3000);

app.listen(3000, function () {
  console.log("server is listening on port: 3000");
});
