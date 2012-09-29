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



DB.update = function  (record,callback) {
	client = DB.nano.use(config.database_name); //sets it to the right database
	client.get(record.username, function (e,r) {
		if(e) {
	    	callback(e.error);
	    	return;
	    }
	    record.pass == '' ? r.pass = r.pass : r.pass = record.pass; // if it is given '' ignore the changes
		r.email = record.email;
	    //record._rev = r.rev;//adds revision so it can be inserted into couch
	    client.insert(r, r.username, r.rev, function (e, r) {
    		if(e) {
    			callback(e);
    		} else {
    			callback(null,'ok');
    		}
		});
	});
}



DB.insert = function  (record,callback) {
	client = DB.nano.use(config.database_name); //sets it to the right database
	client.insert(record, record.username, function(e, body){
		if (e) { //if error means document already exists in database
			//console.log('...stuffInACouch.js: username already exists', e.message);
			callback('record_exists');
		} else {
			//console.log('...stuffInACouch.js: ', record.username, 'successfully created'); //success!
			callback('ok');
		}
	});
}

//getByUsername
//in: username, callback 
DB.getByUsername = function  (username, callback) {
	client = DB.nano.use(config.database_name); //sets it to the right database
	
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
	client = DB.nano.use(config.database_name); //sets it to the right database
	
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
		client = DB.nano.use(config.database_name); //sets it to the right database
		if (err) {
			console.log('...stuffInACouch: database already created! ' + err);
			utility.buildViews(client);
		}
		else {
			console.log('...stuffInACouch: created database, loading views');
			utility.buildViews(client);
		}
	});
}
//destroy the DB created by accountManager
DB.destroyDB = function(callback) { //because some men just want to watch the world burn
	DB.nano.db.destroy(config.database_name, function(err, body) {
		if (err) {
			console.log('...stuffInACouch: database not destroyed!' + err);
		}
		else {
			console.log('...stuffInACouch: destroyed database');
		}
	});
};