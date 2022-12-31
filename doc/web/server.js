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
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  var arr1 = new Array(15);
  var arr2 = new Array(15);
  var arr3 = new Array(15);
  var i = 0;
  var sql1 = `SELECT d.Country, avg(d.new_cases) AS avg_num FROM Dailydata d NATURAL JOIN City c where d.Date >= "2022-10-07 00:00:00" GROUP BY d.Country ORDER BY avg_num DESC LIMIT 14 `;
  var sql2 = `SELECT Country, New_cases, New_deaths from HighriskCountries Order by New_cases desc limit 13`
  var sql3 = `SELECT VacName, StDate from Vaccination Order by StDate limit 6`
  console.log(sql1);
  connection.query(sql1, function(err,result) {
    if (err) {
        res.send(err);
        return;
    }
    for (const num of result){
      arr1[i] = result[i].Country + ": " + result[i].avg_num
      i = i+1
    }
    console.log(sql2);
    connection.query(sql2, function(err,result) {
      if (err) {
          res.send(err);
          return;
      }
      i = 0;
      for (const num of result){
        arr2[i] = result[i].Country + ": " + result[i].New_cases + " , " + result[i].New_deaths;
        i = i+1
      }
      console.log(sql3);
      connection.query(sql3, function(err,result) {
      if (err) {
          res.send(err);
          return;
      }
      i = 0;
      for (const num of result){
        arr3[i] = result[i].VacName + ": " + result[i].StDate;
        i = i+1
      }
      console.log(arr3[0]);
      res.render('home', { title: 'Daily Life with COVID-19',msg: "", arr1: arr1, arr2:arr2,arr3:arr3 });
  });
  });
});
});
  

app.get('/reset', function(req, res) {
  var procedure = `call reset()`;
  console.log(procedure);
  connection.query(procedure, function(err,result) {
    if (err) {
        res.send(err);
        return;
    }
    res.end("Reset Success!");
  });
});
app.get('/updated', function(req, res) {
  var procedure = `call UpdateAll()`;
  console.log(procedure);
  connection.query(procedure, function(err,result) {
    if (err) {
        res.send(err);
        return;
    }
    res.end("Update Success!");
  });
});

/* GET log in page respond by rendering login.ejs */
app.get('/login',function(req,res){
  res.render('login',{title: 'Login'}); 
});  

app.post('/Userpage',function(req,res){
  var i = 0;
  var arr =  new Array(10);
  var arr2 =  new Array(10);
  var Username = req.body.Username;
  var Password = req.body.Password;
  var sql = ` Select Username from Userinfo where Username = '${Username}' and Psw = '${Password}'`;
  var procedure = ` call CalculateRisk('${Username}')`;
  var sql2 = ` Select c.Country, h.Hintwords from (Select Country,Risklevel from Countrylist where Username = '${Username}') c, Hint h where c.Risklevel = h.Risklevel`;
  

  console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.send(err);
          return;
      }
        
      if (result.length == 0){
        res.end('Login Failed! Check your user name and password!');
        return;
      } 
      console.log(procedure);
  connection.query(procedure, function(err,result) {
  if (err){res.send(err);
    return;
  }
  else {
    console.log(sql2);
    connection.query(sql2, function(err,result) {
      if (err) {
        res.send(err);
        return;
      }
      else{
        for (const num of result){
          result[i].Hintwords = ("Country:"+ result[i].Country + ", Today's risk: " + result[i].Hintwords );
          i = i + 1;
        }
        res.render('Userpage',{name: Username, msg: result});
      console.log(arr[i]);
      return;
        
      }
    });
  }
 });
      
  });
});

/* GET sign up page, respond by rendering sign.ejs */
app.get('/signup',function(req,res){
  res.render('sign',{title: 'Sign up', msg:""}); 
});  
app.get('/signup/settings',function(req,res){
  res.render('setting',{title: 'Sign up'}); 
});  

app.post('/login/settings',function(req,res){
  var Username = req.body.Username;
  res.render('setting',{name: Username,msg:""});
  });

app.post('/signup/settings',function(req,res){
  var Username = req.body.Username;
  var Password = req.body.Password;
  var Confirm = req.body.Password_confirm;
  if (Password != Confirm){res.end("You input different Password");}
  
  var sql = ` Insert into Userinfo (Username,Psw) values ('${Username}','${Password}')`;
  console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.end("Username Exist!")
          return;
      }
      res.render('setting',{name: Username,msg:""});
      console.log(result); 
      console.log(Username); 
  });

});

app.post('/signup/settings-adding',function(req,res){
  var Username = req.body.Username;
  var Country = " "+ req.body.Country+ " ";
  
  var sql = ` Insert into Countrylist (Username,Country) values ('${Username}','${Country}')`;
  var sql2 = ` Select * from Dailydata where Country = '${Country}'`
  console.log(sql2);
  connection.query(sql2, function(err,result) {
    if (err) {
        res.send(err)
        return;
    }
    if (result.length == 0){
      res.render('setting',{name: Username, msg: "The Country does not exist!"});
    }
    else {
      console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.send(err)
          return;
      }
      res.render('setting',{name: Username, msg: "Add Successfully!"});
      console.log(result); 
      console.log(Username); 
      });
    }
 });

});


