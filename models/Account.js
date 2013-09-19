 


module.exports = function(config, mongoose, nodemailer){
    var crypto = require('crypto'); 

    var Status = new mongoose.Schema({
	name:{
	    first: { type: String}, 
	    last: {type: String} 
	}, 
	status: { type: String } 
    }); 

    var Contact = new mongoose.Schema({
	name: { 
	    first: { type: String }, 
	    last: { type: String } 
	}, 
	accountId: { type: mongoose.Schema.ObjectId }, 
	add: { type: Date }, 
	updated: { type: Date}
    }); 

   /** 
     * Note: 
     * -----
     * @param email: note this is set to unique
     * true. Book page 86 says this both forces 
     * unique values and forces indexing
     */  


   var AccountSchema = new mongoose.Schema({
	email:  {type: String, unique: true}, 
	password: {type:String}, 
	name: {
	    first: {type:String}, 
	    last: {type:String}
        }, 
	birthday: { 
	    day: {type:Number, min: 1, max:31, required: false}, 
	    month: {type: Number, min:1, max:12, required: false}, 
	    year: {type: Number}
        }, 
	photoURL: {type:String}, 
	biography: {type: String}, 
	status: [Status], 
	activity: [Status]
    }); 

    var Account = mongoose.model('Account', AccountSchema); 

    var registerCallback = function(err){
	if(err){ 
	    return console.log(err); 
	}
	return console.log('Account was created'); 
    }; 
    
    var changePassword = function(accountID, newpassword){
	var shaSum = crypto.createHash('sha256'); 
	shaSum.update(newpassword); 
	var hashedPassword = shaSum.digest('hex'); 
	Account.update({_id:accountId}, {$set: {password: hashedPassword}}, {upsert:false}, 
	  function changePasswordCallback(err){
	      console.log('Change password done for account ' + accountId); 
	}); 
    }; 

    var forgotPassword = function(email, resetPasswordUrl, callback){
	var user = Account.findOne({email:email}, function findAccount(err, doc){ 
	    if(err){ 
		// email address is not a valid user
		callback(false); 
	    } else {
		var smtpTransport = nodemailer.createTransport('SMTP', config.mail); 
		resetPasswordUrl += '?account=' + doc._id; 
		smtpTransport.sendMail({
		    from: 'thisapp@example.com', 
		    to: doc.email, 
		    subject: 'SocialNet Password Request', 
		    text: 'Click here to reset your password: ' + resetPasswordUrl
		}, function forgotPasswordResult(err){ 
		    if(err){
			callback(false); 
		    } else { 
			callback(true); 
		    }
		}); 
	    }
	}); 
    }

    /** 
     * Function: login
     * -------------
     * The login function queries MongoDB and returns a truth flag 
     * indicating whether or not it was able to find a user whose email
     * address and encrypted password match the login credentials 
     * supplied by Node. 
     * 
     * The login function is called in ~/public/routes/authentication.js
     */ 


    var login = function(email, password, callback){ 
	var shaSum = crypto.createHash('sha256'); 
	shaSum.update(password); 
	Account.findOne({email:email, password:shaSum.digest('hex')}, function(err, doc){
	    callback(doc);  //in book null!=doc 
	}); 
    }; 


    /** 
     * Function: findByString
     * --------------------
     * The goal for the search tool is to provide a simple user interface. 
     * One was to accomplish simplicity is to use regular expressions to 
     * perform case insensitive searches against the name and email fields
     * in each account
     */ 
    
   var findByString = function(searcStr, callback){
       var searchRegex = new RegExp(searchStr, 'i'); 
       Account.find({
	   $or: [
	       { 'name.full': { $regex: searchRegex } }, 
	       { email: { $regex: searchRegex } }
	   ]
       }, callback); 
   }; 



   var findById = function(accountId, callback){
	Account.findOne({_id:accountId}, function(err, doc){
	    callback(doc); 

	}); 
    };


    var addContact = function(account, addcontact){ 
	contact = { 
	    name: addcontact.name, 
	    accountId: addcontact_id, 
	    added: new Date(), 
	    updated: new Date()
	}; 
	
	account.contacts.push(contact); 
	
	account.save(function (err){ 
	    if(err) { 
		console.log('Error saving account: ' + err ); 
	    }
	}); 
    }; 
    
    
    var removeContact = function(account, contactId){ 
	if( null == account.contacts){
	    return; 
	}
	
	account.contacts.forEach(function( contact ) { 
	    if( contact.accountId == contactId ) { 
		account.contacts.remove( contact ) ; 
	    }
	}); 
	
	account.save();
    }; 
    

    /** 
     * Method: hasContact
     * ------------------
     * determines whether a given contactId exists in an
     * accounts contact list. 
     */


    var hasContact = function( account, contactId ){ 
	if ( null == account.contacts ) {
	    return false; 
	}
	
	account.contacts.forEach( function( contact ) { 
	    if ( contact.accountId == contactId ){ 
		return true; 
	    }
	}); 
	return false; 
    }; 



   var register = function(email, password, firstName, lastName){
	var shaSum = crypto.createHash('sha256'); 
	shaSum.update(password); 
	
	console.log('Registering ' + email); 
	var user = new Account({
	    email: email, 
	    name: { 
		first: firstName, 
		last: lastName
	    }, 
	    password: shaSum.digest('hex')
	}); 
	user.save(registerCallback); 
	console.log('Save command was sent'); 
    };

    return { 
	findById: findById, 
	register: register, 
	hasContact: hasContact, 
	forgotPassword: forgotPassword, 
	changePassword: changePassword,
	findByString: findByString, 
	addContact: addContact, 
	removeContact: removeContact, 
	login: login, 
	Account: Account
    }
}
