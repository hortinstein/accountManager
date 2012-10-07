#[accountManager.js 0.1]

#####inital release, complete with basic account management functions

####A simple module to add a simple account management API and user model to your project, with multiple databases supported: 

accountManager.js
* couchDB (working)
* redis (planned)
* riak (planned)
* mongo (planned)
* mySQL (planned)
* ....and any others people would like to add (submit pull requests!)

####The following features are included:

* New User Account Creation
* Secure Password Reset via Email (using the hash and the email address)
* Ability to Update / Delete Account 
* Blowfish-based Scheme Password Encryption (only stores hashes in database)
* Get user information by username or password
* Log in with a hash (cookie) or with the plaintext password
***

####accountManager.js is built on top of the following libraries :

* [Node.js](http://nodejs.org/) - Application Server
* [node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js/) Password Cryptography
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Moment.js](http://momentjs.com/) - Lightweight Date Library
* [Mocha](http://visionmedia.github.com/mocha/) - Amazing testing library
* [Nano](https://github.com/dscape/nano) - Thin couchDB wrapper
* [should.js](https://github.com/visionmedia/should.js) - BDD style test assertions
***

####Installation & Setup
This assumes you already have node.js, npm, and different databases installed.  

1) Put a config.json in the root folder of the module 
```
{
	"type": "couch",
	"database_name": "YOUR DB NAME",
	"couch_host": "http://USER:PASS@HOST:PORT",
  	"couch_user": "USER",
  	"couch_pass":"PASS",

}
```
