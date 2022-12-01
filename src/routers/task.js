const express = require("express"); 
const router = new express.Router(); 
const {isValidOperation} = require('../utils/utilities')


const Task = require('../db/models/task');


router.get("/task", async(req, res)=>{
    
    try {
        const taskFound = await Task.find({}); 
        res.send(taskFound); 
    } catch (e) {
        res.status(500).send(e); 
    }
})

router.get("/task/:id", async(req, res)=>{
    
    const _id = req.params.id; 
    try {
        const task = await Task.findById({_id});

        if(!task){res.status(404).send()}

        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post("/task", async(req, res)=>{
    try {
        const task = new Task(req.body); 
        await task.save(); 
        res.send(task);
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.patch("/task/:id", async(req, res)=>{
    const allowedToUpdate = ["description", "completed"]; 
    const update = Object.keys(req.body); 


    if(!await isValidOperation(allowedToUpdate, update)){
        res.status(400).send({error:"Invalid Updates!"})
    }

    try {
        const task = await Task.findById(req.params.id);
        if(!task){res.status(404).send()}

        update.forEach((k)=>{
            task[k] = req.body[k]; 
        })
        
        await task.save(); 
        
        res.send(task)
    } catch (e) {
        res.status(400).send(e); 
    }
})

router.delete("/task/:id", async(req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id); 
        if(!deletedTask){res.status(404).send()}
        res.send(deletedTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router; 