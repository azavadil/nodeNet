/** 
 * Note: 
 * -----
 * Creates the contact model which Backbone will use to populate 
 * the contact list. The database model doesn't have a distinct
 * Contact entity. Each contact list is embedded in the user 
 * account record. 
 * 
 * To make it easier to work with contacts we can use a 
 * logical model, Contact, to house all of the information
 * contained in the account's contact list. This lets us 
 * manipulate all of the contacts as if they were real 
 * database objects while Backbone takes care of the actual
 * reading, writing, updating work. 
 */ 
    

define(function(require){ 
    var Contact = Backbone.Model.extend({
	}); 
    return Contact; 
}); 
