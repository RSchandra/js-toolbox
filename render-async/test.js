var TestRunner = require('assert-runner'),
assert = require('assert'),
renderFile = require('./render-async.js').__express;

var tests = {
	"Test hello": function(done){
		renderFile(__dirname + '/examples/hello.js.html', {name: "Rich"}, function(err, html){
			assert(err == null);
			assert(html == '<!DOCTYPE html><html lang="en"><body>hello Rich</body></html>');
			done();
		});
		
	}		
};

new TestRunner(tests).again(0);