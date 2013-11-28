var Toolbox = require('js-toolbox').Toolbox;

var TestResponse = Toolbox.Base.extend({
	sHead: "",
	sBody: "",
	constructor: function(){
		return this;
	},
	end: function(sOut){
		this.sBody += sOut;
	},
	send: function(nCode, sStatus){
		this.sBody += nCode + " " + sStatus; 
	},
	writeHead: function(nStatus, oHeader){
		this.sHead = nStatus + " "; 
		 for (var propertyName in oHeader) {
			    this.sHead += propertyName + " : " + oHeader[propertyName];
		}
	}	
});

module.exports.TestResponse = TestResponse;
