const express = require("express");
const app = express();

const sqlite3 = require("sqlite3").verbose();
const datenbankName = __dirname + "./data/contact.db";

const datenbank = new sqlite3.Database(datenbankName, function (error) {
  if (error) {
    return console.error(error.message);
  }
  console.log(datenbankName + " is conected");
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/view");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

//rout for / and GET
app.get("/", function (request, response) {
  //sql request
  //ANCHOR sort by first name
  let sql = "SELECT * FROM contact ORDER BY Vorname ASC";
  datenbank.all(sql, [], function (error, rows) {
    if (error) {
      return console.error(error.message);
    }
    response.render("list", { data: rows });
  });
});

const server = app.listen(8080, function () {
  console.log(
    "Der Server läuft auf " +
      server.address().address +
      ":" +
      server.address().port
  );
});

//rout for /newContact and GET
app.get("/newContact", function (request, response) {
  response.render("newContact");
});

//rout for /newContact and POST
app.post("/newContact", function (request, response) {
  let sql =
    "INSERT INTO contact (Vorname, Nachname, PLZ, Stadt, Straße) VALUES (?,?,?,?,?)";
  let contact = [
    request.body.Vorname,
    request.body.Nachname,
    request.body.PLZ,
    request.body.Stadt,
    request.body.Straße,
  ];
  datenbank.run(sql, contact, function (error) {
    if (error) {
      return console.error(error.message);
    }
    response.redirect("/");
  });
});

//rout for /editContact and Get
app.get("/editContact/:id", function (request, response) {
  let id = request.params.id;
  let sql = "SELECT * FROM contact WHERE id = ?";
  datenbank.get(sql, id, function (error, row) {
    if (error) {
      return console.error(error.message);
    }
    response.render("editContact", { data: row });
  });
});

//rout for /editContact and POST
app.post("/editContact/:id", function (request, response) {
  let id = request.params.id;
  let sql =
    "UPDATE contact SET Vorname = ?, Nachname = ?, PLZ = ?, Stadt = ?, Straße = ? WHERE (id = ?)";
  let contact = [
    request.body.Vorname,
    request.body.Nachname,
    request.body.PLZ,
    request.body.Stadt,
    request.body.Straße,
    id,
  ];
  datenbank.run(sql, contact, function (error) {
    if (error) {
      return console.error(error.message);
    }
    response.redirect("/");
  });
});

//rout for delete and GET
app.get("/delete/:id", function (request, response) {
  let id = request.params.id;
  let sql = "DELETE FROM contact WHERE id = ?";
  datenbank.run(sql, id, function (error) {
    if (error) {
      return console.error(error.message);
    }
    response.redirect("/");
  });
});
