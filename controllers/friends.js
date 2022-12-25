const { databaseVersion } = require('../dbConnection');
const User = require('../models/User');
const Friend = require('../models/Friend');
const { hashPassword, matchPassword } = require('../utils/password')
const { sign, decode } = require('../utils/jwt')
const FriendRequest = require('../models/FriendRequest')
const { uuid } = require('uuidv4');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const checkUser = async (emailId) => {
    const user = await User.findOne({emailId});
    if (!user) return false;
    return true;
}

module.exports.sendRequest = async (req, res) => {
    try {
        const receiveUser = req.params.receiveUser;
        const currentUser = req.user.email;
        if(receiveUser === currentUser) throw new Error("Can't request to myself")
        const userExist = await checkUser(receiveUser)
        if (!userExist)
            throw new Error("User not exist with this email id", {statusCode: 400});
        const checkFriend = await Friend.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            {user1_email: receiveUser},
                            {user2_email: currentUser}
                        ]
                    },
                    {
                        [Op.and]: [
                            {user2_email: receiveUser},
                            {user1_email: currentUser}
                        ]
                    },
                ]
            }
        });
        if(checkFriend.length) throw new Error("You were friend")
        // const checkRequest = await FriendRequest.findAll({send_user_email: req.user.email, receive_user_email: receiveUser});
        const checkRequest = await FriendRequest.findAll({
            where: {
                [Op.and] : [
                    {send_user_email: req.user.email},
                    {receive_user_email: receiveUser}
                ]
            }
        });
        if (checkRequest.length) throw new Error("You have already send request", {statusCode: 400})
        
        const friendRequest = await FriendRequest.create({
            id: uuid(),
            send_user_email: req.user.email,
            receive_user_email: receiveUser,
        })

        if (friendRequest) {
            res.status(200).json({ friendRequest })
        }
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.getAllRequest = async (req, res) => {
    try {
        const emailId = req.user.email;
        const requestList = await FriendRequest.findAll({
            where: {
                send_user_email: emailId
            }
        });
        res.status(200).json(requestList)

    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ errors: { body: ['Could not login ', e.message] } })
    }
}

module.exports.getAllBeRequest = async (req, res) => {
    try {
        const emailId = req.user.email;
        console.log(emailId)
        const requestList = await FriendRequest.findAll({
            where: {
                receive_user_email: emailId
            }
        });
        res.status(200).json(requestList)
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({ errors: { body: ['Could not login ', e.message] } })
    }
}

module.exports.acceptRequest = async (req, res) => {
    try {
        const emailUserId = req.user.email;
        const emailBeAccept = req.params.emailId;
        
        const request = await FriendRequest.findOne({
            where: {
                [Op.and]: [
                    {send_user_email: emailBeAccept},
                    {receive_user_email: emailUserId}
                ]
            }
        })
        if(!request) throw new Error("This request add friend is not exist")
        request.destroy();

        const newFriend = await Friend.create({
            id: uuid(),
            user1_email: emailUserId,
            user2_email: emailBeAccept,
        })
        if(!newFriend) throw new Error("Can't accept request", statusCode(500))

        return res.status(200).json("Accept request successfully")
    } catch (e) {
        return res.status(404).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.cancelRequest = async (req, res) => {
    try {
        const emailUserId = req.user.email;
        const emailBeCancel = req.params.emailId;
        console.log(emailUserId, emailBeCancel)
        const request = await FriendRequest.findOne({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            {send_user_email: emailUserId},
                            {receive_user_email: emailBeCancel}
                        ]
                    },
                    {
                        [Op.and]: [
                            {receive_user_email: emailUserId},
                            {send_user_email: emailBeCancel}
                        ]
                    }
                ]
            }
        })

        if(!request) throw new Error("This request add friend is not exist")
        request.destroy();

        return res.status(200).json("Cancel request successfully")
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }

}

module.exports.removeRequest = async (req, res) => {
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

module.exports.getAllFriend = async (req, res) => {
    try {
        const userEmailId = req.user.email;
        const listFriend = await Friend.findAll({
            where: {
                [Op.or]: [
                    {user1_email: userEmailId},
                    {user2_email: userEmailId}
                ]
            }
        })
        res.status(200).json({listFriend});
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

module.exports.getAllFriendUser = async (req, res) => {
    try {
        const userEmailId = req.params.emailId;
        const listFriend = await Friend.findAll({
            where: {
                [Op.or]: [
                    {user1_email: userEmailId},
                    {user2_email: userEmailId}
                ]
            }
        });
        res.status(200).json({listFriend});
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [e.message] }
        })
    }
}

// module.exports.getAllRecommend = async (req, res) => {
//     try {
        
//     } catch (e) {
//         const status = res.statusCode ? res.statusCode : 500
//         return res.status(status).json({
//             errors: { body: [e.message] }
//         })
//     }
// }

//test controller
// module.exports.test = async (req, res) => {
//     const friend = await Friend.findAll();
//    res.json({friend})
// }



