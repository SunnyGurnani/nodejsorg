var jwt = require('jwt-simple');


module.exports = function(req, res, next)
{

// When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  if(req.method == 'OPTIONS') next();
 
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-user-access-token'];
 // var key = (req.body && req.body.x_app_key) || (req.query && req.query.x_app_key) || req.headers['x-app-key'];
 
  if(!token)
  	  {
  	  	res.status(400);
  	  	res.json({
  	  		status: 400,
  	  		message: "User Token Required"
  	  	});
  	  	return;
  	  }
  else
  {
  	    
  	    	var decoded = jwt.decode(token, require('../config/secret.js')());

  	    	if(decoded.exp <= Date.now()){
  	    		res.status(400);
  	    		res.json({
  	    			status: 400,
  	    			message: 'User Token expired'
  	    		});
  	    		return;
  	    	}

          next();
  	   
  }

  //ToDo: Check if the User is Active. We might want to kick out the user which was inactivated after the token  was generated;.

}