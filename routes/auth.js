const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//Create user
router.post('/createuser', [
        body('name', "Enter a valid name").isLength({min: 3}),
        body('email', "Enter a valid email address").isEmail(),
        body('password').isLength({min: 5}),
    ],(req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(user => res.json(user))
        .catch(err => {
            console.log(err)
            res.json({err: "pleace enter a unique email address"})
        })
  
})

module.exports = router