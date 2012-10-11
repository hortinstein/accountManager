var utils = {}; //object to export that will contain all of the templated functions 
module.exports = utils;


utils.dbAuth = function(){ 
	redisClient.auth(config.nodejitsu_redis_pass, function() {
	    //console.log("Connected!");
	});
};