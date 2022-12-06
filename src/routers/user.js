const express = require("express")
const router = new express.Router(); 
const {isValidOperation} = require('../utils/utilities')

const User = require('../db/models/user');
const auth = require('../middlewares/auth');

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

router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token; 
        })
        await req.user.save(); 
        res.send();

    } catch (error) {
        res.status(500).send()
    }
} )

router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save(); 
        res.send();

    } catch (error) {
        res.status(500).send()
    }
} )

router.get("/users/me", auth, async(req, res)=>{
    try {
        res.send(req.user);
    } catch (e) {
        res.status(401).send(e); 
    }  
})

// router.get("/users/:id", auth, async(req, res)=>{
//     const _id = req.params.id; 

//     try {
//         const user = await User.findById({_id}); 
//         if(!user){res.status(404).send}

//         res.send(user); 
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.patch("/users/me", auth, async(req, res)=>{
    const allowedToChange = ["name","age","email","password"]
    const update = Object.keys(req.body);

    if(!isValidOperation(allowedToChange, update)){
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try {
        
        update.forEach((key)=>{
            req.user[key] = req.body[key]; 
        })

        await req.user.save();  
        res.send(req.user); 

    } catch (e) {
        res.status(400).send(e); 
    }
})

router.delete("/users/me", auth, async(req, res) => {
    try {
        await req.user.remove();
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router; 