const express = require("express")
const router = new express.Router(); 
const {isValidOperation} = require('../utils/utilities')

const User = require('../models/user');

router.get("/user", async(req, res)=>{
    try {
        const users = await User.find({}); 
        res.send(users);
    } catch (e) {
        res.status(401).send(e); 
    }  
})

router.get("/user/:id", async(req, res)=>{
    const _id = req.params.id; 

    try {
        const user = await User.findById({_id}); 
        if(!user){res.status(404).send}

        res.send(user); 
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post("/user", async(req, res)=>{
   
   try {
       const newUser = new User(req.body); 
       await newUser.save(); 
       res.status(201).send(newUser); 
   } catch (e) {
       res.status(400).send(e); 
   }
})

router.patch("/user/:id", async(req, res)=>{
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


router.delete("/user/:id", async(req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id); 
        if(!deletedUser){res.status(404).send()}
        res.send(deletedUser)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router; 