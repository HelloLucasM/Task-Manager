const { Schema } = require("mongoose");
const validator = require("validator"); 
const bcrypt = require('bcryptjs'); 

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

User.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

module.exports = User;
 