const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/publTestDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected")
}).catch((e:any) => {
    console.log(e)
})
const Schema = mongoose.Schema;
/*
function autoincrementArticles(seqName) {//Function for autoincrement
    const seqDoc = mongoose.Articles.findAndModify({
        query: {_id: seqName},
        update: {$inc: {seqValue: 1}},
        new: true
    });
    return seqDoc.seqValue;
}*/

const ArticleBodySchema = new Schema({
    title: String,
    text: String,
    about: String
});
const ArticleBodyModel = mongoose.model("Article",ArticleBodySchema,"articles");

const CommentsSchema = new Schema({
    articleID:String,
    name: String,
    comment: String,
    time:String,
    email:String
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
const CommentsModel = mongoose.model("Comment",CommentsSchema,"comments");


export async function getListOfArticles() {
    return ArticleBodyModel.find({}, 'title about', function (err: any, articles: Array<any>) {
        if (err) console.log(err)
        //console.log(articles)
        return articles;
    });
}
export async function getArticle(id:String) {
    return ArticleBodyModel.find({_id: id}, 'title text -_id', function (err: any, articles: Array<any>) {
        if (err) {
            console.log(err)
            return [{title: "Not Found!", text: "404\nNot Found!"}]
        }
        return articles[0];
    });
}
export async function getComments(id:String) {
    return CommentsModel.find({articleID: id}, 'name time comment -_id', function (err: any, comments: Array<any>) {
        if (err) {
            console.log(err)
            return []
        }
        return comments;
    });
}
export async function newComment(id:String,comment:String,fio:String,email:String,time:String) {
    const newComment:any = new CommentsModel({name: fio, comment: comment, time: time,email:email,articleID:id});
    return newComment.save(function (err: any, comments: Array<any>) {
        if (err) {
            console.log(err)
        }
    });
}