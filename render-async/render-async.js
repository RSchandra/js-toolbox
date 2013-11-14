var Toolbox = require('js-toolbox'),
_extend = require('extend'),
fs = require('fs'),
 _eval = require('eval'),
 path = require('path'),
jQuery = {};
jQuery.proxy = require('nodeproxy');


var RenderFileAsync = Toolbox.Base.extend({
	oOptions: {},
	aTokens: null,
	callback: null,
	sHtml: "",
	sPath: null, 
	nCur: 0,
	constructor: function(path, options, callback){
		this.sPath = path; 
		if(typeof options == 'undefined') options = {};
		if(typeof options.sBefore == 'undefined')options.sBefore = "<%";
		if(typeof options.sAfter == 'undefined')options.sAfter = "%>";
		if(typeof options.sPrint == 'undefined') options.sPrint = "=";
		_extend(this.oOptions, options);
		this.oOptions.include = jQuery.proxy(this.include, this);
		if(typeof callback != 'undefined') this.callback = callback;
		fs.readFile(path, jQuery.proxy(this.parseFile, this));
	},
	parseFile: function(err, sContents){
		if(err) this.error(err);
		this.aTokens = sContents.toString().split(this.oOptions.sBefore);
        for(var i = 0; i < this.aTokens.length; i++){
            if(this.aTokens[i].indexOf(this.oOptions.sAfter) != -1){
                var aTemp = this.aTokens[i].split(this.oOptions.sAfter);
                this.aTokens[i] = this.oOptions.sBefore + aTemp[0] + this.oOptions.sAfter;
                this.aTokens.splice(i+1, 0, aTemp[1]);
            }
        }
        this.parseToken();
	},
	parseToken: function()
	{
		if(this.nCur < this.aTokens.length){
			var sToken = this.aTokens[this.nCur];
			if(sToken.substring(0,2) == this.oOptions.sBefore){
				var sJavaScript = sToken.substring(2, sToken.length - 2);
				var nLength = this.oOptions.sPrint.length;
				var bPrinting = false;
				if(sJavaScript.substring(0, nLength) == this.oOptions.sPrint){
					bPrinting = true;
					sJavaScript = "module.exports = " + sJavaScript.substring(nLength);
				}
				var sResults = _eval(sJavaScript, this.sPath, this.oOptions, false );
				if(bPrinting){
					this.sHtml += sResults.toString();
					this.parseToken(++this.nCur);
				}
			}else{
				this.sHtml += sToken;
				this.parseToken(++this.nCur);
			}
		}else{
			if(this.callback) this.callback(null, this.sHtml);
		}
	},
	include: function(sPath){
		new RenderFileAsync(path.dirname(this.sPath) + '/' + sPath, this.oOptions, jQuery.proxy(function(err, html){
			if(err)this.error(err);
			this.sHtml += html;
			this.parseToken(++this.nCur);
		}, this));
	},
	error: function(err){
		console.log(err);
		if(this.callback) this.callback(err);
	}
});

module.exports.__express = function(path, options, callback){
	new RenderFileAsync(path, options, callback);
};