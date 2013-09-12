define(['models/Status'], function(Status){

    /** 
     * Note: 
     * -----
     * In Backbone collections the model variable is used 
     * to specify the class type contained in the collection. 
     * The collection here will include objects of Status type
     *
     * Collections do not include a urlRoot. When Backbone needs
     * to load a list of collections, it does so based on the 
     * urlRoot of the underlying object model
     *
     * when you instantiate the collection you can set its 
     * urlRoot
     */ 



    var StatusCollection = Backbone.Collection.extend({
	model:Status
    }); 
    
    return StatusCollection; 
}); 
