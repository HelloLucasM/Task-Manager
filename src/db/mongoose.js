 const mongoose = require('mongoose'); 

const {User_Sh, Task_Sh} = require('./schemas'); 

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const User = mongoose.model('Users', User_Sh); 
const Task = mongoose.model('Tasks', Task_Sh); 


const me = new User({name: 'Mark', email:"IamMark@gmail.com", password: "12Password3", age:18});
const task = new Task({description: "Comprar mandarinas"})

me.save().then(data => console.log(data))
           .catch(err => console.log("Error " + err))