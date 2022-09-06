const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SCRET = 'Robinisgood$oy'

//Create user to: /api/auth/createuser
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

module.exports = router