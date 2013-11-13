var Toolbox = require('js-toolbox'),
_extend = require('extend'),
fs = require('fs'),
jQuery = {};
jQuery.proxy = require('nodeproxy');


var RenderFileAsync = Toolbox.Base.extend({
	oOptions: {sBefore: "<%", sAfter: "%>"},
	constructor: function(path, options, callback){
		fs.readFile(path, jQuery.proxy(this.parseFile, this));
	},
	parseFile: function(){
		
	}
});

module.exports.__express = function(path, options, callback){
	new RenderFileAsync(path, options, callback);
};