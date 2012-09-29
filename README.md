#[accountManager.js]

####Dead Simple account management in Node.js with the following features:

* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Blowfish-based Scheme Password Encryption

***

####accountManager.js is built on top of the following libraries :

* [Node.js](http://nodejs.org/) - Application Server
* [node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js/) Password Cryptography
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Moment.js](http://momentjs.com/) - Lightweight Date Library

***

####Installation & Setup
This assumes you already have node.js & npm installed.  

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
