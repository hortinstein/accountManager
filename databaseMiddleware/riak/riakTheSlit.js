var utility = require("./utility.js"); //store for functions not in the standard template
var riak = require('riak');
var request = require('request');
var DB = {}; //object to export that will contain all of the templated functions 
var userpass = '';
var username = '';
var bucket_name = '';
var riakClient = '';

DB.setup = function(config) {
	var riak_host_string = [config.riak_host + ':'+ config.riak_port];
	console.log(riak_host_string);
	var client_id = "acctMgr-client";
	var pool_name = "acctMgr-pool";
	bucket_name = config.database_name;
	riakClient = new riak(riak_host_string, client_id, pool_name);
	riakClient.debug_mode = false;
}
module.exports = DB;


DB.update = function(newData, callback) {
	//console.log(newData);
	riakClient.get(bucket_name, newData.username, {}, function(e, r, o) {
		if(o) {
			var options = {
				http_headers: {
					'x-riak-index-username_bin': username,
					'x-riak-index-username_email_bin': email
				}
			}
			riakClient.put(bucket_name, newData.username, newData, options, function(e, r, o) {
				if(e) {
					callback(e);
				} else {
					callback(null, 'ok');
				}
			});
		} else {
			callback('user_not_found');
		}
	});
}



DB.insert = function(record, callback) {
	riakClient.get(bucket_name, record.username,{}, function(e, r, o) {
		console.log(e,r,o);
		if(!e) {
			callback('record_exists');
		} else {
			DB.update(record,callback);
		}

	});
}

//getByUsername
//in: username, callback 
DB.getByUsername = function(username, callback) {
	riakClient.get(bucket_name, username,{}, function(e, r, o) {
		console.log(o);
		if (e) {
			callback('user_not_found');
		} else {
			callback(null,o);
		}
	});
}

//getByEmail
//in: username, callback 
DB.getByEmail = function(email, callback) {
	// var client = DB.nano.use(database_name); //sets it to the right database
	// client.view('userAccount','email', {key: email}, function(e, r){ //checks to see if email is already registered
	// 	if (r === null || r === undefined)
	// 	{
	// 		callback('user_not_found', null);
	// 	}
	// 	else if((r.rows).length === 0) //email already exists
	// 	{
	// 		callback('user_not_found',null);
	// 	}
	// 	else //email already exists
	// 	{
	// 		var id = r.rows[0].id;
	// 		DB.getByUsername(id,callback);
	// 	};
	// });
}

//sets up the Db 
DB.buildDB = function(callback) {
	callback();
}
//destroy the DB created by accountManager
DB.destroyDB = function(callback) { //because some men just want to watch the world burn
	request.get({
		url: 'http://' + riak_host + '/buckets/' + bucket + '/keys?keys=true',
		json: true
	}, function(e, r, b) {
		for(key in b.keys) {
			client.del(bucket, b.keys[key], function() {
			});
		};
		callback();
	})
};