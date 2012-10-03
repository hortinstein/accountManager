var utility = require("./utility.js"); //store for functions not in the standard template

try { var config = require('./../../config.json');} //loads the config file
catch (err) {console.log("...accountManager.js: no config" );};

var DB = {}; //object to export that will contain all of the templated functions 

DB.nano = require('nano')(config.couch_host)
  , username = config.couch_user
  , userpass = config.couch_pass
  , callback = console.log // this would normally be some callback
  , cookies  = {}; // store cookies, normally redis or something
module.exports = DB;



DB.update = function  (newData,callback) {
	var client = DB.nano.use(config.database_name); //sets it to the right database
	if (newData.username === null){
		callback('no username');
	}
	client.get(newData.username, function (e,r) {
		if(e) {
	    	callback(e.error);
	    }
	    for (var attrname in newData) { 
	    	r[attrname] = newData[attrname]; 
	    }
	    client.insert(r, r.username, function (e, r) {
    		if(e) {
    			callback(e);
    		} else {
    			callback(null,r); //success!
    		}
		});
	});
}



DB.insert = function  (record,callback) {
	var client = DB.nano.use(config.database_name); //sets it to the right database
	client.insert(record, record.username, function(e, body){
		if (e) { //if error means document already exists in database
			//console.log('...stuffInACouch.js: username already exists', e.message);
			callback(e,'record_exists');
		} else {
			//console.log('...stuffInACouch.js: ', record.username, 'successfully created'); //success!
			callback(null,'ok');
		}
	});
}

//getByUsername
//in: username, callback 
DB.getByUsername = function  (username, callback) {
	var client = DB.nano.use(config.database_name); //sets it to the right database
	
	client.get(username, function (e,r) {
		if (e){
			//console.log('...stuffInACouch.js: account ',e.error);
			callback(e.error,null);
		}
		else{
			//console.log('...stuffInACouch.js: account found');
			callback(null,r);
		}
	});
}

//getByEmail
//in: username, callback 
DB.getByEmail = function  (email, callback) {
	var client = DB.nano.use(config.database_name); //sets it to the right database
	
	client.view('userAccount','email', {key: email}, function(e, r){ //checks to see if email is already registered
		if (r === null)
		{
			callback(e, null);
		}
		else if((r.rows).length === 0) //email already exists
		{
			callback(null,null);
		}
		else //email already exists
		{
			var id = r.rows[0].id;
			DB.getByUsername(id,callback);
		};
	});
}

//sets up the Db 
DB.buildDB = function(callback) {
	DB.nano.db.create(config.database_name, function(err, body) {
		var client = DB.nano.use(config.database_name); //sets it to the right database
		if (err) {
			//console.log('...stuffInACouch: database already created! ' + err);
			utility.buildViews(client);
			callback(null);
		}
		else {
			//console.log('...stuffInACouch: created database, loading views');
			utility.buildViews(client);
			callback(null);
		}
	});
}
//destroy the DB created by accountManager
DB.destroyDB = function(callback) { //because some men just want to watch the world burn
	DB.nano.db.destroy(config.database_name, function(err, body) {
		if (err) {
			//console.log('...stuffInACouch: database not destroyed!' + err);
			callback(err);
		}
		else {
			//console.log('...stuffInACouch: destroyed database');
			callback(null);
		}
	});
};