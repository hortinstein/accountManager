var utility = require("./utility.js"); //store for functions not in the standard template
var redis = require('redis');

var DB = {}; //object to export that will contain all of the templated functions 

var userpass= '';
var username = '';
var	database_name = '';

var redisClient = '';
DB.setup = function  (config) {
	database_name = config.name;
	redisClient = redis.createClient(config.port,config.host);
	redisClient.auth(config.password, function() {
	    console.log("redisAuth Connected!");
	});
}
module.exports = DB;



DB.update = function  (newData,callback) {
	var multi = redisClient.multi();
	var recordKey = database_name+":"+newData.username;
	redisClient.exists(recordKey, function(e,r) {
		if (r){
			multi.set(database_name+":"+newData.email+"_E", newData.username);
			for (var attrname in newData) { 
			    multi.hset(database_name+":"+newData.username, attrname,newData[attrname]);
			}
			multi.exec();
			callback(null,'ok');

		} else {
			callback('user_not_found');
		}
	});
}



DB.insert = function  (record,callback) {
	var multi = redisClient.multi();
	var recordKey = database_name+":"+record.username;
	redisClient.exists(recordKey, function(e,r) {
		if (r){
			callback('record_exists');

		} else {
			multi.set(database_name+":"+record.email+"_E", record.username);
			for (var attrname in record) { 
			    multi.hset(database_name+":"+record.username, attrname,record[attrname]);
			}
			multi.exec();
			callback(null,'ok');
		}
	});
}

//getByUsername
//in: username, callback 
DB.getByUsername = function  (username, callback) {
	// var client = DB.nano.use(database_name); //sets it to the right database
	var recordKey = database_name+":"+username;
	redisClient.hgetall(recordKey,function(e,r) {
		if(r === null){
			callback('user_not_found')
		}
		else{
			callback(null,r);
		}	
	});
}

//getByEmail
//in: username, callback 
DB.getByEmail = function  (email, callback) {
// var client = DB.nano.use(database_name); //sets it to the right database
	var recordKey = database_name+":"+email+"_E";
	redisClient.get(recordKey,function(e,r) {
		recordKey = database_name+":"+r;
		if(!r){
			callback('user_not_found',null);
		}
		else{
			redisClient.hgetall(recordKey,function(e,r) {
				if(e){
					callback('user_not_found',null);
				}
				else{
					callback(null,r);
				}	
			});
		}	
	});
}

//sets up the Db 
DB.buildDB = function(callback) {
	callback(); //no bookeeping needed here
}
//destroy the DB created by accountManager
DB.destroyDB = function(callback) { //because some men just want to watch the world burn
	redisClient.keys(database_name+"*",function (err, replies) {
	    replies.forEach(function (reply, index) {
        	redisClient.del(reply.toString());
        });
        callback();
    }); // removing all keys
 
};