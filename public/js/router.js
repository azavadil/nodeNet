define(['views/indexView', 
	'views/registerView', 
	'views/loginView', 
	'views/forgotPasswordView',
	'views/profileView', 
	'views/contactsView', 
	'views/addcontactView', 
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
		   var statusCollection = new StatusCollection(); 
		   statusCollection.url = 'accounts/me/activity'; 
		   
		   this.changeView(new IndexView({ 
		       collection:statusCollection
		   }));

		   statusCollection.fetch();
	       }, 

	       addcontact: function(){ 
		   this.changeView(new LoginView()); 
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
		   this.changeView(new ProfileView({model:model})); 
		   model.fetch(); 
	       }, 

	       contacts: function(id){
		   var contactId = id ? id : 'me'; 
		   var contactsCollection = new ContactCollection(); 
		   contactsCollection.url = '/accounts/' + contactId + 'contacts'; 
		   this.changeView( new ContactsView({
		       collection: contactsCollection 
		   })); 
		   contactsCollection.fetch(); 
	       }
        }); 
	  
	return new SocialRouter(); 
}); 
	     

