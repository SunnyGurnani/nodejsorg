var jwt = require('jwt-simple');
var User = require('../models/user');
var passwordHash = require('password-hash');
var express    = require('express'); 
var router = express.Router();


router.route("/")
	.post(function(req, res)
		{
			auth.login(req,res);
		}

		);



var auth = {

	login: function(req, res){

		var email = req.body.email || '';
		var password = req.body.password || '';

		if(email == '' || password == '')
		{
			res.status(401);
			res.json({
				status: 401,
				message: "Credentials Required"
			});
			return;
		}

		var dbUserObj = auth.validate(email, password, processLogin.bind(auth, req, res));

	},

	validate : function(email, password, callback)
	{
		User.findOne({'email': email }, 'name email passwordHash status', function(err, user)
			{
				if(err)
					callback(err, null);

				if(user.status  == 'inActive')
				{
					callback(email+" is InActive", null);
				}

				if(!passwordHash.verify(password, user.passwordHash))
				{
					callback("Invalid Username or Password", null);
				}

				callback(null, {email: user.email, status: user.status, name: user.name});


			}

			);
	}

}


function getToken(user)
{
	var expires = expiresIn(7); // 7 days
  	var token = jwt.encode({
    	exp: expires,
    	user: {email: user.email}
  	}, require('../../../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}


function processLogin(req, res, err, user)
{
	if(err)
	{
		res.status(401);
		res.json({
			status: 401,
			message: err
		});
		return;
	}
	if(user)
	{
		res.json(getToken(user));
	}
}

module.exports = router;
