const {Schema, mongoose} = require('mongoose'); 

const Task_Sh = new Schema({
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

const Task = mongoose.model('Tasks', Task_Sh);

module.exports = Task; 