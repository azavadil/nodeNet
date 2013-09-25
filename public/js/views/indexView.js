/** 
 * Note: 
 * -----
 * the indexView extends a plain Backbone view and renders text into the HTML
 * element tagged with the content identifier (~/views/index.jade). 
 * 
 * This view will accept form input from the user. 
 * 
 * The collection object is an instance of StatusCollection that
 * extends the Backbone.Collection object. During the view's initialization
 * the collection' add event is bound to the onStatusAdded fucntion whose
 * job is to create an HTML representation of the status and prepend it to the 
 * list of statuses which have already been rendered
 * 
 * The page loads with the statuses already in place.
 */



define(['SocialNetView', 
	'text!templates/index.html', 
        'views/statusView', 
        'models/Status'], 
       function(SocialNetView, 
		indexTemplate, 
	        StatusView, 
	        Status){
   
	   var indexView = SocialNetView.extend({
	       
	       el: $('#content'),    //~/views/index.jade

	       events:{ 
		   'submit form': 'updateStatus'
	       }, 
	       
	       initialize: function( options ){ 
		   console.log("~/public/js/views/indexView.js | initialize triggered"); 
		   
		   options.socketEvents.bind('status:me', this.onSocketStatusAdded, this); 
		   this.collection.on('add', this.onStatusAdded, this); 
		   this.collection.on('reset', this.onStatusCollectionReset, this); 
	       }, 


	       onSocketStatusAdded: function( data ){

		   var newStatus = data.data; 
		   var found = false; 

		   this.collection.forEach(function( status ){ 
		       var name = status.get('name'); 

		       if( name && name.full == newStatus.name.full && status.get('status') == newStatus.status ) {
			   found = true; 
		       }
		   });
		   
		   if( !found ){ 
		       this.collection.add( new Status({status:newStatus.status, name: newStatus.name}));
		   }
	       }, 

	       onStatusCollectionReset: function(collection){
		   var that = this; 
		   collection.each(function(model){ 
		       that.onStatusAdded(model); 
		   }); 
	       }, 

	       /** 
		* Function: onStatusAdded
		* -----------------------
		* .status_list found in ~/public/templates/index.html
		* onStatusAdded function looks forward into the future 
		* when the web browser receive async updates from the 
		* server about friend changes. onStatusAdded will cause
		* those updates to animate onto the screen immediately
		*/ 

	       onStatusAdded: function(status){
		   console.log("~/public/js/views/indexView.js | onStatusAdded triggered"); 
		
		   var statusHtml = (new StatusView({model:status})).render().el; 
		   $(statusHtml).prependTo('.status_list').hide().fadeIn('slow'); 
	       }, 


	       /** 
		* Function: updateStatus
		* ----------------------
		* The updateStatus function collects the information 
		* supplied by the user, posts it to the Express backend, 
		* generates a new status object, and adds the object to 
		* the view's collection object
		*/ 

	       updateStatus: function(){
		   console.log("~/public/js/views/indexView.js | updateStatus triggered"); 

		   var statusText = $('input[name=status]').val(); 
		   var statusCollection = this.collection; 
		   $.post('/accounts/me/status', { 
		       status: statusText
		   }); 
		   return false; 
	       }, 

	       render: function(){
		   this.$el.html(indexTemplate); 
	       }
    }); 

    return indexView; 
}); 

