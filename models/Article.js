const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

const ArticleSchema = new Schema({
    title: String,
    url: String,
    summary: String,
    img: String,
    comments:{},
    
})


// var modelname = mongoose.model("model name", schemaname)
var Article = mongoose.model("Article",ArticleSchema); 
module.exports = Article;