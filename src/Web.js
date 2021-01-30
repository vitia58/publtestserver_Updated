const mysql = require('mysql2');
const http = require("express");
const express = require("express");
bodyParser = require('body-parser');
const app = http();
const mysqlconfig = {
    connectionLimit: 20,
    host: "localhost",
    user: "root",
    password: "root",
    database: 'pubtest'
};
const cookieParser = require('cookie-parser');
app.use(cookieParser(''));
app.use(http.json());
const con = mysql.createPool(mysqlconfig);
app.post('/newArticle', (request, response) => {
    console.log(request.url);
    const title = request.body.title;
    const body = request.body.body;
    const token = request.cookies.token;
    if (token !== undefined && token.length === 50) {
        response.writeHead({'Content-Type': 'text/json; charset=utf-8'});
        con.query("SELECT * FROM `admins` WHERE `token` LIKE ?", [token], function (err, result) {
            if(result.length===1){
                con.query("INSERT INTO `articles` (`name`, `text`) VALUES (?, ?)", [title, body]);
                response.end("{\"result\":\"Success\"}");
                con.end();
            }else {
                response.end("{\"result\":\"Invalid token\"}");
                con.end();
            }
        });
    }else response.end("{\"result\":\"Invalid token\"}");
});
app.post('/api/login', (request, response) => {
    console.log(request.url);
    let result = {result: "", type: 'error'};
    const login = request.body.login;
    const password = request.body.password;
    let send = true;
    if(login == null||login.length === 0)result.result="Login is empty";
    else if(password == null || password.length === 0)result.result="Password is empty";
    else{
        con.query("SELECT `token` FROM `admins` WHERE `login` LIKE ? AND `password` LIKE ?",[login,password], function (err, token) {
            if(token.length===1){
                result.result = "Success";
                result.type='success';
                response.cookie('token', token[0].token, {
                    maxAge: 3600 * 24 * 30,
                })
                send=false;
            }else result.result="Incorrect password or login";
            response.end(JSON.stringify(result));
        });
        con.end();
    }
    if(result.result.length>0&&send)response.end(JSON.stringify(result));
});
app.get('/post', (req, res) => {
    console.log(req.cookies.token);
    /*const letters = "qwertyuiopasdfghjklzxcvbnm123456790!@#$%^&*()-=_+,.[]";
    //res.cookie('token', );
    let generated = "";
    for (let i = 0; i < 50; i++) {
        const n = Math.floor(Math.random() * letters.length);
        generated += letters.charAt(n);
    }
    res.cookie('token', generated);*/
    res.end();
});
app.use(express.static('static'));
app.get("/", function(request, response) {
    console.log(request.url);
    const token = request.cookies.token;
    if(token !== undefined && token.length === 50){
        con.query("SELECT `id` FROM `admins` WHERE `token` LIKE ?",[token], function (err, id) {
            if(id.length===1)response.sendFile('static/adminpanel.html', {root: __dirname });
            else response.sendFile('static/login.html', {root: __dirname });
        });
        con.end();
    }else response.sendFile('static/login.html', {root: __dirname });
});
module.exports = app