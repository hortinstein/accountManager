var should = require('should');


databaseDriverTests = function(config) {
    var user ={ email:'rando@gmail.com', 
                username: 'rando', 
                pass: 'rabbit123'}
    var user_update ={  email:'randos@gmail.com', 
                        username: 'rando', 
                        pass: 'rabbi123'}

    switch(config.type){
        case 'couch': var DB = require('../databaseMiddleware/couchDB/stuffInACouch.js')
        break;
        case 'redis': var DB = require('../databaseMiddleware/redis/redisToBurn.js')
        break;
        case 'mongo': var DB = require('../databaseMiddleware/mongoDB/iAmAGoldenMongod.js')
        break;
        case 'riak': var DB = require('../databaseMiddleware/riak/riakTheSlit.js')
        break;
    }

	before(function(done) {
        DB.setup(config);
    	DB.buildDB(done); //builds the database
    });

    it('should be able to DB.insert', function(done){
    	DB.insert(user,done);
    });
    it('should return record_exists error if the record exists', function(done){
        DB.insert(user, function(e,r) {
            e.should.equal('record_exists');
            done();
        });
    });

    it('should be able to DB.getByUsername', function(done){
    	DB.getByUsername(user.username,function (e,r){
    		r.username.should.equal(user.username);
    		done();
    	});
    });
    it('should fail to get a user if the user is not in the database', function(done){
        DB.getByUsername("lulstar",function (e,r){
            e.should.equal('user_not_found');
            done();
        });
    });

    it('should be able to DB.getByEmail', function(done){
    	DB.getByEmail(user.email,function (e,r){
    		r.email.should.equal(user.email);
    		done();
    	});
    });
    it('should fail if trying to get an email that is not there', function(done){
        DB.getByEmail("fsdfasdf",function (e,r){
            e.should.equal('user_not_found');
            done();
        });
    });

    it('should be able to DB.update', function(done){
     	DB.update(user_update,function (e,r){
    		//r.email.should.equal(user_update.email);
    		done();
    	});
    });
    it('should fail if trying to update a user that is not there', function(done){
        DB.update({username:'hee',pass:'sd'},function (e,r){
            e.should.equal('user_not_found');
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
};
//clean up previous tests

//create database
module.export = databaseDriverTests

