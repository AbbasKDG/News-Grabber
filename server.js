// Dependancies
var express = require("express"); //server
var bodyParser = require("body-parser"); //parsing
var logger = require("morgan"); //logging
var mongoose = require("mongoose"); //database middleware
//var request = require("request");

// Express
var app = express();
PORT = 3000;

//scrapping using cheerio and axios
var axios = require("axios"); //Promise based HTTP client for the browser and node.js
var cheerio = require("cheerio");

const website = "https://news.google.com/?hl=en-CA&gl=CA&ceid=CA:en";

// Using logger/Morgan instead of express 
app.use(logger("dev")); 
// body parsing, json, simple parsing (false)
app.use(bodyParser.urlencoded({extended:false}));
//contents of public folder to be ser ved as static files
app.use(express.static("public"));
//Models folder
var db = require("./models");


//promise in mongoose, asynchronity
mongoose.Promise = Promise;     
//connect to "dbforapp18" database
 
mongoose.connect('mongodb://localhost/my_database',{ useNewUrlParser: true });


//Routing

// Scrape - the get route
app.get("/scrape", function(req,res){
    //scrape website
    axios.get(website).then(function(response) {
        //set up cheerio.load
        var $ = cheerio.load(response.data);
    
        // find the right box and carousel through them
        $(".xrnccd").each(function(i, element){
    
            //load results from the response
            var result = {};
            //save to result 
            result.title=$(this).find("a").text();
            result.url=$(this).find("a").attr("href");
            result.summary=$(this).find("article").text();
            result.img = $(this).find("img").attr("src");
            console.log("result.title:  "+result.title+"\n\n");
            console.log("result.summary:  "+result.summary+"\n\n");
            console.log("result.img:  "+result.img+"\n\n");
            console.log("result.url:  "+ website+result.url+"\n\n");

            // db.Article.create(result).then(function(dbArticle){
            //     console.log(dbArticle);
            // }).catch(function(err){
            //     return res.json(err);
            // });
    
});
});
});

app.listen(PORT, function(){
    console.log("App on port: "+PORT);
})