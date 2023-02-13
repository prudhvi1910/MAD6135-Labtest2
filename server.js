const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to the database
const db = new sqlite3.Database("labtest.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

// HTML form
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Warehouse Management</title>
  <style>
      body {
        background-color: #fffbe6;
      }
      h1 {
          color: #495726;
          margin-top: 50px;
          text-align: center;
      }
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
      }

      input[type="text"] {
        width: 200px;
        height: 25px;
        font-size: 15px;
        text-align: center;
        margin-bottom: 20px;
        border-color: #7f9644; 
      }

      button[type="submit"] {
        width: 150px;
        height: 25px;
        font-size: 15px;
        background-color: #495726;
        border-width: 1px;
        border-radius: 4px;
        border-color: #7f9644;
        color: white;
      }
    </style>
  </head>
  <body>
    <h1>Warehouse Management</h1>
    <form action="/search" method="post">
    <input type="text" name="partNumber" placeholder="Enter Part Number">
    <button type="submit">Search</button>
    </form>
  </body>
</html>
  `);
});

// Handling the form
app.post("/search", (req, res) => {
  const partNumber = req.body.partNumber;
  const query = `
    SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
    FROM PartNumber
    JOIN Bin ON PartNumber.BinID = Bin.BinID
    JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
    WHERE PartNumber.PartNumber = ?
  `;
  db.get(query, [partNumber], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.send(`
      <html>
      <head>
        <title>Warehouse Management</title>
      <style>
        body {
          background-color: #fffbe6;
        }
        #result {
          text-align: center;
          font-weight: bold;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #495726;
          font-family: verdana;
        }
      </style>
      </head>
      <body>
        <p>Results for the requested part number</p>
        <div id="result">
          <p>Shelf Number: ${row.ShelfLocation},
          Bin Number: ${row.BinID},
          Count: ${row["COUNT(PartNumber.PartNumberID)"]}</p>
        </div>
      </body>
      </html>
    `);
  });
});

// Running the server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
