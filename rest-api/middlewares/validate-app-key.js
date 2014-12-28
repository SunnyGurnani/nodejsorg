var jwt = require('jwt-simple');

var authorizedApps = require('../config/authorized-apps');

module.exports = function(req, res, next)
{

// When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  if(req.method == 'OPTIONS') next();
 
    //var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-user-access-token'];
   var key = (req.body && req.body.x_app_key) || (req.query && req.query.x_app_key) || req.headers['x-app-key'];
 
  if(!key)
  	  {
  	  	res.status(400);
  	  	res.json({
  	  		status: 400,
  	  		message: "App Key Required"
  	  	});
  	  	return;
  	  }
  else
  {
  	    
  	    	if(authorizedApps.indexOf(key) > -1)
            {
              res.status(400);
            res.json({
              status: 400,
              message: 'Invalid App Key'
             });
            return;
            }


           next();

  	    	
  	    
  }

}