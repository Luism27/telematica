//data base
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'momlamrds.c1f1b5fwsook.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'qwertyuiop',
    database: 'Telematica'
});

//base de datos

// server
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var hbs = require("express-hbs");
const path = require("path");
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views"
  })
);
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

// static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendfile("index.html");
});

app.post("/guardar", (req, res) => {
  console.log(req.body); // Requiring data in historicos
  if (con) {
    console.log("Connected!");
    var sql =
      "INSERT INTO candidato (nombre,apellido,cedula,partido,ciudad_dep,departamento,cargo,foto,hoja_vida,plan) VALUE ? ";
    var value = [[req.body.nombre,
      req.body.apellido,
      req.body.cedula,
      req.body.partido,
      req.body.ciudad,
      req.body.departamento,
      req.body.cargo,
      req.body.foto,
      req.body.hoja,
      req.body.plan]];
    console.log(value);
    con.query(sql, [value], function(err, result) {
      if (err) throw err;
      //res.json(result);
      //con.end();
    });
  } else {
    console.log("Error conection with db");
  }
});
app.post("/verificar2",(req,res)=>{

  if (con){
    var sql = "SELECT nombre,direccion FROM puesto_vota WHERE nombre = ? AND direccion = ? ";
    var value=[
      req.body.nombre,
      req.body.direccion
    ];
    con.query(sql, value, function(err, result) {
      if (err) throw err;
      res.json(result);
      console.log(`Los resultados desde el server ${result} `)
      //con.end();
    });
  }else {
    console.log("Error conection with db");
  }
});
app.post("/guardar2", (req, res) => {
  console.log(req.body); // Requiring data in historicos
  if (con) {
    var sql = "SELECT nombre,direccion FROM puesto_vota WHERE nombre = ? AND direccion = ? ";
    var value=[
      req.body.nombre,
      req.body.direccion
    ];
    con.query(sql, value, function(err, result) {
      if (err) throw err;
      res.json(result);
      console.log(`Los resultados desde el server ${result} `)
      //con.end();
    });
    
     sql =
      "INSERT INTO puesto_vota (nombre,direccion,ciudad,departamento) VALUE ? ";
     value = [[req.body.nombre,
      req.body.direccion,
      req.body.ciudad,
      req.body.departamento]];
    console.log(value);
    con.query(sql, [value], function(err, result) {
      if (err) throw err;
      //res.json(result);
      //con.end();
    });

  } else {
    console.log("Error conection with db");
  }
});
app.get("/puesto",(req,res)=>{
  if(con){
    var sql ="Select nombre FROM puesto_vota";
    con.query(sql, function(err, result) {
      if (err) throw err;
      res.json(result);

      //console.log(`Los resultados desde el server ${result.nombre} `)
      //con.end();
    });
  }else {
    console.log("Error conection with db");
  }
});
app.listen(port, () => {
  console.log(`Escuchando peticiones en el puerto ${port}`);
});