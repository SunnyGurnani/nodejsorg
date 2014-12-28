var express    = require('express'); 
var app = module.exports = express();

var authRouter = require('./routes/auth');
var userRouter = require('./routes/user_routes');

app.use('/auth', authRouter);
app.use('/user', userRouter);

