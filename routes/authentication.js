

module.exports = function(app, models){ 
    
    
    app.post('/login', function(req, res){ 
	console.log('login request'); 
	var email = req.param('email', null); 
	var password = req.param('password', null); 
	
	if( null == email || email.length < 1 || null == password || password.length < 1 ) { 
	    res.send(400); 
	    return; 
	}

	models.Account.login(email, password, function(account){ 
	    if( !account ){
		res.send(401); 
		return; 
	    }
	    
            console.log('login was successful');
	    req.session.loggedIn = true; 
	    req.session.accountId = account._id; 
	    res.send(200); 
	}); 
    }); 


    app.post('/register', function(req, res){
	var firstName = req.param('firstName', ''); 
	var lastName = req.param('lastName', ''); 
	var email = req.param('email', null); 
	var password = req.param('password', null); 
	
	if( null == email || email.length < 1 || null == password || password.length < 1) { 
	    res.send(400); 
	    return; 
	}
	
	models.Account.register(email, password, firstName, lastName); 
	res.send(200); 
    }); 

    
    /** 
     * Note: 
     * -----
     * Notice that the session varible is attached to the request
     * object. We usually think of a request message as a message 
     * sent from the web browser to the web server. By the time
     * the request reaches this route, it contains more than just
     * the web browser's message. It also contains information 
     * attached by the Express middleware. The web browser 
     * sends an identifier which the server uses to read the user's
     * session data from the memory store.
     */ 
    
    app.get('/account/authenticated', function(req, res){
	if ( req.session && req.session.loggedIn ){ 
	    res.send(200); 
	} else { 
	    res.send(401); 
	}
    }); 







    app.post('/forgotpassword', function(req,res){ 
	var hostname = req.headers.host; 
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword'; 
	var email = req.param('email', null); 
	if( null == email || email.length < 1 )  {
	    res.send(400); 
	    return; 
	}


	models.Account.forgotPassword(email, resetPasswordUrl, function(success){
	    if (success){
		res.send(200); 
	    } else { 
		//Username or password not found
		res.send(404); 
	    }
	}); 
    }); 


    app.get('/resetPassword', function(req, res){
	var accountId = req.param('accountId', null); 
	res.render('resetPassword.jade', {locals:{accountId: accountId}}); 
    }); 


    /** 
     * Note: 
     * -----
     * The server side reset password handler is interesting because 
     * it handles both the initial GET view as well at the POST request
     * 
     * The first route listens for a GET request at http://localhost:8080/resetPassword
     * and responds with the Jade template
     */  

    app.post('/resetPassword', function(req, res){
	var accountId = req.param('accountId', null); 
	var password = req.param('password', null); 
	if (null != accountId && null != password ) {
	    models.Account.changePassword(accountId, password); 
	}
	res.render('resetPasswordSuccess.jade'); 
    }); 

}



