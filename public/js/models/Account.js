/** 
 * Backbone model
 * --------------
 * All the account data is defined server-side by 
 * Express and MongoDB. All Backbone does is read 
 * display the stored information. 
 * 
 * When you define a model in Backbone, your are 
 * really just defining the route to pull the account
 * down from the server by providing a urlRoot
 */




define(['models/StatusCollection'], function(StatusCollection){
    var Account = Backbone.Model.extend({
	urlRoot: '/accounts', 

	initialize: function(){ 
	    this.status = new StatusCollection(); 
	    this.status.url = '/acccounts/' + this.id + '/status'; 
	    this.activity = new StatusCollection(); 
	    this.activity.url = '/accounts/' + this.id + '/activity'; 
	} 
    }); 

    return Account; 
}); 

