var Toolbox = require('js-toolbox');

var TestRequest = Toolbox.Base.extend({
	session: {},
	protocol: "http",
	url: "/login",
	constructor: function(){
		this.session.profile = {}
		this.session.profile.id = "110056483553960735640";
		return this;
	},
	get: function(){
		return("localhost:8080");
	}
});

module.exports = TestRequest;

