const express = require("express")
const router = new express.Router(); 
const {isValidOperation} = require('../utils/utilities')

const User = require('../db/models/user');
const auth = require('../middlewares/auth');

router.get("/user", auth, async(req, res)=>{
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
    const newUser = new User(req.body); 

   try {
       await newUser.save(); 

       const token = await newUser.generateAuthToken(); 

       res.status(201).send({newUser, token}); 
   } catch (e) {
       res.status(400).send(e); 
   }
})

router.post("/users/login", async(req, res)=>{
    try {
        
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken(); 
        res.send({user, token}); 

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
        const userFound = await User.findById(_id); 
        if(!userFound){
            return res.status(404).send(); 
        }

        update.forEach((key)=>{
            userFound[key] = req.body[key]; 
        })

        await userFound.save();  
        res.send(userFound); 

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