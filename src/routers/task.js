const express = require("express"); 
const router = new express.Router(); 

const {isValidOperation} = require('../utils/utilities')
const Task = require('../db/models/task');
const auth = require('../middlewares/auth');


router.post("/task", auth, async(req, res)=>{
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        }); 

        await task.save(); 
        res.send(task);
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.get("/tasks", auth, async(req, res)=>{
    const match = {}; 

    if(req.query.completed){
        match.completed = req.query.completed === 'true'; 
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        })
        res.send(req.user.tasks); 
    } catch (e) {
        res.status(500).send(e); 
    }
})

router.get("/tasks/:id", auth, async(req, res)=>{
    
    const _id = req.params.id; 
    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if(!task){res.status(404).send()}

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch("/task/:id", auth, async(req, res)=>{
    const allowedToUpdate = ["description", "completed"]; 
    const update = Object.keys(req.body); 


    if(!await isValidOperation(allowedToUpdate, update)){
        res.status(400).send({error:"Invalid Updates!"})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
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

router.delete("/task/:id", auth, async(req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id}); 
        if(!deletedTask){res.status(404).send()}
        res.send(deletedTask)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router; 