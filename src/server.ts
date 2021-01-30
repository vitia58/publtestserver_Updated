import {getArticle, getComments, getListOfArticles, newComment} from "./db";
import http = require("express");
import moment = require("moment");

const app = require("./Web.js")
app.get('/listarts', (request, response) => {
    console.log(request.url);
    response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    getListOfArticles().then(articles => {
        let processed: Array<any> = [];
        articles.map((article: any) => {
            /*let res: Array<String> = article.text.split(' ', 16);
            if (res.length > 15) {
                res.length = 15;
                article.text = res.join(' ') + "...";
            }*/
            //console.log(article)
            processed.push({id: article._id, title: article.title, text: article.about});
        })
        //console.log(processed)
        response.end(JSON.stringify(processed))
    });
})
app.get('/article', (request, response) => {
    console.log(request.url);
    response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    let is: boolean = true;
    try {
        const article: string | undefined | any = request.query.id;
        if (is && article && article.length === 24) {
            getArticle(article).then(result => response.end(JSON.stringify(result)));
        } else response.end('{"title":"Not Found!", "text": "404\\nNot Found!"}');
    } catch (e) {
        response.end('{"title":"Not Found!", "text": "404\\nNot Found!"}');
        is = false;
    }
});
app.get('/comments', (request, response) => {
    console.log(request.url);
    response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    let is: boolean = true;
    try {
        const article: String | any = request.query.id;
        if (is && article && article.length === 24) getComments(article).then(comments => {
            response.end(JSON.stringify(comments));
        })
        else response.end('[]');
    } catch (e) {
        response.end("[]");
        is = false;
    }
});
app.use(http.json());
app.post('/comment', (request, response) => {
    console.log(request.url);
    console.log(request.body);
    response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    let is: boolean = true;
    try {
        const article: String = request.body.id;
        const fio: String = request.body.fio;
        const email: String = request.body.email;
        const comment: String = request.body.comment;
        if (is && article && fio && email && comment && article.length === 24) {
            let time: String = moment().format('DD.MM HH:mm');
            newComment(article, comment, fio, email, time).then(() => response.end('{"status":"Success!"}'))
        }else response.end('{"status":"Fail!"}');
    } catch (e) {
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