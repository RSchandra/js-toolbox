var TestRunner = require('assert-runner'),
assert = require('assert'),
renderFile = require('./render-async.js').__express,
express = require('express');

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
		
	},		
	"Test nested include": function(done){
		renderFile(__dirname + '/examples/nestedinclude.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from _nestedincluded.js.html <div><p>Rob was here and Rich was here</p></div></body></html>');
			done();
		});
	},		
	"Test layout": function(done){
		renderFile(__dirname + '/examples/layout.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><html><body><p>Rich was Here</p></body></html>');
			done();
		});
		
	},
	"Test external include": function(done){
		renderFile(__dirname + '/examples/ajaxinclude.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from http://localhost:8080/test <p>Hello World!</p></body></html>');
			done();
		});
	},
	"Test partial": function(done){
		renderFile(__dirname + '/examples/partialouter.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<ul><li>1</li><li>2</li></ul>');
			done();
		});
		
	}
};

// now we need a server for this so that we can test include
var app=express();

app.get("/test", function(req, res){
    res.setHeader("Content-Type", "text/html");
    res.end("Hello World!");
});

//server everything index.html welcome file
app.use(function(req, res){
        res.sendfile(__dirname + req._parsedUrl.path, function(err){
                if(err){
                        console.log(err);
                        res.send(err.status, err.code);
                }
        });
});


//set ipaddress from openshift, to command line or to localhost:8080
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;

//start the server listening for requests
app.listen(port, ipaddr);

new TestRunner(tests).again(0);