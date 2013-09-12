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


	       login: function(){
		   this.changeView(new LoginView()); 
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
	     

