const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SCRET = 'Robinisgood$oy'



//Rout - 1 Create user to: /api/auth/createuser
router.post('/createuser', [
        //express-validator checking
        body('name', "Enter a valid name").isLength({min: 3}),
        body('email', "Enter a valid email address").isEmail(),
        body('password').isLength({min: 5}),
    ],async(req, res)=>{

        //if there are error in user sumission it will return the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check the email exist already
            let user = await User.findOne({email: req.body.email})
            if(user){
                return res.status(400).json({error: "This email address is already exist"})
            }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            //Create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })
            const data = {
                user : {
                    id: user.id
                }
            }
            const authTocken = jwt.sign(data, JWT_SCRET)

            res.json({authTocken})

        } catch (error) {
            console.error(error.message)
            res.status(500).send("Some error occured")
        }
  
})



//Rout - 2 Login a user to: /api/auth/login
router.post('/login', [
    //express-validator checking
    body('email', "Enter a valid email address").isEmail(),
    body('password', "Password cannot be blank").exists(),
],async(req, res)=>{
    let success = false;
    //if there are error in user sumission it will return the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email})
        if(!user){
            success = false;
            return res.status(400).json({error: "Pleace login with correct credintials"});
        }
    
        const passwordCompair  = await bcrypt.compare(password, user.password)
        if(!passwordCompair){
            success = false;
            return res.status(400).json({success, error: "Pleace login with correct credintials"});
        }
    
        const data = {
            user : {
                id: user.id
            }
        }
        const authTocken = jwt.sign(data, JWT_SCRET)
        success = true;
        res.json({success, authTocken})        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }

})



//Rout - 3: Get login a user detail using POST: /api/auth/getuser
router.post('/getuser', fetchuser, async(req, res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-passwords");
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error this occured")
    }
})


module.exports = router

