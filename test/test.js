var bcrypt = require('bcrypt')
var should = require('should');

require('./databaseTest.js'); //runs through the database tests


try { var config = require('./test_config.json');} //load config from root dir 
catch (err) {console.log("...test: no test_config.js",err );};


var AM = require('../accountManager.js'); //runs through the database tests

var user =          { email:'rando@gmail.com', 
                      username: 'rando', 
                      pass: 'rabbit123'     }
var user_update =   { email:'randos@gmail.com', 
                      username: 'rando', 
                      pass: 'rabbi123'      }

describe('accountManager Tests:', function() {
    before(function(done) {
        AM.setup(config);
        AM.buildDB(done); //builds the database
    });

    it('should be able to signup', function(done){
        AM.signup(user,done); //changes the user struct
    });
    it('should be able to login (manual)', function(done){
        AM.manualLogin(user.username,"rabbit123", function(e,r){
            r.email.should.equal(user.email);
            done();
        });
    });

     it('should fail to login (manual) with bad password', function(done){
        AM.manualLogin(user.username,"rsbbit123", function(e,r){
            e.should.equal('invalid_password');
            done();
        });
    });
    it('should be able to login (auto)', function(done){
        AM.autoLogin(user.username,user.pass, function(e,r){
            r.email.should.equal(user.email);
            done();
        });
    });
    it('should fail to login (auto) with bad password', function(done){
        AM.autoLogin(user.username,'user.pass', function(e,r){
            e.should.equal('invalid_password');
            done();
        });
    });
    it('should be able to update a user', function(done){
        AM.update(user_update, function(e,r){
            done();
        });
    });
    it('should be updated to new addess (checking by getting username)', function  (done) {
        AM.getByUsername(user.username, function  (e,r) {
            r.email.should.equal(user_update.email);
            done();
        });
    });
    it('should be able to retrieve by new email', function  (done) {
        AM.getByEmail(user_update.email, function  (e,r) {
            r.email.should.equal(user_update.email);
            done();
        });
    });
    it('should fail when there is a no email found', function  (done) {
        AM.getByEmail('lolrocket@faf.com', function  (e,r) {
             e.should.equal('email_not_found');
            done();
        });
    });
    it('should be able to update password', function  (done) {
        AM.setPassword(user_update.email, 'jesus', function  (e) {
            AM.manualLogin(user_update.username,'jesus', function(e,r){
                r.email.should.equal(user_update.email);
            done();
            });
        });
    });
    it('should be able to validate a password reset link', function  (done) {
        AM.getByEmail(user_update.email, function  (e,r) {
            AM.validateLost(r.email, r.pass, function  (e,r){
                r.email.should.equal(user_update.email);
                done();
            });
        });
    });
    after(function(done) {
        AM.destroyDB(done); //destroys the database
    });
});