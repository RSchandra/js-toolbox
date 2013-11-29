var Toolbox = require('js-toolbox').Toolbox, jQuery = require('js-toolbox')._jQuery, fs = require('fs'), _eval = require('eval'), path = require('path');

var RenderFileAsync = Toolbox.Base.extend({
	oOptions : {},
	aTokens : null,
	fCallback : null,
	sHtml : "",
	sPath : null,
	nCur : 0,
	nNesting : 0,
	sLayout : null,
	constructor : function(sPath, oOptions, fCallback) {
		this.sPath = sPath;
		jQuery.extend(this.oOptions, oOptions);
		if (typeof this.oOptions == 'undefined')
			this.oOptions = {};
		if (typeof this.oOptions.locals == 'undefined')
			this.oOptions.locals = {};
		if (typeof this.oOptions.sBefore == 'undefined')
			this.oOptions.sBefore = "<%";
		if (typeof this.oOptions.sAfter == 'undefined')
			this.oOptions.sAfter = "%>";
		if (typeof this.oOptions.sPrint == 'undefined')
			this.oOptions.sPrint = "=";
		if (typeof this.oOptions.sProtocol == 'undefined')
			this.oOptions.sProtocol = "http";
		if (typeof this.oOptions.sHost == 'undefined'){
			//set ipaddress from openshift, to command line or to localhost:8080
			var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
			var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;
			this.oOptions.sHost = ipaddr + ':' + port;
		}
		this.oOptions.include = jQuery.proxy(this.include, this);
		this.oOptions.layout = jQuery.proxy(this.layout, this);
		if (typeof fCallback != 'undefined')
			this.fCallback = fCallback;
	},
	parseFile : function(err, sContents) {
		if (err)
			this.error(err);
		this.aTokens = sContents.toString().split(this.oOptions.sBefore);
		for (var i = 0; i < this.aTokens.length; i++) {
			if (this.aTokens[i].indexOf(this.oOptions.sAfter) != -1) {
				var aTemp = this.aTokens[i].split(this.oOptions.sAfter);
				this.aTokens[i] = this.oOptions.sBefore + aTemp[0]
						+ this.oOptions.sAfter;
				this.aTokens.splice(i + 1, 0, aTemp[1]);
			}
		}
		this.parseToken();
	},
	parseToken : function() {
		if (this.nCur < this.aTokens.length) {
			var sToken = this.aTokens[this.nCur];
			if (sToken.substring(0, 2) == this.oOptions.sBefore) {
				var sJavaScript = sToken.substring(2, sToken.length - 2);
				var nLength = this.oOptions.sPrint.length;
				if (sJavaScript.substring(0, nLength) == this.oOptions.sPrint) {
					sJavaScript = "module.exports="
							+ sJavaScript.substring(nLength);
					this.sHtml += _eval(sJavaScript, this.sPath, this.oOptions,
							false).toString();
				} else
					_eval(sJavaScript, this.sPath, this.oOptions, false);
				if (!this.nNesting)
					this.parseToken(++this.nCur);
			} else {
				this.sHtml += sToken;
				this.parseToken(++this.nCur);
			}
		} else {
			if (this.sLayout) {
				this.oOptions.body = this.sHtml;
				this.sHtml = "";
				var oRender = new RenderFileAsync(this.sLayout, this.oOptions, jQuery.proxy(
						function(err, html) {
							if (err)
								this.error(err);
							if (this.fCallback)
								this.fCallback(null, html);
						}, this));
				fs.readFile(this.sLayout, jQuery.proxy(oRender.parseFile, oRender));
			} else if (this.fCallback)
				this.fCallback(null, this.sHtml);
		}
	},
	include : function(sPath) {
		var sFilePath = sPath;
		var sDir = path.dirname(this.sPath.replace(__dirname, ''));
		if(sPath.indexOf('//') == -1){
			sFilePath = this.oOptions.sProtocol + '://' + this.oOptions.sHost + sDir + '/' + sPath;
		}else if(sPath.indexOf('//') == 0){
			sFilePath = this.oOptions.sProtocol + '://' + sPath;
		}
		this.nNesting++;
		var oRender = new RenderFileAsync(sDir + '/' + sPath, this.oOptions, jQuery.proxy(function(err, html) {
					if (err)
						this.error(err);
					this.sHtml += html;
					this.nNesting--;
					if (!this.nNesting)
						this.parseToken(++this.nCur);
				}, this));
		jQuery.ajax(sFilePath)
			.done(jQuery.proxy(function(html){
				this.parseFile(null,html);
			}, oRender))
			.fail(jQuery.proxy(this.error, this));
	},
	layout : function(sPath) {
		this.sLayout = path.dirname(this.sPath) + '/' + sPath;
	},
	error : function(err) {
		console.log(err);
		if (this.fCallback)
			this.fCallback(err);
	}
});

module.exports.__express = function(path, options, callback) {
	var oRender = new RenderFileAsync(path, options, callback);
	fs.readFile(path, jQuery.proxy(oRender.parseFile, oRender));
};