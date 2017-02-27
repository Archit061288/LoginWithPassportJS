var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");


mongoose.connect("mongodb://localhost/users")

var UserSchema = mongoose.Schema({
	username:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	email:{
		type:String
	},
	name:{
		type:String
	}
})

var User = module.exports = mongoose.model("User",UserSchema);

module.exports.createUser = function(newuser,callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newuser.password, salt, function(err, hash) {
    	newuser.password = hash;
    	newuser.save(callback)
        // Store hash in your password DB. 
    });
});
}

module.exports.getUserByUsername =  function(username,callback){
	var query = {username:username};
	User.findOne(query,callback)
}

module.exports.comparePassword =  function(candidatepass,hash,callback){
	bcrypt.compare(candidatepass, hash, function(err, isMatch) {
	    if(err) throw err;
	    callback(null,isMatch)
	});
	
}

module.exports.getUserById =  function(id,callback){
	User.findById(id,callback)
	
}