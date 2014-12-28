var mongoose     = require('mongoose');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
var securityEnum = require('./group_security_enum');
var Schema       = mongoose.Schema;

var memberTypeEnum = ['admin', 'member', 'owner'];
var GroupMemberSchema = new Schema(
{

	user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	group_id: {type: Schema.Types.ObjectId, ref: 'Group', required: true},
	type: {type: String, enum: memberTypeEnum, required: true}

});
GroupMemberSchema.index({user_id: 1, group_id: 1} , {unique : true});

module.exports = mongoose.model('Group_Members', GroupMemberSchema);