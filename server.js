// Global Server Variables
var express=require('express'),
    fs = require('fs'),
	ejs=require('ejs'),
    http=require('http'),
    path=require('path'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 4444,
    app=express(),
    server = http.createServer(app),
    deployment = process.env.deployment;

// Server Engine and Assets Folders
app.set('view engine', 'ejs');
app.set('views',[process.cwd()+'/views']);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//Local variables
var date = new Date();
app.locals.date = date.getFullYear();

// GET Request Functions
app.get('/', function(req,res,next){
    res.render('index', {
        title: 'Joshua McCarthy | Web Development &amp; Interactive Design | Tokyo, Japan',
        id:'home',
    });
});

/* Run server */
server.listen(port, function () {
	console.log('Server Running...' );
});