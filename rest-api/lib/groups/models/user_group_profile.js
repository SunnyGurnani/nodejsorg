var mongoose     = require('mongoose');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

var Schema       = mongoose.Schema;


var UserGroupProfileSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	group_id: {type: Schema.Types.ObjectId, ref: 'Group', required: true},
	answers: [
		{
			question: {type: String, required: true},
			answer: {type: String, required: true}	
		}
	]
	
});

UserGroupProfileSchema.plugin(createdModifiedPlugin, {index: true});

module.exports = mongoose.model('UserGroupProfile', UserGroupProfileSchema);


