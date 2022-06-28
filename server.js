/*Table of Content
# connect to MySql DB
# handle get reqst to the root
# handle get request from /fiverr/angular
*/

const express = require("express");
const app = express();

let mysql = require("mysql");
let hostname = "0.0.0.0"

//connect MySql DB
let con = mysql.createConnection({
  host: hostname,
  user: "root",
  password: "faisel330$$$",
  database: "analytics_db",
});
var db;
var table_ = "test"; //production
con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
  db = con;

  //fire ready event
  app.emit("ready");
});

const keywords = [
  "angular",
  "elementor",
  "elementor_any",
  "instagram",
  "linkedin",
  "twitter",
  "portfolio",
  "dribble",
];
const gig_urls = {
  "angular":"https://www.fiverr.com/share/pBo8Pp",
  "elementor":"https://www.fiverr.com/share/261vk4",
  "elmentor_any":"https://www.fiverr.com/share/W0Dw8B"
}



// get all data
app.get("/arafat330", (req, res) => {
  showDB(table_,res);
});

//handle request from insta
app.get("/:media_name/:gig_name", (req, res) => {
  //insta-fiverr-angular
  let gig_name = req.params.gig_name,
    media_name = req.params.media_name,
    url = gig_urls[req.params.gig_name];
 
handleDB(table_, gig_name, media_name,url, res);
});
//handle request from linkedin

//handle db handles all database calls and return response
function handleDB(table_name, gig_name, media_name,url, res) {
  //return error request
  if (checkData(gig_name) && checkData(media_name)) {
    let column = "clicks_" + media_name;
    let sql = `UPDATE ${table_name} SET ${column} = ${column}+1 where gig_name = "fiverr_${gig_name}"`;

    db.query(sql, function (err, result) {
      if (err) {
        sendError(res);
        throw err;
      }

      console.log("db updated");
      // res.send(`${JSON.stringify(result)}`);
      res.redirect(url);
    });
  } else sendError(res);
}


//show data
function showDB(table_name,res){
  let sql = `SELECT * FROM ${table_name}`;
  db.query(sql, function (err, result) {
    if (err) {
      sendError(res);
      throw err;
    }

    console.log("db ACCESED");
    res.send(`${JSON.stringify(result)}`);
   
  });
  
}


//check request
function checkData(data) {
  var result = false;
  keywords.forEach((keyword) => {
    if (keyword == data) {
      result = true;
    }
  });
  return result;
}
//send Error
function sendError(res) {
  res.send("there is an error");
}
//wait for ready function to emit
app.on("ready", function () {
  app.listen(3000,hostname, function () {
    console.log("app is ready and listening");
  });
});
