const mongoose = require('mongoose'); 
const User_Sh = require('../db/schemas/user'); 

const User = mongoose.model('Users', User_Sh);

module.exports = User; 