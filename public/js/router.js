/** 
 * Note: 
 * -----
 * Backbone.js provides a Router class that handles movement between the main views of 
 * your application. When faced with a URL like http://localhost:8080/#register the 
 * router understands it should display content based upon the content after the 
 * the hash (#) character - "register" in this case. 
 * 
 * The router describes how to display various screens.  e.g.
 * 
 * http://localhost:8080/#register => register: function() { ..
 * http://localhost:8080/#login => login: function() { ...
 * http://localhost:8080/#index => index: function() { ... 
 * http://localhost:8080/#forgotpassword => function() { ... 
 */ 




define(['views/index', 
	'views/register', 
	'views/login', 
	'views/forgotPassword',
	'views/profile', 
	'views/contacts', 
	'views/addcontact', 
	'models/Account', 
	'models/StatusCollection', 
	'models/ContactCollection'], 
       function(IndexView, 
		RegisterView, 
		LoginView, 
		ForgotPasswordView, 
	        ProfileView, 
		ContactsView, 
		AddContactView, 
	        Account, 
	        StatusCollection, 
	        ContactCollection){ 
	   
	   var SocialRouter = Backbone.Router.extend({

	       currentView: null, 

	       /** 
		* Note: 
		* -----
		* Implements a global event dispatcher. Creates
		* a socketEvents property owned by the router (extends
		* the Backbone.Events object). This creates a standalone
		* event object (not attached to a particular model or view)
		* which can be used independently of views.
		*/ 

	       socketEvents: _.extend({}, Backbone.Events), 
	       
	       routes: { 
		   'addcontact': 'addcontact', 
		   'index': 'index', 
		   'login': 'login', 
		   'register': 'register', 
		   'forgotPassword': 'forgotPassword', 
		   'profile/:id': 'profile', 
		   'contacts/:id': 'contacts'
	       }, 

	       /** 
		* Method: changeView
		* ------------------
		* Does the actual work of displaying each view by calling
		* its render function. When a view is changed, the old view
		* is told to stop listening to web page events through
		* undelegateEvents
		*/ 

	       changeView: function(view){

		   // make sure the old view stops listening for events
		   if( null != this.currentView ){
		       this.currentView.undelegateEvents(); 
		   }
		   this.currentView = view;
		   this.currentView.render(); 
	       }, 


	       /** 
		* index: 
		* ------
		* index is response for handling the activity list
		* so a StatusCollection is created and passed into
		* the new IndexView object. 
		*/

	       index: function(){ 
		   console.log('~/public/js/router.js | index triggered'); 

		   var statusCollection = new StatusCollection(); 
		   statusCollection.url = 'accounts/me/activity'; 
		   
		   this.changeView(new IndexView({ 
		       collection:statusCollection, 
		       socketEvents: this.socketEvents
		   }));

		   statusCollection.fetch();
	       }, 

	       /** 
		* Route: addcontact
		* -----------------
		* Triggered by ~/public/js/views/contactsView.js
		*
		* triggers the router to load and render the addcontact
		* view. 
		*/ 

	       addcontact: function(){ 
		   this.changeView(new AddContactView()); 
	       }, 

	       /**
		* Note: 
		* -----
		* the socketEvents object is passed into the login view 
		* when the login route is activated. This causes the socketEvents
		* object to appear in the view's initialization objects which we
		* will now trap inside the view. 
		*/ 
	       

	       login: function(){
		   console.log("~/public/js/router.js | login "); 

		   this.changeView(new LoginView({socketEvents: this.socketEvents})); 
	       }, 

	       forgotPassword: function(){ 
		   this.changeView(new ForgotPasswordView()); 
	       }, 
	       
	       register: function(){
		   this.changeView(new RegisterView()); 
	       }, 

	       profile: function(id){
		   var model = new Account({id:id}); 
		   this.changeView(new ProfileView({model:model, 
						   socketEvents: this.socketEvents})); 
		   model.fetch(); 
	       }, 

	       contacts: function(id){
		   console.log("~/public/js/router.js | contacts triggered | rendering ContactsView"); 

		   var contactId = id ? id : 'me'; 
		   var contactsCollection = new ContactCollection(); 
	
		   contactsCollection.url = '/accounts/' + contactId + '/contacts'; 
		   this.changeView( new ContactsView( {collection: contactsCollection} )); 
		   contactsCollection.fetch(); 
	       }
        }); 
	  
	return new SocialRouter(); 
}); 
	     

