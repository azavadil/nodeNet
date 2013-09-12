

module.expores= { 
    service: "SendGrid", 
    host: "smtp.sendgrid.net", 
    port: 587, 
    secureConnection: false, 
    
    auth: { 
	user: "myusername", 
	pass: "mypassword"
    }, 
    ignoreTLS: false, 
    debug: false, 
    maxConnections: 5
}

