/** 
 * Note: 
 * -----
 * the indexView extends a plain Backbone view and renders text into the HTML
 * element tagged with the content identifier (~/views/index.jade). 
 */



define(['SocialNetView', 
	'text!templates/index.html', 
        'views/statusView', 
        'models/Status'], 
       function(SocialNetView, 
		indexTemplate, 
	        StatusView, 
	        Status){
   
	   var indexView = Backbone.View.extend({
	       
	       el: $('#content'),    //~/views/index.jade

	       events:{ 
		   'submit form': 'updateStatus'
	       }, 
	       
	       initialize: function(){ 
		   this.collection.on('add', this.onStatusAdded, this); 
		   this.collection.on('reset', this.onStatusCollectionReset, this); 
	       }, 

	       onStatusCollectionReset: function(collection){
		   var that = this; 
		   collection.each(function(model){ 
		       that.onStatusAdded(model); 
		   }); 
	       }, 

	       onStatusAdded: function(status){
		   var statusHtml = (new StatusView({model:status})).render().el; 
		   $(statusHtml).prependTo('.status_list').hide().fadeIn('slow'); 
	       }, 

	       updateStatus: function(){
		   console.log("Update status triggered"); 
		   var statusText = $('input[name=status]').val(); 
		   var statusCollection = this.collection; 
		   $.post('/accounts/me/status', { 
		       status: statusText
		   }, function(data) { 
		       statusCollection.add(new Status({status:statusText})); 
		   }); 
		   return false; 
	       }, 

	       render: function(){
		   this.$el.html(indexTemplate); 
	       }
    }); 

    return indexView; 
}); 

