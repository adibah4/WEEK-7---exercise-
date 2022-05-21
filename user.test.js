const MongoClient = require("mongodb").MongoClient;
const User = require("./user")
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;

//Creating user by using Faker-js
const username = faker.name.findName(); 
const password = faker.internet.password();

	bcrypt.genSalt(saltRounds, function (saltError, salt) {
    	if (saltError) {
      		throw saltError
    	} else {
      
		bcrypt.hash(password, salt, function(hashError, hash) {
      	if (hashError) {
        	throw hashError
      	} else {
        
		encryptedPassword=hash;
        console.log("Hash:",hash);
      	}
      	})
    	}
    })

describe("User Account", () => {
	let client;
  	beforeAll(async () => {
    	client = await MongoClient.connect(
		"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.o5rxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    	{ useNewUrlParser: true }
    	);
    User.injectDB(client);
  	})

afterAll(async () => {
    await client.close();
})

//Test will be passed if username and password doesn't match any data in database
test("New user registration", async () => {
	const res = await User.register(username, password, encryptedPassword)
    expect(res).toBe("new user registered");
})

//Test will be passed if any duplicate username was found
test("Duplicate username", async () => {
	const res = await User.register(username, password, encryptedPassword)
    expect(res).toBe("username already existed");
})

//Test will be passed if the username doesn't match any data in database
test("User login invalid username", async () => {
    const res = await User.login("brian", password)
    expect(res).toBe("wrong username")
})

//Test will be passed if the password doesn't match any data in database
test("User login invalid password", async () => {
    const res = await User.login("Josephine Gerhold", "1234")
    expect(res).toBe("invalid password")
})

//Test will be passed if the username and password doesn't match the data in database
test("User login successfully", async () => {
    const res = await User.login(username, password)
    expect(res.username).toBe(username);
    expect(res.password).toBe(password);
})
});