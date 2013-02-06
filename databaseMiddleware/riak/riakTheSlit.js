var riak = require('riak');
var request = require('request'); //needed for delete hack

var DB = {}; //object to export that will contain all of the templated functions 
var bucketName = '';
var riakClient = '';
var riakHostString = '';

DB.setup = function(config) {
	riakHostString = [config.riak_host + ':' + config.riak_port];
	var client_id = "acctMgr-client";
	var pool_name = "acctMgr-pool";
	bucketName = config.database_name;
	riakClient = new riak(riakHostString, client_id, pool_name);
	riakClient.debug_mode = false;
}

DB.update = function(newData, callback) {
	//console.log(newData);
	riakClient.get(bucketName, newData.username, {
		'return_body': true
	}, function(e, r, o) {
		//console.log(newData.email)
		if(o) {
			var options = {
				http_headers: {
					'x-riak-index-username_bin': o.username,
					'x-riak-index-email_bin': newData.email
				}
			}
			riakClient.put(bucketName, o.username, newData, options, function(e, r, o) {
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
	riakClient.get(bucketName, record.username, {}, function(e, r, o) {
		if(!o) {
			var options = {
				http_headers: {
					'x-riak-index-username_bin': record.username,
					'x-riak-index-email_bin': record.email
				}
			}
			riakClient.put(bucketName, record.username, record, options, function(e, r, o) {
				if(e) {
					callback(e);
				} else {
					callback(null, 'ok');
				}
			});
		} else {
			callback('record_exists');
		}
	});
}

DB.getByUsername = function(username, callback) {
	riakClient.get(bucketName, username, {}, function(e, r, o) {
		if(!o) {
			callback('user_not_found');
		} else {
			callback(null, o);
		}
	});
}

DB.getByEmail = function(email, callback) {
	request.get({
		url: 'http://' + riakHostString + '/buckets/' + bucketName + '/index/email_bin/'+email,
		json: true
	}, function(e, r, b) {
		//console.log(e,b.keys)
		if(b.keys[0] === undefined ){
			callback('user_not_found',null);
		} else if (e) {
			callback('user_not_found',null);
		} else{
			DB.getByUsername(b.keys[0],callback);	
		}
	});
}

//sets up the Db 
DB.buildDB = function(callback) {
	callback();
}

//destroy the DB created by accountManager
DB.destroyDB = function(callback) { //because some men just want to watch the world burn
	request.get({
		url: 'http://' + riakHostString + '/buckets/' + bucketName + '/keys?keys=true',
		json: true
	}, function(e, r, b) {
		for(var key in b.keys) {
			//console.log(b.keys[key]);
			riakClient.del(bucketName, b.keys[key], function() {
				callback();
			});
		};
	})
};

module.exports = DB;
