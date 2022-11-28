const { response } = require('express');
const express = require('express');
const mongoose = require('./db/mongoose'); 

const User = require('./models/user');
const Task = require('./models/task');

const app = express(); 
const port = 3000; 


app.use(express.json())

//USERS

app.get("/user", (req, res)=>{
    User.find({}).then((data) =>{
        res.send(data);
    })
    .catch((error)=>{
        console.log(error)
        res.status(401).send(error); 
    }); 
})

app.get("/user/:id", (req, res)=>{
    const userFind = req.params.id; 

    User.findById({_id: userFind }).then((user) =>{
        if(!user){
            return res.status(404).send(); 
        }
        res.send(user);
    })
    .catch((e)=>{
        console.log(e)
        res.status(500).send(); 
    }); 
})

app.post("/user", (req, res)=>{
    const user = new User(req.body); 
    user.save().then(() => {
        res.send(user); 
    }).catch(error => {
        res.status(400).send(error)
    })
})







//TASKS 

app.get("/task", (req, res)=>{
    Task.find({}).then((data) =>{
        res.send(data);
    })
    .catch((error)=>{
        console.log(error)
        res.status(401).send(error); 
    }); 
})

app.get("/task/:id", (req, res)=>{

    Task.findById({_id: req.params.id }).then((task) =>{
        if(!task){
            return res.status(404).send(); 
        }
        res.send(task);
    })
    .catch((e)=>{
        console.log(e)
        res.status(500).send(); 
    }); 
})


app.post("/task", (req, res)=>{
    const task = new Task(req.body)
    task.save()
        .then(() =>{res.send(task)})
        .catch((error) => {
            console.log(error)
            res.status(400).send(error); 
        })
})

// app.patch("/tasks", (req, res)=>{
//     res.send({"description": "test"}); 
// })

app.listen(port, ()=>{
    console.log(`Server is up on port 3000.`)
})