var bcrypt = require('bcrypt');
var should = require('should');

var AMtests = require('./accountManagerTests.js');
var DBtests = require('./databaseTest.js');

var AM = require('../accountManager.js'); //runs through the database tests



////////////////////////////////////////////////////
//
//      redis tests
//
////////////////////////////////////////////////////
 // try { config = require('./redis_test_config.json');} //load config from root dir 
 // catch (err) {console.log("...test: no redis_test_config.js",err );};

 // describe('REDIS: accountManager tests:', AMtests);
 // describe('REDIS: database middleware tests:', DBtests);

////////////////////////////////////////////////////
//
//      couch tests
//
////////////////////////////////////////////////////
// try { config = require('./couch_test_config.json');} //load config from root dir 
// catch (err) {console.log("...test: no couch_test_config.js",err );};

// describe('COUCH: accountManager tests:', AMtests);
// describe('COUCH: database middleware tests:', DBtests);

////////////////////////////////////////////////////
//
//      riak tests
//
////////////////////////////////////////////////////
//try { config = require('./riak_test_config.json');} //load config from root dir 
//catch (err) {console.log("...test: no riak_test_config.js",err );};

//describe('RIAK: accountManager tests:', AMtests);
//describe('RIAK: database middleware tests:', DBtests);