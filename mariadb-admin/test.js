var TestRunner = require('assert-runner'),
assert = require('assert'),
renderAsync = require('render-async'),
renderFile = renderAsync.__express,
jQuery = require('js-toolbox')._jQuery;

//now we need a server for this so that we can test include
var app= renderAsync.express();
app.set('views', __dirname + '/editarea_0_8_2');

var tests = {
	"Test of nothing": function(){
		assert(true == true);
		
	},
	"Test of mysql2": function(done){
		var mysql      = require('mysql2');
		var connection = mysql.createConnection({ user: 'root', database: 'test2'});

		connection.query('SELECT * FROM test2', function(err, rows) {
		  //now we want the rows
			console.log(rows);
			done();
		});
	}

};


//server everything index.html welcome file
app.use(renderAsync.webServer);


//set ipaddress from openshift, to command line or to localhost:8080
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;

//start the server listening for requests
app.listen(port, ipaddr);

new TestRunner(tests).again(0);
