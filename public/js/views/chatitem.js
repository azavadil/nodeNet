/** 
 * Class: chatitemView
 * -------------------
 * Responsible for determining when a chat session should
 * be created by detecting when the user clicks on one of
 * his contacts or when one of his contacts sends a message
 * the logged in user. 
 * 
 * The only event in the events list is 'click': 'startChatSession', 
 * meaning the function startChatSession is to be run whenever the user
 * clicks anywhere within the view. 
 */ 



define(['SocialNetView', 
	'text!templates/chatitem.html'],
       function( SocialNetView, chatItemTemplate ){ 
	 
	   var chatItemView = SocialNetView.extend({
	   
	       tagName: 'li', 
	       
	       $el: $(this.el), 
	       
	       events: {
		   'click': 'startChatSession', 
	       }, 
	       
	       /** 
		* Method: initialize
		* ------------------
		* binds the view to the socket's start event
		* This instructs Backbone to go through the motions
		* of starting a chat session whenever a chat is initiated
		* from Socket.io. So whether the user clicks on a contact
		* or the contact initiates a discussion with the user, the
		* same process for starting the chat on screen is put into 
		* motion
		*/ 

	       initialize: function( options ) {
		   var accountId = this.model.get('accountId'); 
		   
		   options.socketEvents.bind(
		       'login:' + accountId, 
		       this.handleContactLogin, 
		       this
		   );


		   options.socketEvents.bind(
		       'logout:' + accountId, 
		       this.handleContactLogout, 
		       this
		   ); 
		   
		   options.socketEvents.bind(
		       'socket:chat:start:' + this.model.get('accountId'), 
		       this.startChatSession, 
		       this
		   ); 
	       }, 

	      
	       handleContactLogin: function() {
		   this.model.set('online', true); 
		   this.$el.find('.online_indicator').addClass('online'); 
	       }, 

	       handleContactLogout: function() { 
		   this.model.set('online', false); 
		   $onlineIndicator = this.$el.find('.online_indicator'); 
		   while ( $onlineIndicator.hasClass('online')) { 
		       $onlineIndicator.removeClass('online'); 
		   }
	       }, 

	       
	       startChatSession: function(){
		   this.trigger('chat:start', this.model);
	       }, 
	       
	       render: function(){ 
		   this.$el.html(_.template(chatItemTemplate, {
		       model: this.model.toJSON()
		   }));
		   if( this.model.get('online') ) { 
		       this.handleContactLogin(); 
		   }

		   return this;
	       }
	   }); 
	   
	   return chatItemView; 
}); 
