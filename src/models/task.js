const mongoose = require('mongoose'); 
const {Task_Sh} = require('../db/schemas'); 

const Task = mongoose.model('Tasks', Task_Sh);

module.exports = Task; 