
require('./databaseTest.js'); //runs through the database tests
tests = require('./accountManagerTests.js')

try { var redis_config = require('./redis_test_config.json');} //load config from root dir 
catch (err) {console.log("...test: no redis_test_config.js",err );};


describe('accountManager Tests:', tests(redis_config));

//describe('accountManager Tests:', tester(couch_config));