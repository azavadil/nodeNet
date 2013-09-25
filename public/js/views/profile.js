/** 
 * Class: profileView.js
 * ---------------------
 * Responsible for displaying a single profile on 
 * the screen. The view listens for changes in the 
 * underlying account model. The first change will
 * happen when the model is first loaded
 */ 


define(['SocialNetView', 
	'text!templates/profile.html', 
	'text!templates/status.html', 
	'models/Status', 
	'views/status'], 
       function(SocialNetView, profileTemplate, statusTemplate, Status, StatusView){
	   
	   var profileView = SocialNetView.extend({
	
	       el: $('#content'), 

	       /** 
		* Note: 
		* -----
		* The events object contains all of the web browser events that
		* Backbone should be listening to. Notice the underlying data 
		* model has a change event still being defined in the view's
		* initialize function rather than in the events object. This is
		* because the events object refers to DOM events in the web browser
		* whereas the mode.bind function works on the model object. In other
		* words the model 'change' event isn't a real event in a web browser 
		* sense. 
		*/ 
	       

	       events: { 
		   "submit form": "postStatus"
	       }, 

	       /** 
		* Method: initialize
		* ------------------
		* calls the bind method on the model. 
		* @param1:    'change' means the action will occur whenever
		*             any changes occur to the model. 
		* @param2:    this.render is the function that will execute
		*             every time the model changes
		* @param3:    this refers to the view
		*/ 
	       
	       initialize: function(){
		   
		   this.socketEvents = options.socketEvents; 
		   this.model.bind('change', this.render, this); 
	       }, 


	       /**
		* Method: postStatus
		* ------------------
		* Does the work of sending the user's status updates to 
		* the backend server. The function returns false in order 
		* to prevent the form from performing its default POST 
		* behavior (refreshing the page). We want to update the 
		* page in place.  
		* 
		* The first thing to do is make a reference to the view object
		* (this), in this case using a variable named that. Does so is 
		* important because when the form post success callback is reached
		* the variable 'this' will reference the form rather than the view. 
		* Defining the 'that' variable gives you access to the view object
		* and it's prependStatus function
		*/ 

	       postStatus: function(){
		   var that = this; 
		   var statusText = $('input[name=status]').val();
		   var statusCollection = this.collection; 
		   
		   $.post('/accounts/' + this.model.get('_id') + '/status', {
		       status: statusText
		   }); 
		   return false; 
	       }, 
	       

	       onSocketStatusAdded: function( data ) { 
		   var newStatus = data.data; 
		   this.prependStatus( new Status({status: newStatus.status, name: newStatus.name}))
	       }, 


	       prependStatus: function(statusModel){ 
		   console.log('prependStatus triggered'); 

		   var statusHtml = (new StatusView({model:statusModel})).render().el; 
		   $(statusHtml).prependTo('.status_list').hide().fadeIn('slow'); 
	       }, 

 
	       /** 
		* Method: render
		* --------------
		* the model is converted to JSON and passed along with 
		* the view's HTML template to underscores ._template function
		*/ 
	       
	       render: function(){

		   if ( this.model.get('_id') ) { 
		       this.socketEvents.bind('status:' + this.model.get('_id'), this.onSocketStatusAdded, this ); 
		   }
		   
		   var that = this; 
		   this.$el.html(
		       _.template(profileTemplate, this.model.toJSON())
		   ); 
		   
		   var statusCollection = this.model.get('status'); 
		   if ( null != statusCollection ){ 
		       _.each(statusCollection, function ( statusJson ) { 
			   var statusModel = new Status( statusJson ); 
			   that.prependStatus( statusModel ); 
		       }); 
		   }
	       }
	   }); 
	   
	   return profileView; 
}); 
