/**
 * Note: 
 * -----
 * The bootstrapper is performing 2 tasks. First it is 
 * defining the paths to all of the dependencies used
 * by the application. Second it is initializing and 
 * launching the user interface
 */ 


require.config({
    paths: { 
	jQuery: '/js/libs/jquery', 
	Underscore: '/js/libs/underscore', 
	Backbone: '/js/libs/backbone', 
	Sockets: '/socket.io/socket.io', 
	models: 'models', 
	text: '/js/libs/text', 
	templates: '../templates', 
	
	SocialNetView: '/js/SocialNetView'
    }, 

    shim: { 
	'Backbone': ['Underscore', 'jQuery'], 
	'SocialNet': ['Backbone']
    }
}); 

require(['SocialNet'], function(SocialNet){
    SocialNet.initialize(); 
}); 

