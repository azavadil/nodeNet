/** 
 * Note: 
 * -----
 * The first thing the application needs to do 
 * is make an AJAX request to the Node backend server. 
 * Node verifies that the current session, identified
 * by a session ID in the request header - is linked with 
 * a valid access token.
 * 
 * checkLogin(runApplication) worked together to do the following
 * runApplication is the callback to checkLogin. If the user is 
 * logged in, then runApplication is called with true. Otherwise
 * runApplication is called with false. 
 * 
 * If called with true, runApplication directs to ~/#index
 * If called with false, runApplication directs to ~/#login
 */ 







define(['router', 'SocialNetSockets'], function(router, socket){ 
    var initialize = function(){
	socket.initialize(router.socketEvents); 
	checkLogin(runApplication); 
    };

    var checkLogin = function(callback){
	$.ajax('/account/authenticated', { 
	    method:'GET', 
	    success: function(){
		return callback(true); 
	    }, 
	    error: function(data){
		return callback(false); 
	    }
	}); 
    }; 

    var runApplication = function(authenticated){
	if( authenticated ){
	    router.socketEvents.trigger('app:loggedin'); 
	    window.location.hash = 'index';   //send to ~/#login
	} else { 
	    window.location.hash = 'login';   //send to ~/#index
	}
	Backbone.history.start(); 
    };

    return { 
	initialize: initialize
    }; 
}); 
   





