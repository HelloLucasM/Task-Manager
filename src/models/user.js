const mongoose = require('mongoose'); 
const {User_Sh} = require('../db/schemas'); 

const User = mongoose.model('Users', User_Sh);

module.exports = User; 