var mongoose     = require('mongoose');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
var Schema       = mongoose.Schema;

var userStatusEnum = ['active', 'emailNotVerified', 'inActive'];

var UserSchema   = new Schema({
	name: {type: String, required: true},
	email:  { type: String, required: true, index: { unique: true, sparse: true }, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
	passwordHash: {type: String, required: true},
	status: {type: String, enum: userStatusEnum, required: true},

	profile_image_url: String

});

UserSchema.plugin(createdModifiedPlugin, {index: true});

module.exports = mongoose.model('User', UserSchema);


