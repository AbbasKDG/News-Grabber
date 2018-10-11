// Dependancies
var express = require("express"); //server
// var exphbs = require('express-handlebars');
var bodyParser = require("body-parser"); //parsing
// var logger = require("morgan"); //logging
var mongoose = require("mongoose"); //database middleware
//var request = require("request");

// Express
var app = express();
PORT = 3000;

//scrapping using cheerio and axios
var axios = require("axios"); //Promise based HTTP client for the browser and node.js
var cheerio = require("cheerio");

 const website = "https://news.google.com/?hl=en-CA&gl=CA&ceid=CA:en";
// const website = "https://www.nytimes.com"

// Using logger/Morgan instead of express 
// app.use(logger("dev")); 
// body parsing, json, simple parsing (false)
app.use(bodyParser.urlencoded({extended:true}));
//
app.use(express.json());
//contents of public folder to be ser ved as static files
app.use(express.static("public"));
//Models folder
const db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//promise in mongoose, asynchronity
mongoose.Promise = Promise;     
 
mongoose.connect(MONGODB_URI);

// app.engine("handlebars", hbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");


/*








// Register Handlebars view engine
app.engine('hbs', exphbs({defaultLayout: 'main', layoutsDir: 'views/', extname: '.hbs'}));

// Use Handlebars view engine
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('index', {layout:'main'});
});

app.get("/saved", function(req, res) {
  db.Article.find({"saved": true}).populate("note").exec(function(error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.huffingtonpost.ca/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $("ul li h3").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .html();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, reload page
    res.redirect("/");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles/save/:id", function(req, res) {
      // Use the article id to find and update its saved boolean
      db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
});

// Delete an article
app.post("/articles/delete/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
    }
  });
});















*/



//Routing


//Scrape - the get route
app.get("/", function(req,res){

    res.sendFile(__dirname  +"/public/index.html")
    
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
            // console.log("result.title:  "+result.title+"\n\n");
            // console.log("result.summary:  "+result.summary+"\n\n");
            // console.log("result.img:  "+result.img+"\n\n");
            // console.log("result.url:  "+ website+result.url+"\n\n");

            db.Article.create(result).then(function(dbArticle){
                res.json.parse(dbArticle);
                console.log(dbArticle);
            }).catch(function(err){
                return res.json(err);
            });
    
});
    
});
});
// Get all articles
app.get("/articles",function(res,req){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});
// Get specific articles
app.get("/articles/:id",function(res,req){
    db.Article.findOne({_id:req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
    
});
// Save and Update Notes for a particular Article
app.post("/articles/:id",function(res,req){
    //create Note
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id : req.params.id},{ note: dbNote.id},{new:true});
    }).then(function(dbArticle){
        res.json(dbArticle)
    }).catch(function(err){
        res.json(err);
    });
});


app.listen(PORT, function(){
    console.log("App on port: "+PORT);
});