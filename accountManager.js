var bcrypt = require('bcrypt')
// use moment.js for pretty date-stamping //
var moment = require('moment');

var DB = [];	
var AM = {}; 

module.exports = AM;

AM.setup = function  (config,callback) {
	switch(config.type){
		case 'couch':  DB = require('./databaseMiddleware/couchDB/stuffInACouch.js')
		break;
		case 'redis':  DB = require('./databaseMiddleware/redis/redisToBurn.js')
		break;
		case 'mongo':  DB = require('./databaseMiddleware/mongoDB/iAmAGoldenMongod.js')
		break;
		case 'riak':  DB = require('./databaseMiddleware/riak/riakTheBoat.js')
		break;
	}
	DB.setup(config)

}

// logging in //
AM.getByUsername = function  (user,callback) {
	DB.getByUsername(user,function  (e,o) {
		if (o){
			callback(null,o);
		}	else{
			callback('user_not_found');
		}

	})
}
AM.getByEmail = function  (email,callback) {
	DB.getByEmail(email,function  (e,o) {
		if (o){
			callback(null,o);
		}	else{
			callback('email_not_found');
		}

	})
}
AM.autoLogin = function(user, pass, callback)
{
	DB.getByUsername(user,function  (e,o) {
		if (o){
			o.pass === pass ? callback(null,o) : callback('invalid_password');
		}	else{
			callback('user_not_found');
		}

	})
}

AM.manualLogin = function(user, pass, callback)
{
	DB.getByUsername(user,function  (e,o) {
		if (o === null){
			callback('user_not_found');
		}	else{
			bcrypt.compare(pass, o.pass, function(e, r) {
				if (r){
					callback(null, o);
				}	else{
					callback('invalid_password');
				}
			});
		}

	})
}

AM.signup = function(newData, callback)
{
	DB.getByUsername(newData.username, function  (e,r) { //tests to see if the user is already listed in the database
		if (e === 'user_not_found'){ //username not found
			DB.getByEmail(newData.email, function (e,r){ //tests to see if the email is already in the database
				if (r === null){ //  email not found
					AM.saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						DB.insert(newData,function  (e) {
							callback(e);
						});
					});
				}
				else { 
					callback('email_taken');
				}
			});
		}
		else {
			callback('username_taken');
		}
	});
};

AM.update = function(newData, callback)
{
	if (newData.hasOwnProperty('pass')){
		AM.saltAndHash(newData.pass, function(hash){
			newData.pass = hash;
			DB.update(newData,callback);
		});
	}else{
		DB.update(newData,callback);
	}
};

AM.setPassword = function(email,newPass, callback)
{
	DB.getByEmail(email, function (e,r){ //tests to see if the email is already in the database
		if (r){ //  email not found
			AM.saltAndHash(newPass, function(hash){
				r.pass = hash;
				DB.update(r,function  (e) {
					callback(e);
				});
			});
		}
		else { 
			callback('email_not_found');
		}
	});
}

AM.validateLost = function(email, passHash, callback)
{
	DB.getByEmail(email, function (e,r){ //tests to see if the email is already in the database
		if (e){ //  email not found
			callback(e);
		}
		else { 
			r.pass === passHash ? callback(null,r) : callback("invalid");
		}
	});
}

AM.saltAndHash = function(pass, callback)
{
	 bcrypt.genSalt(10, function(err, salt) {
	 	bcrypt.hash(pass, salt, function(err, hash) {
	 		callback(hash);
	 	});
	 });
}

AM.delete = function(id, callback)
{

}

//debug fuctions

AM.buildDB = function(callback)
{
	DB.buildDB(callback)
}

AM.destroyDB = function(callback)
{
	DB.destroyDB(callback)
}
