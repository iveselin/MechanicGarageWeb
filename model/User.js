var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: String,
	password: String,
	role: {
		type: String,
		enum: ['owner','worker'],
		default:'worker'
	},
	tasks: [{
		type:String
	}]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);