/** 
 * Note: 
 * -----
 * Depending on the context the contact is show, there may
 * or may not be interactions available to the user, or the 
 * may have a chanc to add or remove a contact from their list
 * The contact view delegates all of these interactions from the 
 * web browser to the backend server and updates the view inline. 
 */



define(['SocialNetView', 
	'text!templates/contact.html'], 
       function(SocialNetView, contactTemplate){ 
	   var contactView = SocialNetView.extend({
	       addButton: false, 
	       
	       removeButton: false, 
	       
	       tagName: 'li', 
	       
	       events: { 
		   "click .addbutton" : "addContact", 
		   "click .removebutton" : "removeContact"
	       }, 
	       
	       addContact: function(){ 
		   console.log("~/public/js/views/contactView.js | addContact triggered"); 
		   var $responseArea = this.$(".actionarea");
		   
		   $.post("/accounts/me/contact", 
			 {contactId: this.model.get("_id")}, 
			  function onSuccess(){
			      $responseArea.text("Contact Added");
			  }, function onError(){
			      $responseArea.text("Could not add contact"); 
			  }
			  

	/*		      
		   $.ajax({
		       url: "/accounts/me/contact", 
		       type: "POST", 
		       data: {contactId: this.model.get("_id")}, 
		       success: function (data, textStatus, jqXHR){ 
			      $responseArea.text("Contact Added"); 
		       }, 
		       error: function (jqXHR, textStatus, errorThrown){ 
			      $responseArea.text("Could not add contact"); 
		       }
	*/	       
		   ); 
	       }, 


	       /** 
		* Function: removeContact
		* ---------------------
		* Unlike the other requests sent to the server so far 
		* this event uses jQuery's .ajax method directly rather
		* than get or post. Because we want to use the HTTP verb
		* DELETE to indicate we are deleting the contact, we 
		* use .ajax which has the additional functionality. 
		*/
	       
	       removeContact: function(){ 
		   var $responseArea = this.$(".actionarea");
		   $responseArea.text('Removing contact...'); 
		   $.ajax({
		       url: "/accounts/me/contact", 
		       type: "DELETE", 
		       data: { 
			   contactId: this.model.get("accountId")
		       }}).done(function onSuccess(){
			   $responseArea.text("Contact Removed"); 
		       }).fail(function onError(){ 
			   $responseArea.text("Could not remove contact"); 
		       }); 
	       }, 

	       initialize: function() { 
		   // Set the addButton variable in case it has been added in the constructor
		   if ( this.options.addButton ){ 
		       this.addButton = this.options.addButton; 
		   }
		   
		   if( this.options.removeButton ){ 
		       this.removeButton = this.options.removeButton; 
		   }
	       }, 

	       render: function(){ 
		   $(this.el).html(_.template(contactTemplate, { 
		       model: this.model.toJSON(), 
		       addButton: this.addButton, 
		       removeButton: this.removeButton
		   })); 
		   return this; 
	       }
	   }); 
	   
	   return contactView; 
}); 
