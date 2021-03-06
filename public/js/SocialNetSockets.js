/** 
 * Note: 
 * -----
 * The class is initialized after the application's router
 * and takes the router's socketEvents object as the initialization
 * parameter. When the class is initialized the socketEvents object
 * called eventDispatcher here, is told to bind the app:loggedin event 
 * to the connectSocket function
 * 
 * When users connect to the application they trigger the app:loggedin
 * event which in turn causes the connectSocket function to make a 
 * connection to Node.js's Socket.io listener. 
 * 
 * When the Socket.io server sends a chat event using the chatserver
 * event name the SocialNetSockets class will trigger two of its own 
 * events in the socketEvents dispatcher: socket:char:start and
 * socket:chat:in. Whenever a chat is received all interested observers
 * will know they need to start a session and process the incomng message
 *
 * Immediately upon connecting the eventDispatcher will bind to an event
 * called socket:chat. This will be triggered whenever the user sends a 
 * chat message to any of this contacts. When a chat is sent, the socket
 * emits a chatclient event to the Socket.io server. 
 */ 



define(['Sockets', 
	'models/ContactCollection',
	'views/chatView'], 
       function(sio, ContactCollection, ChatView){ 
	   var SocialNetSockets = function( eventDispatcher ){ 
	       var socket = null; 

	       var connectSocket = function(){ 
		   socket = io.connect(); 
		   
		   socket
		       .on('connect_failed', function(reason){ 
			   console.error('unable to connect', reason); 
		       })
		       .on('connect', function(){ 
			   console.log("~/public/js/SocialNetSockets.js | connectSocket | .onConnect triggered"); 
			   eventDispatcher.bind('socket:chat', sendChat); 
			   socket.on('chatserver', function(data) { 
			       eventDispatcher.trigger('socket:chat:start:' + data.from); 
			       eventDispatcher.trigger('socket:chat:in:' + data.from, data); 
			   }); 
			   var contactsCollection = new ContactCollection(); 
			   contactsCollection.url = '/accounts/me/contacts'; 
			   new ChatView({collection: contactsCollection, socketEvents: eventDispatcher}).render(); 
			   contactsCollection.fetch(); 
		       }); 
	       }; 
	       
	       var sendChat = function( payload ){
		   if (null != socket ) { 
		       socket.emit('chatclient', payload);
		   }
	       }; 
	       
	       
	       eventDispatcher.bind('app:loggedin', connectSocket); 
	   }
	   
	   return { 
	       initialize: function(eventDispatcher){ 
		   SocialNetSockets( eventDispatcher ); 
	       }
	   }; 
});
