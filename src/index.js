const { response } = require('express');
const express = require('express');
require('./db/mongoose'); 
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')


const app = express(); 
const port = 3000; 


app.use(express.json())
app.use(userRoute) 
app.use(taskRoute)


const User = require('./db/models/user')
const Task = require('./db/models/task')

const main = async() =>{

    // const task = await Task.findById('6390938a8f9e88bb3c52e882'); 
    // await task.populate('owner');  
    // console.log(task.owner);

    const user = await User.findById('638fc2d1c18c10966d2f5904'); 
    await user.populate('tasks'); 

    console.log(user.tasks)

}

 



app.listen(port, ()=>{
    console.log(`Server is up on port 3000.`)
})