const { databaseVersion } = require('../dbConnection');
const User = require('../models/User');
const {hashPassword,matchPassword} = require('../utils/password')
const {sign,decode} = require('../utils/jwt')
const {ValidateEmail} = require("../utils/emailValidator")

module.exports.createUser = async (req,res) => {
    try{
        if(!req.body.username) throw new Error("Username is Required")
        if(!req.body.email) throw new Error("Email is Required")
        console.log(req.body)
        if(!req.body.password) throw new Error("Password is Required")
        if(!req.body.firstname) throw new Error("Firstname is Required")
        if(!req.body.country) throw new Error("Country is Required")
        if(!ValidateEmail(req.body.email)) throw new Error("Email is incorrect")

        const existingUser = await User.findByPk(req.body.email)
        if(existingUser)
            throw new Error('User aldready exists with this email id')

        const password = await hashPassword(req.body.password);
        const user = await User.create({
            user_name: req.body.username,
            hash_password: password,
            email: req.body.email,
            first_name: req.body.firstname,
            country: req.body.country,
            last_name: req.body?.last_name,
            subName: req.body?.subName,
            introTxt: req.body?.introTxt,
            work_at: req.body?.work_at,
            gender: req.body?.gender,
            relationship: req.body?.relationship,
            learn_at: req.body?.learn_at,
            from: req.body?.from,
            follower: req.body?.follower,
            avatar_url: req.body?.avatar_url,
        })
        console.log(user)
        if(user){
            console.log(user)
            if(user.dataValues.hash_password)
                delete user.dataValues.hash_password;
            user.dataValues.token = await sign(user);
            // user.dataValues.bio = null;
            // user.dataValues.image = null;
            res.status(201).json({user})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Could not create user ', e.message ] }})
    }   
}

module.exports.loginUser = async (req,res) => {
    try{
        if(!req.body.email) throw new Error('Email is Required')
        if(!req.body.password) throw new Error('Password is Required')

        const user = await User.findByPk(req.body.email)

        if(!user){
            res.status(401)
            throw new Error('No User with this email id')
        }
        
        //Check if password matches
        const passwordMatch = await matchPassword(user.hash_password, req.body.password)

        if(!passwordMatch){
            res.status(401)
            throw new Error('Invalid password or email id')
        }
            
        delete user.dataValues.hash_password
        user.dataValues.token = await sign({email: user.dataValues.email,username:user.dataValues.username})

        res.status(200).json({user})
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({errors: { body: [ 'Could not login ', e.message ] }})
    }
}

module.exports.getUserByEmail = async (req,res) => {
    try{
        const user = await User.findByPk(req.user.email)
        if(!user){
            throw new Error('No such user found')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({user})
    }catch(e){
        return res.status(404).json({
            errors: { body: [ e.message ] }
        })
    }
}

module.exports.updateUserDetails = async (req,res) => {
    try{
        const user = await User.findByPk(req.user.email)

        if(!user){
            res.status(401)
            throw new Error('No user with this email id')
        }
            
        
        if(req.body.user){
            const username = req.body.user.username ? req.body.user.username : user.username
            const bio = req.body.user.bio ? req.body.user.bio : user.bio
            const image = req.body.user.image ? req.body.user.image : user.image
            let password = user.password
            if(req.body.user.password)
                password = await hashPassword(req.body.user.password)

            const updatedUser = await user.update({username,bio,image,password})
            delete updatedUser.dataValues.password
            updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(updatedUser)
        }else{
            delete user.dataValues.password
            user.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(user)
        }
        
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [ e.message ] }
        })
    }
    
}