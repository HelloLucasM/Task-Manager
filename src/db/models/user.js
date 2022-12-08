const {Schema, mongoose} = require('mongoose'); 
const validator = require("validator"); 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); 

const Task = require('./task');

const User_Sh = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        default: 'Anonymus'
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    
    tokens:[{
        token:{
            type:String, 
            required: true
        }
    }]

}, {timestamps: true}); 

User_Sh.virtual('tasks', {
    ref:'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

User_Sh.statics.findByCredentials = async(email, password)=>{

    const user = await User.findOne({email}); 
    if(!user){throw new Error("Login unabled!")}

    const isValid = await bcrypt.compare(password, user.password); 

    if(!isValid){throw new Error("Login unabled!")}

    return user; 
};

User_Sh.methods.toJSON = function(){
    const user = this; 
    const userObj = user.toObject(); 

    delete userObj.password; 
    delete userObj.tokens; 

    return userObj; 
}


User_Sh.methods.generateAuthToken = async function(){
    const user = this; 
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({token}); 
    user.save(); 
    return token; 
}

//Encripting password before save user document. 
User_Sh.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

//Remove tasks when user is deleted
User_Sh.pre('remove', async function(next){
    await Task.deleteMany({
        owner: this._id
    })
    next();
})


const User = mongoose.model('Users', User_Sh);


module.exports = User; 