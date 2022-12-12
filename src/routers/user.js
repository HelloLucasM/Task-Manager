const express = require("express")
const router = new express.Router(); 
const {isValidOperation} = require('../utils/utilities')

const User = require('../db/models/user');
const auth = require('../middlewares/auth');

const sharp = require('sharp');
const multer = require('multer');


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

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
           return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post("/users/me/avatar", auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer; 
    await req.user.save();     
    res.send(); 
}, (error, req, res, next) =>{
    res.status(400).send({error: error.message}); 
})

router.delete("/users/me/avatar", auth, async(req, res) => {
    try {
        if(!req.user.avatar){
            res.status(404).send('There is not a picture to delete.')
        } 
        req.user.avatar = undefined; 
        await req.user.save();     
        res.send(); 
    } catch (error) {
        res.status(400).send();
    }
})


router.get("/users/avatar/:id", async(req, res)=>{
    const _id = req.params.id; 

    try {
        const user = await User.findById({_id}); 
        if(!user){res.status(404).send}

        res.set('Content-Type','image/png');
        res.send(user.avatar); 
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router; 