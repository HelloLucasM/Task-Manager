const jwt = require('jsonwebtoken')
const User = require('../db/models/user')

const auth = async(req, res, next) =>{
    try {
        //console.log(req.headers.authorization);
        const token = req.header('authorization').replace('Bearer ' , '');
        const decoded = jwt.verify(token, 'thisismynewcourse');
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});


        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user; 
        next();

    } catch (error) {
        res.status(401).send({error: 'Authentication failed.'})
    }
}

module.exports = auth; 