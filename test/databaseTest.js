var should = require('should');

try { var config = require('./test_config.json');} //load config from root dir 
catch (err) {console.log("...test: no test_config.js",err );};



switch(config.type){
	case 'couch': var DB = require('../databaseMiddleware/couchDB/stuffInACouch.js')
	break;
	case 'redis': var DB = require('../databaseMiddleware/redis/redisToBurn.js')
	break;
	case 'mongo': var DB = require('../databaseMiddleware/mongoDB/iAmAGoldenMongod.js')
	break;
	case 'riak': var DB = require('../databaseMiddleware/riak/riakTheBoat.js')
	break;
}

var user ={	email:'rando@gmail.com', 
			username: 'rando', 
			pass: 'rabbit123'}
var user_update ={	email:'randos@gmail.com', 
					username: 'rando', 
					pass: 'rabbi123'}
describe('Database Driver tests:', function() {
	before(function(done) {
        DB.setup(config);
    	DB.buildDB(done); //builds the database
    });

    it('should be able to DB.insert', function(done){
    	DB.insert(user,done);
    });

    it('should be able to DB.getByUsername', function(done){
    	DB.getByUsername(user.username,function (e,r){
    		r.username.should.equal(user.username);
    		done();
    	});
    });

    it('should be able to DB.getByEmail', function(done){
    	DB.getByEmail(user.email,function (e,r){
    		r.email.should.equal(user.email);
    		done();
    	});
    });

    it('should be able to DB.update', function(done){
     	DB.update(user_update,function (e,r){
    		//r.email.should.equal(user_update.email);
    		done();
    	});
    });

    it('should be able to DB.getByEmail with the new email', function(done){
    	DB.getByEmail(user_update.email,function (e,r){
            r.email.should.equal(user_update.email);
    		done();
    	});
    });

	 after(function(done) {
     	DB.destroyDB(done); //destroys the database
     });
});
//clean up previous tests

//create database


