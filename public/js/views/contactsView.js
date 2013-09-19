/** 
 * Note: 
 * -----
 * The contact list's purpose is to aggregate all of an account's contacts
 * into a single view, displaying only the most recent top leve information. 
 * 
 * The contact list is responsible for generating an overall 'container' page as
 * well as each of the 'child' elements containing contacts belonging to an
 * account. The contact page will not need to load and display a model class; 
 * this makes a collection object a perfect choice to store the models. 
 * 
 * When the contact list is found or updated, the new entry wil not be 
 * animated to the screen. Instead the entire contact list will refresh. 
 * To accomplish this the render functionn is bound to the collection's
 * reset event during the contact list's initialize routine. 
 *
 *
 *
 *The contacts view will contain a list of users added to 
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


