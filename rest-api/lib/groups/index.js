var express    = require('express'); 
var app = module.exports = express();

var groupRouter = require('./routes/group');
var groupJoinRouter = require('./routes/group-join');



app.use('/group', groupRouter);
app.use('/group/join', groupJoinRouter);