app.post('/signup/settings-deleting',function(req,res){
  var Username = req.body.Username;
  var Country = " "+ req.body.Country+ " ";
  
  var sql = ` Delete from Countrylist where Country = '${Country}'and Username = '${Username}'`;
  var sql2 = ` Select * from Countrylist where Country = '${Country}'and Username = '${Username}'`
  console.log(sql2);
  connection.query(sql2, function(err,result) {
    if (err) {
        res.send(err)
        return;
    }
    if (result.length == 0){
      res.render('setting',{name: Username, msg: "The Country is not in your list!"});
    }
    else {
      console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.send(err)
          return;
      }
      res.render('setting',{name: Username, msg: "Delete Successfully!"});
      console.log(result); 
      console.log(Username); 
      });
    }
 });

});

app.post('/signup/settings-changing',function(req,res){
  var Username = req.body.Username;
  var OldCountry = " "+ req.body.OldCountry+ " ";
  var NewCountry = " "+ req.body.NewCountry+ " ";
  var sql = ` Update Countrylist set Country = '${NewCountry}' where Country = '${OldCountry}'and Username = '${Username}' `;
  var sql2 = ` Select * from Dailydata d, Countrylist c where c.Country = '${OldCountry}'and c.Username = '${Username}' and d.Country = '${NewCountry}'`
  console.log(sql2);
  connection.query(sql2, function(err,result) {
    if (err) {
        res.send(err)
        return;
    }
    if (result.length == 0){
      res.render('setting',{name: Username, msg: "The Country is not in your list or does no exist!"});
    }
    else {
      console.log(sql);
    connection.query(sql, function(err,result) {
      if (err) {
          res.send(err)
          return;
      }
      res.render('setting',{name: Username, msg: "Update Successfully!"});
      console.log(result); 
      console.log(Username); 
      });
    }
 });
});

 
// this code is executed when a user clicks the form submit button
app.post('/Dailydata', function(req, res) {
  var Country = req.body.Country;
  var sql = ` SELECT * FROM Dailydata WHERE Country LIKE '%${Country}%'`;
  var i = 0;
  var arr =  new Array(10);
console.log(sql);
  connection.query(sql, function(err,result) {
    if (err) {
	  res.send(err)
	  return;
    }
    if (result.length == 0){
      res.render('home', { title: 'Daily Life with COVID-19',msg: "No such country" });
      return;
    }
    else{
        arr[0] = ("Country: " + result[0].Country);
        arr[1] = ("Country Code: " + result[0].Country_code);
        arr[2] = ("WHO Region: " + result[0].WHO_region);;
        arr[3] = ("New Cases: " + result[0].New_cases);
        arr[4] = ("Cumulative Cases: " + result[0].Cum_cases);
        arr[5] = ("New Deaths: " + result[0].New_deaths);
        arr[6] = ("Cumulative Deaths: " + result[0].Cum_deaths);
        res.render('Dailydata', { title: 'Daily Life with COVID-19',msg: arr });
      }

    console.log(result); 
   // res.redirect('/success');
  });
});

// this code is executed when a user clicks the form submit button
app.post('/login/Dailydata', function(req, res) {
  var Country = req.body.Country;
  var sql = ` SELECT * FROM Dailydata WHERE Country LIKE '%${Country}%'`;
  var i = 0;
  var arr =  new Array(10);
console.log(sql);
  connection.query(sql, function(err,result) {
    if (err) {
	  res.send(err)
	  return;
    }
    if (result.length == 0){
      res.render('home', { title: 'Daily Life with COVID-19',msg: "No such country" });
      return;
    }
    else{
        arr[0] = ("Country: " + result[0].Country);
        arr[1] = ("Country Code: " + result[0].Country_code);
        arr[2] = ("WHO Region: " + result[0].WHO_region);;
        arr[3] = ("New Cases: " + result[0].New_cases);
        arr[4] = ("Cumulative Cases: " + result[0].Cum_cases);
        arr[5] = ("New Deaths: " + result[0].New_deaths);
        arr[6] = ("Cumulative Deaths: " + result[0].Cum_deaths);
        res.render('Dailydata', { title: 'Daily Life with COVID-19',msg: arr });
      }

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

app.post('/VacData', function(req,res) {
  var min = req.body.min;
  var max = req.body.max;
  var i = 0;
  var arr1 =  new Array(10);
  var sql = `(SELECT COUNT(VacId) AS cntv, Company FROM Vaccination GROUP BY Company HAVING cntv < ${max}) UNION(SELECT COUNT(VacId) AS cntv, Company FROM Vaccination GROUP BY Company  HAVING cntv > ${min}) ORDER BY cntv DESC LIMIT 9`;
  console.log(sql);
  connection.query(sql, function(err,result) {
  if (err) {
  res.send(err)
  return;
  }
  for (const num of result){
    arr1[i] = "Company: " + result[i].Company + ": " + ", Num Vaccines:" +result[i].cntv;
    i = i+1
  }
  res.render("vacdata", {title: "Reliable Companies", arr1:arr1});
  console.log(result); 
  });
});

app.listen(80, function() {
    console.log('Node app is running on port 80');
});