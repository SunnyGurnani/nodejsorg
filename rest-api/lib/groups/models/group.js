var mongoose     = require('mongoose');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
var securityEnum = require('./group_security_enum');
var Schema       = mongoose.Schema;

//public = searchable and open to join
//approval_required = searchable and approval required
//private = not searchable 

var GroupSchema = new Schema(
{
	title: {type: String, required: true},
	desc: String,
	pictureUrl: String,
	url: {type: String, required: true, index: {unique: true,sparse: true , validate: /\b[a-z0-9_]\b/}},
	address: [
		{
			title: String,
			line_1: String,
			line_2: String,
			City: String,
			State: String,
			Country: String,
			phoneNumbers: [
				{
					type: String,
					number: String
				}
			]
		}
	],


	group_album :[
		{
			url: {type: String, required: true},
			thumbnail_url: {type: String, required: true},
			title: String,
			desc: String
		}

	],

	profile_questions: [
		{
			question: {type: String, required: true},
			required: {type: Boolean, required: true}
		}
	],


	security: { type: String, enum: securityEnum, required: true }
	
}
);

GroupSchema.plugin(createdModifiedPlugin, {index: true});

module.exports = mongoose.model('Group', GroupSchema);


