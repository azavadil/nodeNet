/** 
 * Implementation note: 
 * --------------------
 * Because all of the display and processing is
 * handled on the frontend by Backbone, Node's involvement
 * for the account status is relegated to getting and setting
 * account data. 
 */ 



var express = require('express'); 
var http = require('http'); 
var nodemailer = require('nodemailer'); 
var MemoryStore = require('connect').session.MemoryStore; 
var app = express(); 
var dbPath = 'mongodb://localhost/nodebackbone';
var fs  = require('fs'); 

// Create an http server
app.server = http.createServer(app); 


// Create a session store to share between methods
app.sessionStore = new MemoryStore(); 


//Import the data layer
var mongoose = require('mongoose'); 
var config = { 
    mail: require('./config/mail') 
}; 


// Import the models
var models = { 
    Account: require('./models/Account')(config, mongoose, nodemailer)
}; 



/** 
 * Note: 
 * -----
 * In order to share the session across different parts
 * of the application, a key item is added to the session
 * store created during the application configuration stage. 
 * This is the cookie key that will be shared between the frontend
 * client and the backend server. It contains a unique ID that
 * can be compared against the session store to get the user's
 * stored session data
 */ 

app.configure(function(){
    app.sessionSecret = '1mancanmake'; 
    app.set('view engine', 'jade'); 
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser()); 
    app.use(express.cookieParser()); 
    app.use(express.session({
	secret: app.sessionSecret,
	key: 'express.sid',        
	store: app.sessionStore
    })); 
    mongoose.connect(dbPath, function onMongooseError(err){ 
	if(err) throw err; 
    }); 

}); 

// Import the routes
fs.readdirSync('routes').forEach(function(file) { 
    if( file[0] == '.' ) { 
	return; 
    }
    var routeName = file.substr(0, file.indexOf('.')); 
    require('./routes/' + routeName)(app, models); 
}); 


app.get('/', function(req, res){
    console.log("'/' reached"); 
    res.render('index.jade'); 
}); 




/** 
 * Handler: post/contacts/find
 * ---------------------------
 * Throughout the search and add contact process the 
 * backend server fills two roles: authentication and 
 * data retrieval. Authentication includes checking if the 
 * user is logged in and allowed to search the contacts, and 
 * if the user is allowed to add a particular contact. 
 * 
 * The first to do when receiving a search request is to
 * validate the request. 
 */

app.post('/contacts/find', function(req, res){
    var searchStr = req.param('searchStr', null); 
    if ( null == searchStr ){ 
	res.send(400);  //400: Invalid Request Arguments 
	return; 
    }

    models.Account.findByString(searchStr, function onSearchDone(err, accounts){
	if( err || accounts.length == 0 ) { 
	    res.send(404); 
	} else { 
	    res.send(accounts); 
	}
    }); 
}); 


app.server.listen(8080); 
console.log("Listening on port 8080..."); 

