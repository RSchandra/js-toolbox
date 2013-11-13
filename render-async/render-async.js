var Toolbox = require('js-toolbox'),
_extend = require('extend');


var RenderAsync = Toolbox.Base.extend({
	sHtml: "",
	constructor: function(){
		return this;
	},
	processFile: function(path, options, callback){
		try{
			var sBuf = '<!DOCTYPE html><html lang="en"><body>hello <%= first %> <%= last %></body></html>';
			var aKeys = sBuf.split("<%");
			for(var i = 0; i < aKeys.length; i++){
				if(aKeys[i].indexOf('%>') != -1){
					debugger;
					var aTemp = aKeys[i].split('%>');
					aKeys[i] = "~~" + aTemp[0];
					aKeys.splice(i+1, 0, aTemp[1]);
				}
			}
			debugger;
			console.log(aKeys);
			var processToken = function(nIndex){
			    if (nIndex < aKeys.length){
			    	if(aKeys[])
			        var fn = this.oTests[this.aKeys[i]];
		        	var self = this;
		            fn (function (){
		                console.log("Passed Test: \"" + self.aKeys[i] + "\" " + ++i + " of " + self.aKeys.length);
		                self.again (i);
		            });
			    }else{
			    	if(typeof callback != 'undefined') callback(null, this.sHtml);
			    }

			};
			if(typeof options == 'undefined') options = {};
			var oOptions = {};
			_extend(oOptions, options);
						
		}
		catch(err){
			if(typeof callback != 'undefined') callback(err, this.sHtml);
		}
	}

});

module.exports = RenderAsync;

module.exports.__express = function(path, options, callback){
	debugger;
	var oRenderAsync = new RenderAsync();
	oRenderAsync.processFile(path, options, function(err, html){
		if(typeof callback != 'undefined') callback(err, html);
	});
	
};