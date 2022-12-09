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


// const User = require('./db/models/user')
// const Task = require('./db/models/task')

app.listen(port, ()=>{
    console.log(`Server is up on port 3000.`)
})