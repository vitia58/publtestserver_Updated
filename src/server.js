"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var http = require("express");
var moment = require("moment");
var app = require("./Web.js");
app.get('/listarts', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    db_1.getListOfArticles().then(function (articles) {
        var processed = [];
        articles.map(function (article) {
            /*let res: Array<String> = article.text.split(' ', 16);
            if (res.length > 15) {
                res.length = 15;
                article.text = res.join(' ') + "...";
            }*/
            //console.log(article)
            processed.push({ id: article._id, title: article.title, text: article.about });
        });
        //console.log(processed)
        response.end(JSON.stringify(processed));
    });
});
app.get('/article:article', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    var is = true;
    try {
        var article = request.params.article;
        if (is && article && article.length === 24) {
            db_1.getArticle(article).then(function (result) { return response.end(JSON.stringify(result)); });
        }
        else
            response.end('{"title":"Not Found!", "text": "404\\nNot Found!"}');
    }
    catch (e) {
        response.end('{"title":"Not Found!", "text": "404\\nNot Found!"}');
        is = false;
    }
});
app.get('/comments:article', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    var is = true;
    try {
        var article = request.params.article;
        if (is && article && article.length === 24)
            db_1.getComments(article).then(function (comments) {
                response.end(JSON.stringify(comments));
            });
        else
            response.end('[]');
    }
    catch (e) {
        response.end("[]");
        is = false;
    }
});
app.use(http.json());
app.post('/comment', function (request, response) {
    console.log(request.url);
    console.log(request.body);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    var is = true;
    try {
        var article = request.body.id;
        var fio = request.body.fio;
        var email = request.body.email;
        var comment = request.body.comment;
        if (is && article && fio && email && comment && article.length === 24) {
            var time = moment().format('DD.MM HH:mm');
            db_1.newComment(article, comment, fio, email, time).then(function () { return response.end('{"status":"Success!"}'); });
        }
        else
            response.end('{"status":"Fail!"}');
    }
    catch (e) {
        is = false;
        response.end('{"status":"Fail!"}');
    }
});
/*app.get('/post', (req, res) => {
    //console.log(req.cookies.token);
    const letters = "qwertyuiopasdfghjklzxcvbnm123456790!@#$%^&*()-=_+,.[]";
    //res.cookie('token', );
    let generated = "";
    for (let i = 0; i < 50; i++) {
        const n = Math.floor(Math.random() * letters.length);
        generated += letters.charAt(n);
    }
    res.cookie('token', generated);
    res.end();
});*/
app.listen(3200);
