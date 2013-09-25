/** 
 * Note: 
 * -----
 * The chat view manages all of the UI relevant to the chat functionality. 
 * The view will contain a list of all the connected user's contacts and 
 * keep him on screen at all times. 
 */ 


define(['SocialNetView', 
	'views/chatsessionView', 
	'views/chatitemView', 
	'text!templates/chat.html'], 
       function(SocialNetView, ChatSessionView, ChatItemView, chatItemTemplate){
	   var chatView = SocialNetView.extend({
	       el: $('#chat'), 
	       
	       /** 
		* Object: chatSessions
		* --------------------
		* The chatSessions object is a dictionary - the accountId is used as 
		* a key for each session, it is kept easily accessible in memory. 
		* The chatSessions object contains a list of contact IDs. Each contact
		* ID contains a reference to the memory location for the chat session with 
		* that contact. Using a dictionary like this ensures only one chat session
		* is open at a time for any given contact. 
		*/

	       chatSessions: {}, 
	       
	       initialize: function(options){ 
		   this.socketEvents = option.socketEvents; 
		   this.collection.on('reset', this.renderCollection, this); 
	       }, 
	      
	
	       render: function() { 
		   this.$el.html(chatItemTemplate); 
	       }, 
	       
	       /**
		* Method: startChatSession
		* ------------------------
		* startChatSession checks to see whether a chat session already
		* exists between the user and the given contact. If a session
		* does not already exist it will create one and add it to the
		* chatSessions object. 
		*/ 

	       startChatSession: function( model ) { 
		   var accountId = model.get( 'accountId' ); 
		   if( !this.chatSessions[accountId] ){ 
		       var chatSessionView = new ChatSessionView({
			   model: model, 
			   socketEvents: this.socketEvents
		       }); 
		       this.$el.prepend(chatSessionView.render().el); 
		       this.chatSessions[accountId] = chatSessionView; 
		   }
	       }, 
	       
	       /** 
	        * Note: 
		* -----
		* During the renderCollection function, the list is redrawn
		* and for each contact the chat view binds the startChatSession
		* callback on the chat:start event to handle cases when the user
		* clicks on a particular contact's name. 
		*
		* The chat view spawns off actual chat sessions when triggered
		* by the chat item view. Whenever someone clicks on the chat 
		* item or whenever a chat message comes through Socket.io, the
		* chat item is responsible for notifying the chat controller about
		* the approriate time to bring a chat window on screen 
	
		*/

	       renderCollection: function(collection) { 
		   var that = this; 
		   $('.chat_list').empty(); 
		   collection.each(function(contact){
		       //spawn chat
		       var chatItemView = new ChatItemView({socketEvents: that.socketEvents, 
							    model: contact} ); 
		       chatItemView.bind('chat:start', that.startChatSession, that); 
		       var statusHtml = (chatItemView).render().el; 
		       $(statusHtml).appendTo('.chat_list'); 
		   }); 
	       }
	   }); 
	   
	   return chatView; 
}); 
