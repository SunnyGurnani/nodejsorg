var express    = require('express'); 
var router = express.Router();
var User = require('../../login/models/user');
var Group = require('../models/Group');
var getUserFromHeader = require('../../../utils/get-user-from-header');
var appConfig = require('../../../config/app-config');
var Group_Members = require('../models/group_members');
var userTokenMiddleware = require('../../../middlewares/validate-user-token');



router.route('/:group_id')
	.get(function(req, res)
	{
		console.log("Getting Group by id" + req.params.group_id);
		Group
			.findById(req.params.group_id)
			.select({members : {$skip: 0, $limit: 10}})
			.exec(function(err, group)
			{
				if(err)
					res.send(err);
				res.json(group);
			});
	})
	.put(userTokenMiddleware)
	.put(function(req,res)
	{
		console.log("Update Group by id" + req.params.group_id);

		getUserFromHeader(req, function(getUserErr, user)
		{
			if(getUserErr)
			{
				res.status(400);
				res.send(getUserErr);
				return;
			}


			
			Group_Members
				.find({user_id: user._id, group_id: req.params.group_id })
				.select('_id')
				.exec(function(err, group_member){
					console.log("Group member " + group_member+  " err "+err);
					
					if( err  || !group_member)
					{
						res.status(400);
						res.json({err: "You are not Creator/Admin of this group"});
						return;
					}
					else
					{
						Group.findById(req.params.group_id, function(err, group)
						{
								if(err)
								{
									res.status(500);
									res.send(err);
									return;
								}
								else
								{
									setGroupFromRequest(group, req);

									group.save(function(err)
									{
										if(err)
											{	
												res.status(500);
												res.send(err);
											}

										res.json("Group Updated")

									});
								}
						});
					}

				});
		});

	})
	.delete(userTokenMiddleware)
	.delete(function(req,res)
	{

		console.log("Delete Group by id" + req.params.group_id);

		getUserFromHeader(req, function(getUserErr, user)
		{
			if(getUserErr)
			{
				res.status(400);
				res.send(getUserErr);
				return;
			}

			Group_Members
			   .findOne({user_id : user._id, group_id: req.params.group_id, type: {$in: ['admin', 'owner']}})
			 
			   .exec(function(err, group_member){
			   		console.log("Error "+err);
			   		if(err || !group_member)
			   		{
			   			res.status(400);
			   			res.json({msg: "Unauthorized to remove this group"});
			   			return;
			   		}
					Group.findByIdAndRemove(req.params.group_id,{}, function(err)
					{
						if(err)
						{
							res.status(500);
							res.send(err);
							return;
						}
						group_member.remove(function(err){});

						res.json({msg: "Group Removed"});
					});		
				});	   		

			   

			
		});


	});


router.route('/')

	.get(function(req, res)
	{
		console.log("in Get Groups");
		Group
			.find()
			.or([{security: 'public'}, {security: 'rsvp'}])
			.limit(appConfig.page_size)
			.sort('-created')
			.exec(function(err, groups)
			{
				if(err)
				{
					res.send(err);
					return;
				}
				res.json(groups);
			});
		
	})
	.post(userTokenMiddleware)
	.post(function(req, res)
	{
		console.log("Create Group is called");
		getUserFromHeader(req, function(getUserErr, user)
		{
			if(getUserErr)
			{
				res.status(400);
				res.json({'error': getUserErr});
				return;
			}


			var group = new Group();
			setGroupFromRequest(group, req);

		

			
		
			
			group.save(function(err)
			{
				if(err)
				{
					res.send(err);
					return;
				}
				else
				{
					var group_member = new Group_Members();
					group_member.user_id = user._id;
					console.log("Group id = "+ group._id);
					group_member.group_id =  group._id;
					group_member.type = "owner";

					group_member.save(function(err)
					{
						if(err)
						{
							console.log("Creating new Group and Saving to Group Member failed");
							res.status(500);
							res.send(err);
							return;
						}
						res.json({msg: "Group Created Successfully"});


					});
				}
				
			});


		});
		
	});

function setGroupFromRequest(group, req)
{
		if(req.body.title)
			group.title = req.body.title;

		if(req.body.desc)
			group.desc = req.body.desc;

		if(req.body.pictureUrl)
			group.pictureUrl = req.body.pictureUrl;

		if(req.body.url)
			group.url = req.body.url;

		if(req.body.address)
			group.address = req.body.address;

		if(req.body.profile_questions)
			group.profile_questions = req.body.profile_questions;

		if(req.body.security)
			group.security = req.body.security;

}

	
module.exports = router;




