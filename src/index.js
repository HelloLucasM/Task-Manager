const { response } = require('express');
const express = require('express');
const mongoose = require('./db/mongoose'); 

const User = require('./models/user');
const Task = require('./models/task');

const app = express(); 
const port = 3000; 


app.use(express.json())

//USERS

app.get("/user", async(req, res)=>{
    try {
        const users = await User.find({}); 
        res.send(users);
    } catch (e) {
        res.status(401).send(e); 
    }  
})

app.get("/user/:id", async(req, res)=>{
    const _id = req.params.id; 

    try {
        const user = await User.findById({_id}); 
        if(!user){res.status(404).send}

        res.send(user); 
    } catch (e) {
        res.status(500).send(e)
    }
})

app.post("/user", async(req, res)=>{
   
   try {
       const newUser = new User(req.body); 
       await newUser.save(); 
       res.status(201).send(newUser); 
   } catch (e) {
       res.status(400).send(e); 
   }
})

app.patch("/user/:id", async(req, res)=>{
    const _id = req.params.id; 
    const allowedToChange = ["name","age","email","password"]
    const update = Object.keys(req.body);

    if(!isValidOperation(allowedToChange, update)){
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try {
        const user = await User.findByIdAndUpdate(_id, {
            name: req.body.name, 
            email: req.body.email, 
            password: req.body.password
        }, {new: true, runValidators: true}); 

        if(!user){
            res.status(404).send()
        };

        res.send(user); 
    } catch (e) {
        res.status(400).send(e); 
    }
})


app.delete("/user/:id", async(req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id); 
        if(!deletedUser){res.status(404).send()}
        res.send(deletedUser)
    } catch (e) {
        res.status(400).send(e)
    }
})







//TASKS 

app.get("/task", async(req, res)=>{
    
    try {
        const taskFound = await Task.find({}); 
        res.send(taskFound); 
    } catch (e) {
        res.status(500).send(e); 
    }
})

app.get("/task/:id", async(req, res)=>{
    
    const _id = req.params.id; 
    try {
        const task = await Task.findById({_id});

        if(!task){res.status(404).send()}

        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


app.post("/task", async(req, res)=>{
    try {
        const task = new Task(req.body); 
        await task.save(); 
        res.send(task);
    } catch (e) {
        res.status(400).send(e)
    } 
})

app.patch("/task/:id", async(req, res)=>{
    const allowedToUpdate = ["description", "completed"]; 
    const update = Object.keys(req.body); 


    if(!await isValidOperation(allowedToUpdate, update)){
        res.status(400).send({error:"Invalid Updates!"})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        if(!task){res.status(404).send()}
        res.send(task)
    } catch (e) {
        res.status(400).send(e); 
    }
})

app.delete("/task/:id", async(req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id); 
        if(!deletedTask){res.status(404).send()}
        res.send(deletedTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

const isValidOperation = (arr, arr2) =>{
    return  arr2.every(key=>arr.includes(key)); 
}

app.listen(port, ()=>{
    console.log(`Server is up on port 3000.`)
})