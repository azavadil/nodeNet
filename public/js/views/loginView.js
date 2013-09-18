define(['SocialNetView', 
	'text!templates/login.html'], function( SocialNetView, loginTemplate ) { 
    var loginView = SocialNetView.extend({

	requireLogin: false, 

	el: $('#content'), 
	
	events: { 
	    'submit form': 'login'
	}, 

	/** 
	 * Note: 
	 * -----
	 * ties to router.js/login
	 * When the view is first created we extract 
	 * the socketEvents from the options object
	 * and assign to the view's socketEvents. 
	 *
	 * The view.socketEvent is used in the 
	 * view.login below
	 */ 

	initialize: function( options ) { 
	    this.socketEvents = options.socketEvents; 
	}, 



	/** 
	 * Note: 
	 * -----
	 * when the user has a successful login attempt
	 * the view will trigger an app:loggedin event with
	 * the socketEvent bound in initialize.
	 * 
	 * When performing a POST callback the socketEventss
	 * was put in a local variable because the callback will
	 * not have access to the view using the keyword this. 
	 * So the socketEvents property is referenced in a variable
	 * inside the login function so it is available in the callback. 
	 */ 

	login: function(){ 
	    var socketEvents = this.socketEvents; 
	    $.post('/login',  
		this.$('form').serialize(), function( data ) { 
		    socketEvents.trigger('app:loggedin'); 
		    window.location.hash = 'index'; 
 		}).error( function() { 
		    $('#error').text('Unable to login.'); 
		    $('#error').slideDown(); 
		}); 
	    
		return false; 
	}, 

	render: function(){ 
	    this.$el.html( loginTemplate ); 
	    $('#error').hide();
	    $('input[name=email]').focus(); 
	}
    }); 
    
    return loginView; 
}); 
