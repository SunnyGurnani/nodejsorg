var jwt = require('jwt-simple');
var User = require("../lib/login/models/user");

var getTokenFunc = function(req, callback)
{
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-user-access-token'];
 // var key = (req.body && req.body.x_app_key) || (req.query && req.query.x_app_key) || req.headers['x-app-key'];
 
  if(!token)
  	  callback('Token not passed in Request', null);
  	 
  else
  {
  	    
  	    	var decoded = jwt.decode(token, require('../config/secret.js')());

  	    	if(decoded.exp <= Date.now())
            callback("Token is expired", null);
          else
          {
  	    	    var userEmail = decoded.user.email;
              User
                .findOne({'email': userEmail })
                .exec(callback)

          }
  }

}

module.exports = getTokenFunc;