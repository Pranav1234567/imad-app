var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'pnpiano',
    database: 'pnpiano',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {
    title: 'Article One | Pranav Nagalamadaka',
    heading: 'Article One',
    date: 'August 8, 2017',
    content: ` 
        <p> This is the content for the first article. This is the content for the first article. This is the content for the first article. This is the content for the first article. 
                </p>
        <p> This is the content for the first article. This is the content for the first article. This is the content for the first article. This is the content for the first article. 
        </p>
        <p> This is the content for the first article. This is the content for the first article. This is the content for the first article. This is the content for the first article. 
        </p>`
    },
    'article-two' : { 
    title: 'Article Two | Pranav Nagalamadaka',
    heading: 'Article Two',
    date: 'August 8, 2017',
    content: ` 
        <p> This is the content for my second article.
        </p>
        `},
    'article-three' : {
        title: 'Article Three | Pranav Nagalamadaka',
    heading: 'Article Three',
    date: 'August 15, 2017',
    content: ` 
        <p> This is the content for my third article.
        </p>
        `}
};


function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = ` 
    <html>
        
        <head> 
            <title> ${title} </title>
            <meta name="viewport" content="width-device-width, initialscale=1">
           <link href="/ui/style.css" rel="stylesheet" />
        </head>      
        <body> 
            <div class="container">
                <div>
                    <a href="/"> Home </a>
                </div>  
                <h3>
                    ${heading}
                </h3>
                <hr/>
                <div>
                    ${date}
                </div>
                <div>
                   ${content}
                </div>
            </div>
        </body>  
    </html>
` 
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function (req, res){
    // make a SELECT request to a database
    // return a response
    pool.query('SELECT * from test', function(err, result){
        if (err) {
            res.status(500).senc(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

//counter page

var counter = 0;
app.get('/counter', function(req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

//submit names page

var names = [];

app.get('/submit-name/', function (req, res){ // URL: /submit-name?name=dddd
    // Get the name from the request object
    var name = req.query.name; 
    
    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});


app.get('/articles/:articleName', function (req, res) {
     // articleName == article-one
    // articles[articleName] == {} content object for article 
     var articleName = req.params.articleName;
     
     pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function (err, result){
         if (err) {
             res.status(500).send(err.toString());
         } else {
             if (result.rows.length === 0){
                 res.status(404).send('Article Not found');
             } else {
                 var articleData = result.rows[0];
                res.send(createTemplate(articleData));
             }
         }
     });
     
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});