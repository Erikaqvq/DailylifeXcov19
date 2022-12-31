
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.67.153.123',
                user: 'root',
                password:'bunniehappyhere',
                database: 'tutu'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'aaa'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/City', function(req, res) {
  var City = req.body.City;
   
  var sql = ` SELECT * FROM City WHERE City LIKE '%${City}%'`;

console.log(sql);
  connection.query(sql, function(err,result) {
    if (err) {
	res.send(err)
	return;
    }
    res.send(result);
    console.log(result); 
   // res.redirect('/success');
  });
});

// this code is executed when a user clicks the form add button in Vaccination block
app.post('/Vaccination', function(req, res) {
  var get_id = `select count(*) from Vaccination `;
  console.log(get_id);
  connection.query(get_id, function(err,result){
    console.log(result);
    var VacId = req.body.VacId;     // how to add a non-repeated vacid
    var VacName = req.body.VacName;
    var ProductName = req.body.ProductName;
    var Company = req.body.Company;
    var AuDate = req.body.AuDate;
    var StDate = req.body.StDate;
    var Source = req.body.Source;
    var insert_sql = `INSERT INTO Vaccination (VacId, VacName, ProductName, Company, AuDate, StDate, Source) VALUES ( '${VacId}' ,'${VacName}', '${ProductName}','${Company}','${AuDate}','${StDate}','${Source}')`;
    
  console.log(insert_sql);
    connection.query(insert_sql, function(err,result) {
      if (err) {
          res.send(err)
          return;
      }
      res.send(result+ 'Successfully Insert');
      console.log(result); 
     // res.redirect('/success');
    });
  });
});

// this code is executed when a user clicks the form add button in Vaccination block
app.post('/Dailydata', function(req, res) {
  var Data_ID = req.body.Data_ID;    
  var Date = req.body.Date;
  var New_cases = req.body.New_cases;
  var Cum_cases = req.body.Cum_cases;
  var New_deaths = req.body.New_deaths;
  var Cum_deaths = req.body.Cum_deaths;
  var sql = `UPDATE Dailydata SET Date = '${Date}', New_cases = ${New_cases}, Cum_cases = ${Cum_cases},  New_deaths = ${New_deaths}, Cum_deaths = ${Cum_deaths} WHERE Data_ID = ${Data_ID}`;
  
  console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.send(err)
          return;
      }
      res.send(result + 'Successfully Update');
      console.log(result); 
     // res.redirect('/success');
  });
});

app.post('/Article', function(req, res) {
  var ArticleId = req.body.ArticleId;
  console.log(ArticleId);
  var sql = ` DELETE FROM Article WHERE ArticleId =  ${ArticleId}`;
console.log(sql);
  connection.query(sql, function(err,result) {
    if (err) {
    res.send(err)
    return;
    }
    res.send(result + "Successfully Delete");
    console.log(result); 
     // res.redirect('/success');
  });
});

app.post('/new_cases', function(req,res) {
    var sql = `SELECT d.Country, avg(d.new_cases) AS avg_num FROM Dailydata d NATURAL JOIN City c GROUP BY d.Country LIMIT 15 `;
    console.log(sql);
    connection.query(sql, function(err,result) {
    if (err) {
    res.send(err)
    return;
    }
    res.send(result);
    console.log(result); 
  });
});

app.post('/VacData', function(req,res) {
  var min = req.body.min;
  var max = req.body.max;
  var sql = `(SELECT COUNT(VacId) AS cntv, Company FROM Vaccination GROUP BY Company HAVING cntv < ${min}) UNION(SELECT COUNT(VacId) AS cntv, Company FROM Vaccination GROUP BY Company  HAVING cntv > ${max}) LIMIT 15`;
  console.log(sql);
  connection.query(sql, function(err,result) {
  if (err) {
  res.send(err)
  return;
  }
  res.send(result);
  console.log(result); 
  });
});

app.listen(80, function() {
    console.log('Node app is running on port 80');
});
