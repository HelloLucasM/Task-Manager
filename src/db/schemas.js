const { Schema } = require("mongoose");
const validator = require("validator"); 

const User = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        default: 'Anonymus'
    },
    
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email is invalid."); 
            }
        }
    },

    password: {
        type: String, 
        required: true, 
        trim: true,
        minLength: 7,
        validate: { //read doc
            validator: function(v) {
                if(v.toLowerCase().includes("password")){
                    throw new Error("Invalid password, try another.")
                };
              }
          }
        
    },

    age:{
        type: Number,
        validate(val){
            if(val < 0){
                throw new Error("Number should be positive."); 
            }
        }
    }
}); 

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

module.exports = {
    User_Sh: User, 
    Task_Sh: Task
}   