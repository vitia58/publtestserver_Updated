"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var express_1 = __importDefault(require("express"));
var moment_1 = __importDefault(require("moment"));
var app = express_1.default();
app.get('/listarts', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    db_1.getListOfArticles().then(function (articles) {
        var processed = [];
        articles.map(function (article) {
            var res = article.text.split(' ', 16);
            if (res.length > 15) {
                res.length = 15;
                article.text = res.join(' ') + "...";
            }
            processed.push({ id: article._id, title: article.title, text: article.text });
        });
        response.end(JSON.stringify(processed));
    });
});
app.get('/article', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    var is = true;
    try {
        var article = request.query.id + "";
        if (is && article.length !== 24)
            db_1.getArticle(article).then(function (result) { return response.end(JSON.stringify(result)); });
    }
    catch (e) {
        response.end("[]");
        is = false;
    }
});
app.get('/comments', function (request, response) {
    console.log(request.url);
    response.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
    var is = true;
    try {
        var article = request.query.id + "";
        if (is && article.length !== 24)
            db_1.getComments(article).then(function (comments) {
                response.end(JSON.stringify(comments));
            });
    }
    catch (e) {
        response.end("[]");
        is = false;
    }
});
app.use(express_1.default.json());
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
        if (is && article.length !== 24) {
            var time = void 0;
            time = moment_1.default().format('dd.MM hh:mm');
            db_1.newComment(article, comment, fio, email, time).then(function () { return response.end('[{"status":"Success!"}]'); });
        }
    }
    catch (e) {
        is = false;
        response.end("[{\"status\":\"Fail!\"}]");
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
