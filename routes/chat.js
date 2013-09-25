/** 
 * Note: 
 * -----
 * The Node.js Express server is responsible for authentication and
 * data delivery. Below sets up the the authorization portion of the 
 * Socket.io handshake. Before the socket is allowed to connect it 
 * goes through an authorization process to ensure the user is allowed
 * to access the server. Because we set up a shared key for the Express
 * cookie, Socket.io is able to access the memory store for the
 * connecting user and determine if the sessionID matches one that 
 * is known to Node.js. 
 * 
 * The authorization method takes two params. 
 * @param data:    the handshake data received by the server. This includes
 *                 the session cookie where you will search for the user's 
 *                 login information. 
 * @param accept:  The callback function that should be triggered at the 
 *                 end of an authoriztion cycle 
 * 
 * The callback function requires two arguments: error and success
 * If there was a problem with the handshaek, error will contain
 * information about the problem. 
 */

module.exports = function(app, models){
    var io = require('socket.io'); 
    var utils = require('connect').utils; 
    var cookie = require('cookie'); 
    var Session = require('connect').middleware.session.Session; 
    
    var sio = io.listen(app.server); 
    
    sio.configure(function(){                //authorization method

	app.isAccountOnline = function( accountId ){ 
	    var clients = sio.sockets.clients( accountId); 
	    return (clients.length > 0); 
	}; 


	sio.set('authorization', function(data, accept){
	    var signedCookies = cookie.parse( data.headers.cookie ); 
	    var cookies = utils.parseSignedCookies( signedCookies, app.sessionSecret ); 
	    data.sessionID = cookies['express.sid']; 
	    data.sessionStore = app.sessionStore; 
	    data.sessionStore.get(data.sessionID, function( err, session ){ 
		if( err || !session ) { 
		    return accept( 'Invalid session', false); 
		} else { 
		    data.session = new Session( data, session );  // add session to handshake 
		    accept( null, true ); 
		}
	    }); 
	}); 


	/** 
	 * Note: 
	 * -----
	 * the function that will be executed after a successful handshake.
	 * Since session was added to the handshake data we can access
	 * the session in the handshake property of the socket object.
	 * In this case we retrieve the accountId - this is a Mongo 
	 * ObjectID stored for the user. Once this information has been
	 * retrieved the socket is instructed to join a room with the same 
	 * name. This provides a filter on socket communications that allows
	 * the application to communicate with specified users. 
	 *
	 * Every user is effectively boxed into their own channel.
	 */
	
	
	sio.sockets.on('connection', function(socket){
	    var session = socket.handshake.session; 
	    var accountId = session.accountId; 
	    var sAccount = null; 
	    socket.join( accountId ); 
	

	    app.triggerEvent('event:' + accountId, {
		from: accountId, 
		action: 'login'
	    }); 

	    var handleContactEvent = function( eventMessage ){ 
		socket.emit('contactEvent', eventMessage ); 
	    };

	    var subscribeToAccount = function( accountId ){ 
		var eventName = 'event:' + accountId; 
		app.addEventListener( eventName, handleContactEvent ); 
		console.log('Subscribing to ' + eventName); 
	    }; 

	    models.Account.findById(accountId, function subscribeToFriendsFeeds( account ){ 
		var subscribedAccounts = {}; 
		sAccount = account; 
		account.contacts.forEach(function( contact ){ 
		    if( !subscribedAccounts[contact.accountId]){ 
			subscribeToAccount(contact.accountId); 
			subscribedAccounts[contact.accountId] = true; 
		    }
		}); 
		
		if( !subscribedAccounts[accountId] ){
		    //
		    subscribeToAccount(accountId);
		}
	    }); 
	    
	    socket.on('disconnect', function() {
		sAccount.contacts.forEach(function( contact ){ 
		    var eventName = 'event:' + contact.accountId; 
		    app.removeEventListener( eventName, handleContactEvent ); 
		    console.log('Unsubscribing from ' + eventName); 
		}); 
		
		app.triggerEvent('event:' + accountId, { 
		    from: accountId, 
		    action: 'logout'
		});
	    }); 
		       		       


            socket.on('chatclient', function( data ) { 
		sio.sockets.in(data.to).emit('chatserver', { 
		    from: accountId, 
		    text: data.text
		});
	    }); 
	}); 
    });  
	
}
