/** 
 * Class: registerView
 * -------------------
 * The registerView class takes data submitted by the user
 * and posts it to the backend server. The register function
 * returns false in order to disable the default form functionality 
 * which would trigger a page reload. A reload is not required 
 * because the server communication has been handled behind the 
 * scenes
 */ 



define(['SocialNetView', 
	'text!templates/register.html'], 
       function(SocialNetView, registerTemplate){ 
	   var registerView = SocialNetView.extend({
	       
	       requireLogin: false, 

	       
	       el: $('#content'),  
	
	       events: { 
		   'submit form': 'register'
	       }, 

	       register:function(){ 
		   $.post('/register', { 
		       firstName: $('input[name=firstName]').val(), 
		       lastName: $('input[name=lastName]').val(), 
		       email:$('input[name=email]').val(), 
		       password:$('input[name=password]').val(), 
		   }, function(data){
		       console.log(data); 
		   }); 
		   
		   return false; 
	       }, 

	       render: function(){ 
		   this.$el.html( registerTemplate ); 
	       }
	   }); 
	       
	   return registerView; 
}); 
