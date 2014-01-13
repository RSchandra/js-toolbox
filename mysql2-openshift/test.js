var TestRunner = require('assert-runner'),
assert = require('assert'),
mysql = require('./mysql2-openshift.js');

var tests = {
	"trivial test": function(){
		assert(true == true);
	},
	"connect to db": function(done){
		var oConnection = mysql.createConnection({
			user: 'root',
			database: 'information_schema'
		});
		assert(oConnection != null);
		var sSQL = "SELECT * FROM SCHEMATA";
		oConnection.query(sSQL, function(err, rows) {
			if (err && done)
				done(err);
			// now we want the rows
			assert(rows.length);
			done();
		});

	}
};



new TestRunner(tests).again(0);
