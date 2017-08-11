var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mysql = require("mysql");
var weather = require('weather-js');

var app = express();
var port = 3000;

app.use(express.static("public"));
app.set("view engine", "handlebars");
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// var connection = mysql.createConnection({ 
//   host: "mna97msstjnkkp7h.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//   user: " vkepj7bxyushec62",
//   password: "z6ipautgk863ehfi",
//   database: 'day_planner_db'  
// });

var connection;
if (process.env.JAWSDB_URL){
  connection = mysql.createConnection(process.eng.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: 'mna97msstjnkkp7h.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'vkepj7bxyushec62',
    password: 'z6ipautgk863ehfi',
    database: 'day_planner_db',
    port : '3306'
  });
};

connection.connect(function(err){
  if (err) {
  	console.error("error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

weather.find({search: 'Alpharetta, GA', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);   
    //console.log(JSON.stringify(result, null, 2));
    console.log("Location : " + result[0].location.name);
    console.log(" Current Temperature " + result[0].current.temperature);
    console.log(" Feels Like " + result[0].current.feelslike);
    console.log(" Humidity " + result[0].current.humidity);
      for (var i = 0 ; i < 5 ; i++){
        console.log(result[0].forecast[i].day + "  " + "Low : " + result[0].forecast[i].low +
        " High : " + result[0].forecast[i].high + " Description : " + result[0].forecast[i].skytextday);
      }

    weatherApi = result;
 });


app.get("/", function(req,res){
  connection.query("SELECT * FROM plans;", function(err,data){
  	if (err) throw err;
  	res.render("index",{ plans: data , wea :weatherApi});
  });
});

app.post("/", function(req,res){
  connection.query("INSERT INTO plans (plan) VALUES (?)",[req.body.plan], function(err,result){
  	if (err) throw err;
  	res.redirect("/");
  });
});

app.delete("/:id", function(req,res){
  connection.query("DELETE FROM plans WHERE id = ?",[req.params.id], function(err,result){
  	if (err) throw err;
  	res.redirect("/");
  });
});

app.put("/", function(req,res){
  connection.query("UPDATE plans SET plan = ? WHERE id = ?", [req.body.plan , req.body.id], function(err,result){
  	if (err) throw err;
  	res.redirect("/");
  });
});

app.listen(port);