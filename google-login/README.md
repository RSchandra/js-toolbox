google-login Node Module
=======================

This is a npm module that gets a CurrentUser session based on a login to Google. I struggled with just using a plain jQuery.ajax style interface to this and ended up using `googleapis` interface instead.

	...,
	GoogleLogin = require('google-login');
	...
	app.use(express.bodyParser());
	// these must be in this order
	app.use(express.cookieParser());
	app.use(express.session({secret:uuid.v4()}));
	app.use(app.router);
	
	var oGoogleLogin = new GoogleLogin();
	// `/login` is the place to login
	app.get('/login', jQuery.proxy(oGoogleLogin.login, oGoogleLogin));
	//don't need to proxy this because the currentUser is in the session 
	app.get('/currentUser', oGoogleLogin.currentUser);

