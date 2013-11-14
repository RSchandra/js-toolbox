var TestRunner = require('assert-runner'),
assert = require('assert'),
renderFile = require('./render-async.js').__express;

var tests = {
	"Test hello": function(done){
		renderFile(__dirname + '/examples/hello.js.html', {first: "Rich", last: "Hildred"}, function(err, html){
			assert(err == null);
			assert(html == '<!DOCTYPE html><html lang="en"><body>hello Rich Hildred</body></html>');
			done();
		});
		
	},
	"Test include": function(done){
		renderFile(__dirname + '/examples/include.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from _included.js.html <p>Rich was here</p></body></html>');
			done();
		});
		
	}		
};

new TestRunner(tests).again(0);