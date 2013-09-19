/** 
 * Note: 
 * -----
 * The contacts view will contain a list of users added to 
 * each users contact list. Each line item will display the 
 * contacts name, profile photo, and link to his account
 * details page
 */ 



define(['SocialNetView', 
	'views/contactView', 
	'text!templates/contacts.html'],
       function(SocialNetView, ContactView, contactsTemplate){
	   var contactsView = SocialNetView.extend({
	       el: $('#content'), 

	       initialize: function(){ 
		   this.collection.on('reset', this.renderCollection, this); 
	       }, 
	       
	       render: function(){
		   this.$el.html(contactsTemplate); 
	       }, 
	       
	       renderCollection: function(collection){ 
		   collection.each(function(contact){
		       var statusHtml = (new ContactView(
			   { removeButton: true, model: contact}
			   )).render().el; 
		       $(statusHtml).appendTo('.contacts_list'); 
		   }); 
	       }
	   }); 
	   
	   return contactsView; 
}); 


