/** 
 * Note: 
 * -----
 * []     check for a single character
 * \s     match white space characters
 * ^      negation
 */ 


define(['SocialNetView', 
	'text!templates/chatsession.html'], 
       function(SocialNetView, chatSessionTemplate){ 

	   var chatSessionView = SocialNetView.extend({

	       tagName: 'div', 
	       
	       $el: $(this.el), 
	       
	       events: { 
		   'submit form': 'sendChat'
	       }, 
	       
	       initialize: function(options){ 
		   this.socketEvents = options.socketEvents; 
		   var accountId = this.model.get('accountId'); 
		   
		   this.socketEvents.on('socket:chat:in:' + this.model.get('accountId'), 
					this.receiveChat,
					this);

		   this.socketEvents.bind(
		       'login:' + accountId, 
		       this.handleContactLogin, 
		       this
		   ); 
		   
		   this.socketEvents.bind(
		       'logout:' + accountId, 
		       this.handleContactLogout, 
		       this
		   ); 
	       }, 

	       handleContactLogin: function(){
		   this.$el.find('.online_indicator').addClass('online'); 
		   this.model.set('online', true); 
	       }, 
	       
	       handleContactLogout: function(){
		   this.model.set('online', false); 
		   $onlineIndicator = this.$el.find('.online_indicator'); 
		   while ( $onlineIndicator.hasClass('online') ){ 
		       $onlineIndicator.removeClass('online'); 
		   }
	       }, 
	       
	       receiveChat: function( data ) { 
		   var chatLine = this.model.get('name').first + ': ' + data.text; 
		   this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>')); 
	       }, 
	       

	       /**
		* Method: sendChat
		* ----------------
		* The events list contains a single entry: submit form. Whenever 
		* the logged-in user clicks the Send button this event puts the
		* sendChat function into action. In order to send a message to your
		* contact you first use jQuery to get the value of the chat message.
		* 
		* To avoid wasting Node CPU time, we use a regex to check that the 
		* string is neither empty or whitespace. 
		* 
		* [^\s]     "one or more non-whitespace characters"
		* 
		* once the message is knows (i.e. chatText), Backbone proceeds 
		* to add the message to the chat session's message list and emit
		* a socket event socket:chat to the contact's accountId with the 
		* chat message text. The chat message will get processed by the
		* SocialNetChat dispatcher and emitted to the server. 
		*/

	       sendChat: function(){ 
		   var chatText = this.$el.find('input[name=chat]').val(); 
		   if( chatText && /[^\s]+/.test(chatText) ){
		       var chatLine = 'Me: ' + chatText; 
		       this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>')); 
		       this.socketEvents.trigger('socket:chat', { 
			   to: this.model.get('accountId'), 
			   text: chatText
		       }); 
		   }
		   
		   return false; 
	       }, 
	       
	       render: function() { 
		   this.$el.html(_.template(chatSessionTemplate, { 
		       model:this.model.toJSON()
		   }));
		   
		   if( this.model.get('online') ){ 
		       this.handleContactLogin(); 
		   }

		   return this; 
	       }
	   }); 
	   
	   return chatSessionView; 
}); 
