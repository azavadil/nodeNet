/** 
 * Note: 
 * -----
 * The addcontact template controller renders both the initial view
 * as well as the search results. Control is passed away from the Add Contact
 * template when the user navigates. 
 */ 
 


define(['SocialNetView', 
	'models/Contact', 
	'views/contactView', 
	'text!templates/addcontact.html'], 
       function(SocialNetView, Contact, ContactView, addcontactTemplate){ 
	   var addcontactView = SocialNetView.extend({
	       el: $('#content'), 
	       

	       /**
		* Property: events
		* ----------------
		* The addcontactView's primary role is for handling search queries. The first
		* important part of this object is the events list. Backbone is being instructed
		* to call the addcontactView's search method whenever it observes a form submission. 
		*/ 

	       events: { 
		   'submit form': 'search'
	       }, 

	       /** 
		* Function: search
		* ----------------
		* The search function creates a closure for the current addcontactView
		* and performs a find command against the Node.js backend. The serialize()
		* function turns the form fields supplied by the user into a JSON array sent 
		* to the server. If Backbone receives a successful response it re-renders the
		* view along with the search results
		*/  

	       
	       search: function(){ 
		   console.log("~/public/js/views/addcontactView.js | search triggered"); 
		   var view = this; 
		   $.post('/contacts/find', 
			  this.$('form').serialize(), function(data){
			      view.render( data ); 
			  }).error(function(){ 
			      $('#results').text('No contacts found.'); 
			      $('#results').slideDown(); 
			  }); 
		   
		   return false; 
	       }, 
	       
	       render: function( resultList ){ 
		   var view =  this; 
		   this.$el.html(_.template( addcontactTemplate )); 
		   if( null != resultList ){ 
		       _.each(resultList, function( contactJson ) { 
			   var contactModel = new Contact( contactJson ); 
			   var contactHtml = (new ContactView(
			       {addButton: true, model: contactModel}
			   )).render().el; 
			   $('#results').append(contactHtml); 
		       }); 
		   }
	       }
	   }); 

	   return addcontactView; 
});  
