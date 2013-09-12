/** 
 * Class: ContactCollection
 * ------------------------
 * A Backbone collection based on a group of contacts. 
 * The model property is a keyword from the collection 
 * prototype that has special meaning. Because Contact 
 * has been specified as the model type, Backbone understands
 * how individual elements in the collection should behave
 * and how to read/write to the database
 *
 * ContactCollection is within the context of RequireJS's 
 * define method. The class is made available to the outside 
 * world by exporting it via the return statement. Without the 
 * return statement other files will not be able to see
 * ContactCollection.
 */ 



define(['models/Contact'], function(Contact){ 
    var ContactCollection = Backbone.Collection.extend({
	model: Contact
    }); 
    
    return ContactCollection; 
}); 
