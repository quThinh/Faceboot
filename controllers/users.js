const { databaseVersion } = require('../dbConnection');
const User = require('../models/User');
const Friend = require('../models/Friend');
const { hashPassword, matchPassword } = require('../utils/password')
const { sign, decode } = require('../utils/jwt')
const { ValidateEmail } = require("../utils/emailValidator")
const { uuid } = require('uuidv4');
const { query } = require('express');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.createUser = async (req, res) => {
    try {
        if (!req.body.username) throw new Error("Username is Required")
        if (!req.body.email) throw new Error("Email is Required")
        if (!req.body.password) throw new Error("Password is Required")
        if (!req.body.firstname) throw new Error("Firstname is Required")
        if (!req.body.country) throw new Error("Country is Required")
        if (!ValidateEmail(req.body.email)) throw new Error("Email is incorrect")

        const existingUser = await User.findByPk(req.body.email)
        if (existingUser)
            throw new Error('User aldready exists with this email id')

        const password = await hashPassword(req.body.password);
        const user = await User.create({
            id: uuid(),
            user_name: req.body.username,
            hash_password: password,
            email: req.body.email,
            first_name: req.body.firstname,
            country: req.body.country,
            last_name: req.body.lastname,
            subName: req.body.subName,
            introTxt: req.body.introTxt,
            work_at: req.body.work_at,
            gender: req.body.gender,
            relationship: req.body.relationship,
            learn_at: req.body.learn_at,
            from: req.body.from,
            follower: req.body.follower,
            avatar_url: req.body.avatar_url,
        })
        if (user) {
            if (user.dataValues.hash_password)
                delete user.dataValues.hash_password;
            user.dataValues.token = await sign(user);
            // user.dataValues.bio = null;
            // user.dataValues.image = null;
            res.status(201).json({ user })
        }
    } catch (e) {
        res.status(422).json({ errors: { body: ['Could not create user ', e.message] } })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        if (!req.body.email) throw new Error('Email is Required')
        if (!req.body.password) throw new Error('Password is Required')

        const user = await User.findByPk(req.body.email)

        if (!user) {
            res.status(401)
            throw new Error('No User with this email id')
        }

        //Check if password matches
        const passwordMatch = await matchPassword(user.hash_password, req.body.password)

        if (!passwordMatch) {
            res.status(401)
            throw new Error('Invalid password or email id')
        }

        delete user.dataValues.hash_password
        user.dataValues.token = await sign({ email: user.dataValues.email, username: user.dataValues.username })

        res.status(200).json({ user })
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ errors: { body: ['Could not login ', e.message] } })
    }
}

module.exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)
        if (!user) {
            throw new Error('No such user found')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({ user })
    } catch (e) {
        return res.status(404).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.editUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)

        if (!user) {
            res.status(401)
            throw new Error('No user with this email id')
        }

        if (req.body) {
            const user_name = req.body.user_name ? req.body.user_name : user.user_name
            const first_name = req.body.first_name ? req.body.first_name : user.first_name
            const last_name = req.body.last_name ? req.body.last_name : user.last_name
            const intro_txt = req.body.intro_txt ? req.body.intro_txt : user.intro_txt
            const avatar_url = req.body.avatar_url ? req.body.avatar_url : user.avatar_url
            const birth_day = req.body.birth_day ? req.body.birth_day : user.birth_day
            const sub_name = req.body.sub_name ? req.body.sub_name : user.sub_name
            const work_at = req.body.work_at ? req.body.work_at : user.work_at
            const gender = req.body.gender ? req.body.gender : user.gender
            const live_in = req.body.live_in ? req.body.live_in : user.live_in
            const country = req.body.country ? req.body.country : user.country
            const relationship = req.body.relationship ? req.body.relationship : user.relationship
            const learn_at = req.body.learn_at ? req.body.learn_at : user.learn_at
            const from = req.body.from ? req.body.from : user.from
            const cover_url = req.body.cover_url ? req.body.cover_url : user.cover_url

            const updatedUser = await user.update({
                user_name, intro_txt, avatar_url, first_name, last_name,
                birth_day, sub_name, work_at, gender, live_in, country,
                relationship, learn_at, from, cover_url
            })
            delete updatedUser.dataValues.hash_password;
            updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(updatedUser)
        } else {
            delete user.dataValues.password
            user.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(user)
        }

    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }

}

module.exports.changePassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)
        if (!user) {
            res.status(401)
            throw new Error('No user with this email id')
        }
        if (!req.body) throw new Error("Payload must not be empty", { statusCode: 400 });

        if (!req.body.password) throw new Error("Password must not be empty", { statusCode: 400 });

        const newHashPassword = await hashPassword(req.body.password)

        await user.update({
            hash_password: newHashPassword
        })
        res.status(200).json("Change password successfully");
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.getSpecificUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)
        if (!user) {
            res.status(401)
            throw new Error('No user with this email id')
        }

        delete user.dataValues.hash_password;
        res.status(200).json(user);
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.setBlock = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)
        if (!user) {
            res.status(401)
            throw new Error('No user with this email id')
        }
        if (user.type === 0) user.type = 1;
        else user.type = 0;
        await user.save();
        delete user.dataValues.hash_password;
        res.status(200).json(user);
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.search = async (req, res) => {
    try {
        const searchName = req.params.name;
        const userList = await User.findAll({
            logging: console.log,
            where: {
                [Op.or] : [
                    {first_name: {[Op.like] : '%' + searchName + '%'}},
                    { last_name: {[Op.like] : '%' + searchName + '%'}},
                    { sub_name: {[Op.like] : '%' + searchName + '%'}},
                ]
            }
        })
        res.status(200).json(userList);
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

//test controller
// module.exports.test = async (req, res) => {
//     const friend = await Friend.findAll();
//    res.json({friend})
// }



