'use strict';

var crypto    			  = require('crypto');
var fs 					  = require('fs');
var readline  			  = require('readline');
var knownHash 			  = 'someHash';
var knownPassword         = 'changeme';
var saltedWebsterLocation = 'dict.txt';

var saltedWebster = readline.createInterface({
  input: fs.createReadStream(saltedWebsterLocation)
});

var getSalt = function(salt) {
    return salt.toString('hex').slice(0,salt.length);
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(knownHash, knownPassword, salt) {
    var passwordData = sha512(knownPassword, getSalt(salt));
	
	if(passwordData.passwordHash===knownHash) {
		console.log('Your salt is likely ' + passwordData.passwordHash);
		process.exit();
	}
};

function startCracking() {
	saltedWebster.on('line', (line) => {
		saltHashPassword(knownHash, knownPassword, line);
	});
};

startCracking();
