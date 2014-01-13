var mysql = require('mysql2');

module.exports.createConnection = function(options){
	if(!options) options = {};
	if(process.env.OPENSHIFT_MYSQL_DB_HOST){
		options.user = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
		options.password = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
		options.host = process.env.OPENSHIFT_MYSQL_DB_HOST;
		options.database = process.env.OPENSHIFT_GEAR_NAME;
	}
	return mysql.createConnection(options);
};
