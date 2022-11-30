const { Schema } = require("mongoose");

const Task = new Schema({
    description:{ 
        type: String,
        trim: true,
        required: true
    }, 
    completed:{
        type: Boolean,
        default: false
    }
});


module.exports = Task; 
