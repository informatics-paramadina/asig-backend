const db = require("../config/database");
// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const axios = require("axios");

const registerUsers = async (req, res, next) => {
    if (!req.body.email || !req.body.phone_number || !req.body.name || !req.body.password) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('users').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('users').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');
    if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "email or phone number already exists"})

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return db('users').insert({
                email: req.body.email,
                phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
                name: req.body.name,
                password: hash,
                role: 'user'
            })
        })
        .then(() => {
            res.status(201).json({ status: "success" });
        })
        .catch(error => next(error));
};

const registerAdmin = async (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    let checkEmail = await db.from('users').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('users').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');
    if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "email or phone number already exists"});

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return db('users').insert({
                email: req.body.email,
                phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
                name: req.body.name,
                password: hash,
                role: 'admin'
            })
        })
        .then(() => {
            res.status(201).json({ status: "success" });
        })
        .catch(error => next(error));
};

const updateUsers = (req, res, next) => {
    if (req.body.name) {
        db
            .from('users')
            .where({ id: req.user.userId })
            .update({ name: req.body.name, updated_at: new Date() })
            .then(() => {
                res.status(200).json({ status: "success" })
            })
            .catch(error => next(error));
    } else {
        throw Error('bad');
    }
}

// const postLoginContinue = async (req, res) => {
//     const user = 
//             await db('otp')
//                 .where({'otp.id': req.body.otp_id })
//                 .join('users', 'users.id', 'otp.user_id')
//                 .first();
//     if (!user) return res.status(400).json({status: "Wrong OTP Code!"})
//     if (Date.now() > user.expired_at) return res.status(400).json({status: "OTP Code has expired!"})

//     const token = jwt.sign({ 
//         userId: user.id,
//         userEmail: user.email,
//         userRole: user.role,
//         userName: user.name,
//         userPhoneNumber: user.phone_number
//     }, 
//     'shhhhh',
//     { expiresIn: "3d" });

//     db('auth').insert({
//         token: token,
//         expired_at: new Date(jwt.decode(token).exp * 1000),
//         user_id: user.id
//     }).then();

//     res.status(200).json({
//         message: "success",
//         email: user.email,
//         token,
//         expiredAt: new Date(jwt.decode(token).exp * 1000)
//     })
// }

const postLogin = (req, res, next) => {
    db
        .from('users')
        .where({email: req.body.email})
        .first()
        .then(user => {
            if (!user) throw Error('bad');

            return bcrypt
                    .compare(req.body.password, user.password)
                    .then(auth => {
                        if (!auth) throw Error('bad');

                        const token = jwt.sign({
                            userId: user.id,
                            userEmail: user.email,
                            userRole: user.role,
                            userName: user.name,
                            userPhoneNumber: user.phone_number
                        },
                        'shhhhh',
                        { expiresIn: "3d" });

                        db('auth').insert({
                            token: token,
                            expired_at: new Date(jwt.decode(token).exp * 1000),
                            user_id: user.id
                        }).then();

                        res.status(200).json({
                            message: "success",
                            email: user.email,
                            token,
                            expiredAt: new Date(jwt.decode(token).exp * 1000)
                        })
                    })
                    .catch(error => next(error));
        })
        .catch(error => next(error));
};

const updatePresence = (req, res, next) => {
    if (req.body.is_present) {
        db
            .from('users')
            .whereRaw('users.id = ?', [req.user.userId])
            .join('presence', 'users.uuid', 'presence.user_uuid')
            .update({ 
                "presence.is_present": req.body.is_present == true ? 1 : 1,
                "presence.present_at": req.body.present_at ? req.body.present_at : new Date(), 
                "presence.updated_at": new Date() 
            })
            .then(() => {
                res.status(200).json({ status: "success" })
            })
            .catch(error => next(error));
    } else if (req.body.uuid) {
        db
            .from('presence')
            .where({ user_uuid: req.body.uuid })
            .update({
                "is_present": req.body.is_present == true ? 1 : 1,
                "present_at": req.body.present_at ? req.body.present_at : new Date(), 
                "updated_at": new Date() 
            })
            .then(() => {
                res.status(200).json({ status: "success" })
            })
            .catch(error => next(error));
    } else {
        throw Error('bad');
    }
}

const forgetPassword = async (req, res, next) => {
    if (!req.body.phone_number) return res.status(406).json({status: "request not accepted!"})

    let checkUser = await db.from('users').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('id', 'phone_number').first();
    if (!checkUser) return res.status(400).json({status: "phone number not found!"});
    
    // const token = "0" + Date.now();

    db('otp').insert({
        token: "0" + Date.now(),
        expired_at: moment().add(1, 'm').toDate(),
        user_id: checkUser.id
    }).then(id => {
        db('otp').where({id: id[0]}).then(data => {
            axios({
                url: 'https://wa.bot.ghifar.dev/sendText',
                data: JSON.stringify({
                    "user_id": process.env.WA_ID,
                    "number": checkUser.phone_number,
                    "message": "Klik link berikut ini untuk melakukan reset password:\n\n" 
                    + "https://asig14.himti.my.id/changePassword?token=" + data[0].token
                }),
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": process.env.WA_AUTH
                }
            }).then(() => {
                res.status(201).json({
                    status: "send token reset password sukses!",
                    phone_number: checkUser.phone_number
                });
            }).catch(() => {
                res.status(400).json({
                    status: "send token reset password gagal!",
                    phone_number: checkUser.phone_number
                });
            })
        })
    }).catch(error => next(error));
}

const checkForgetPassword = async (req, res) => {
    const user = 
            await db('otp')
                .where({'token': req.body.token })
                .join('users', 'users.id', 'otp.user_id')
                .first();
    if (!user) return res.status(400).json({status: "Wrong token!"})
    if (Date.now() > user.expired_at) return res.status(400).json({status: "Token has expired!"})

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return db('users')
                .where({ phone_number: user.phone_number })
                .update({
                    password: hash,
                    updated_at: new Date() 
                })
        })
        .then(() => {
            res.status(200).json({ status: "success" });
        })
        .catch(error => next(error));
}

module.exports = {
    registerUsers,
    registerAdmin,
    updateUsers,
    postLogin,
    updatePresence,
    forgetPassword,
    checkForgetPassword
};