var express    = require('express'); 
var router = express.Router();
var User = require('../models/user');
var passwordHash = require('password-hash');





router.route('/')

	.get(function(req, res)
	{
		User.find(function(err, users){
			if(err)
		   		res.send(err);
			res.json(users);			

		});
		
	})
	.post(function(req, res)
	{
		console.log("Save user is called");
		console.log("I am new;")
		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.passwordHash = passwordHash.generate(req.body.password);
		user.status = 'emailNotVerified';



		user.save(function(err)
		{
			if(err)
			{
				res.send(err);
			}
			else
				res.json({
					status: 200,
					message:"User Created"
				});
			
		})
	});

	
module.exports = router;




