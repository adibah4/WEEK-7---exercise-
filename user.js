let users;
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;

class User {
	static async injectDB(conn) {
    	users = await conn.db("week7-gp1").collection("user")
    }
  
	//Password hashing by using bycrypt
  	static async register(_userName, _userPassword) {
    	bcrypt.genSalt(saltRounds, function (saltError, salt) {
    		if (saltError) {
        	throw saltError
      	} else {
        	bcrypt.hash(_userPassword, salt, function(hashError, hash) {
          		if (hashError) {
          			return hashError
          		}else {
          			encryptedPassword=hash;
          				console.log("Hash:",hash);
          		}
       		})
      		}
    	})

		// TODO: Check if username exists
		return users.findOne({       
			'username': _userName,
			'password' : _userPassword,
		}).then(async user =>{
		
			if (user) {
				if ( user.username == _userName ){
					return "username already existed";
				}
			}
			else{

		// TODO: Save user to database
		await users.insertOne({      
		'username' : _userName,
		'password' : _userPassword,
		'encrypt'  : encryptedPassword
		})
		return "new user registered";
		}
		}) 
  	}
 
  	static async login(_userName, _userPassword) {
	// TODO: Check if username exists
		return users.findOne({         
			'username' : _userName
		}).then(async user =>{

	// TODO: Validate password,username
		if (user) {
		//console.log(user.password," ", _userPassword)
			if(user.password != _userPassword){
				return "invalid password";
			}
		
	// TODO: Return user object
			else{
				return user;
			}
		}

		else{
			return "wrong username";
		}    
		})
  	}
}

module.exports = User;