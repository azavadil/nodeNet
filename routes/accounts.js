/** 
 * Implementation note: 
 * --------------------
 * 
 */ 


module.exports = function(app, models){ 


    /**
     * Handler: get/accounts/:id/contacts
     * ----------------------------------
     * All of the heavy lifting is done by Backbone when
     * it comes to displaying the contact list. Fetching the
     * account model and returning its list of contacts will be 
     * the backend server's role. 
     * 
     * The single most common cause of difficult errors is the 
     * inadvertent closing of the response before the request
     * has had a chance to complete. 
     *
     * Here the accounts contacts are sent to the response object
     * withn the callback function of the account model's findById 
     * method. If a reponse was made outside of the callback, the web 
     * browser would always receive an empty contact list
     */ 

    app.get('/accounts/:id/contacts', function(req, res){
	console.log("~/routes/accounts.js | get/accounts/:id/contacts triggered"); 

	var accountId = req.params.id == 'me'
	    ? req.session.accountId
	    : req.params.id; 
	models.Account.findById(accountId, function( account ) { 
	    res.send( account.contacts ); 
	}); 
    }); 


    /**  
     * Handler: get/accounts/:id/activity
     * ----------------------------------
     * the activity list call duplicates that 
     * status call. The handlers exist for the sole
     * purpose of filling StatusCollection objects in 
     * Backbone. The same data is present in the account model and 
     * can be pulled from there without making direct requests 
     * for each list.  
     */ 

    app.get('/accounts/:id/activity', function(req, res){
	var accountId = req.params.id == 'me' 
	    ? req.session.accountId 
	    : req.params.id; 
	models.Account.findById( accountId, function(account) { 
	    res.send(account.activity); 
	}); 
    })


    /** 
     * Handler: get/accounts/:id/:status
     * ---------------------------------
     * Getting the status list is straightforward: load the 
     * account and return its status list property. 
     * NTD: If the account doesn't exist Node will report and 
     * error
     */ 


    app.get('/accounts/:id:/status', function(req, res) {
	var accountId = req.params.id == 'me' 
	    ? req.session.accountId 
	    : req.params.id; 
	models.Account.findById(accountId, function(account){

	    res.send( account.status ); 
	}); 
    }); 


    /**
     * Handler: post/accounts/:id/status
     * ---------------------------------
     * The request returns right away regardless of what happens
     * to the status returning control to the frontend. 
     * 
     * After Mongoose has loaded the account in question, the status
     * is posted to that account's status feed and activity feed.
     * NTD: after contact list functionality is added, the status 
     * will push out each of the accounts contacts activity lists
     */ 

    app.post('/accounts/:id/status', function(req, res){

	console.log("~/routes/accounts.js | post/accounts/:id/status triggered"); 
	var accountId = req.params.id == 'me' 
	    ? req.session.accountId 
	    : req.params.id; 
	models.Account.findById( accountId, function( account ){ 
	    
	    status = { 
		name: account.name, 
		status: req.param('status', '')
	    }; 
	    account.status.push(status); 

	    // Push status to all friends
	    account.activity.push(status); 
	    account.save(function( err ) { 
		if( err ) { 
		    console.log('Error saving account: ' + err ); 
		}
	    }); 
	}); 
	res.send(200)
    }); 


    /** 
     * Handler: delete/accounts/:id/contact
     * ------------------------------------
     * Removing a contact: loading account data
     *                     find the offending contact
     *                     remove the offending contact
     *                     from the contact list
     *                     save the mutated account 
     * 
     * Involves two database scans and two input validations
     * First, to verify that you are who you say you are
     * and second to find your removal target. 
     * 
     * Note the response at the end of the function. All of 
     * the contact deletion occurs inside the account function
     * callback. The response will not wait for the contact 
     * removal to complete before sending. 
     * 
     */



    app.delete('/accounts/:id/contact', function(req, res){ 
	var accountId = req.params.id == 'me'
	    ? req.session.accountId 
	    : req.params.id; 
	
	var contactId = req.param('contactId', null); 
	
	// Missing contactId don't bother going any further
	if ( null == contactId ) { 
	    res.send(400); 
	    return; 
	}

	/**
	 * Note: 
	 * -----
	 * load account data and find the offending contact
	 * 
	 * Removing the offending contact and saving the 
	 * the mutated account is handled in the Account 
	 * method .removeContact
	 */ 

	models.Account.findById( accountId, function( account ) { 
	    if ( !account ) { 
		return; 
	    }
	    
	    models.Account.findById( contactId, function( contact, err ){ 
		if ( !contact ) { 
		    return;
		}
		
		models.Account.removeContact( account, contactId ); 
		//Kill the reverse link
		models.Account.removeContact( contact, accountId ) ; 
	    }); 
	}); 
	
	/**
	 * Note: 
	 * -----
	 * Not in callback - this endpoint returns immeditately
	 * and processes in the background
	 */
	
	res.send(200); 
    })


    app.get('/account/authenticated', function(req, res){
	if ( req.session.loggedIn ){ 
	    res.send(200); 
	} else { 
	    res.send(401); 
	}
    }); 




    /** 
     * Handler: post/accounts/:id/contact
     * ----------------------------------
     * Note the meaning of the route. 
     * You're saying post a contact belonging to
     * Account who's ID is
     */ 

    app.post('/accounts/:id/contact', function(req, res){
	console.log("~/routes/accounts.js | post/accounts/:id/contact triggered"); 
	var accountId = req.params.id == 'me'
	    ? req.session.accountId
	    : req.params.id; 
	var contactId = req.param('contactId', null); 

	if( null == contactId ){ 
	    res.send(400); 
	    return; 
	}
	console.log("~/routes/accounts.js | post/accounts/:id/contact |" + accountId + ", "  + contactId); 

	models.Account.findById(accountId, function( account ){ 
	    if ( account ){ 
		models.Account.findById(contactId, function( contact ){ 
		    models.Account.addContact( account, contact ); 
		    
		    // make the reverse link
		    models.Account.addContact( contact, account ); 
		    account.save(); 
		}); 
	    }
	}); 
	
	/**
	 * Note: 
	 * -----
	 * not in the callback. This endpoint returns immediately and
	 * the account changes are processed in the background
	 */ 
	res.send(200); 
    }); 





	 
    /** 
     * Handler: get/accounts/:id
     * -------------------------
     * validates whether or not you are allowed to post
     * comments on other people's streams. Load's your 
     * contats' account details and checks the relationship
     */  


    app.get('/accounts/:id', function(req, res){
	var accountId = req.params.id == 'me'
	    ?req.session.accountId 
	    :req.params.id; 
	models.Account.findById(accountId, function( account ) { 
	    if ( accountId == 'me' 
		 || models.Account.hasContact(account, req.session.accountId ) ){
		account.isFriend = true; 
	    }
	    res.send( account ); 
	}); 
    }); 
}



      
    


