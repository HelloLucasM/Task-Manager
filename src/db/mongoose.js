const mongoose = require('mongoose'); 
console.log(mongoose.connection)
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const User = mongoose.model('Users', {
    name:{
        type: String
    },

    age:{
        type: Number
    }
}); 

const me = new User({name: 'Lucas', age: 22});

//me.save().then(data => console.log(data))
         //.catch(err => console.log("Error " + err))