const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const registerUsers = async (req, res, next) => {
    let checkEmail = await db.from('users').where({email: req.body.email}).select('email');
    if (checkEmail.length === 1) return res.status(400).send('email already exists');

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return db('users').insert({
                uuid: uuidv4(),
                email: req.body.email,
                phone_number: req.body.phone_number,
                name: req.body.name,
                password: hash,
                role: req.body.role === 'admin' ? 'user' : req.body.role
            })
        })
        .then(() => {
            res.status(201).json({ status: "user registered succcessfully" });
        })
        .catch(error => next(error));
};

const registerAdmin = async (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    let checkEmail = await db.from('users').where({email: req.body.email}).select('email');
    if (checkEmail.length === 1) return res.status(400).send('email already exists');

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            return db('users').insert({
                uuid: uuidv4(),
                email: req.body.email,
                phone_number: req.body.phone_number,
                name: req.body.name,
                password: hash,
                role: 'admin'
            })
        })
        .then(() => {
            res.status(201).json({ status: "admin registered succcessfully" });
        })
        .catch(error => next(error));
};

const postLogin = (req, res, next) => {
    db.transaction(trx => {
        return trx
            .from('users')
            .where({email: req.body.email})
            .first()
            .then(user => {
                if (!user) throw new Error("bad");
                console.log(user);
                return bcrypt
                        .compare(req.body.password, user.password)
                        .then(auth => {
                            if (!auth) throw new Error("bad");

                            const token = jwt.sign({ 
                                userId: user.id,
                                userEmail: user.email,
                                userRole: user.role
                            }, 
                            'shhhhh',
                            { expiresIn: "24h" });
                            
                            res.status(200).json({
                                message: "Login success!",
                                email: user.email,
                                token,
                                expiredAt: new Date(jwt.decode(token).exp * 1000)
                            });

                            return db('auth').insert({
                                token: token,
                                expired_at: new Date(jwt.decode(token).exp * 1000),
                                user_id: user.id
                            });
                        })
                        .catch(error => next(error));
            })
    })
    .then(data => console.log(data.length))
    .catch(error => next(error));
    // db
    //     .from('users')
    //     .where({email: req.body.email})
    //     .first()
    //     .then(user => {
    //         if (!user) return res.status(400).send("failed");
    //         console.log(user);
    //         return bcrypt
    //                 .compare(req.body.password, user.password)
    //                 .then(auth => {
    //                     if (!auth) return res.status(400).send("failed");

    //                     const token = jwt.sign({ 
    //                         userId: user.id,
    //                         userEmail: user.email,
    //                         userRole: user.role
    //                     }, 
    //                     'shhhhh',
    //                     { expiresIn: "24h" });

    //                     db('auth').insert({
    //                         token: token,
    //                         expired_at: new Date(jwt.decode(token).exp * 1000),
    //                         user_id: user.id
    //                     }).then();

    //                     res.status(200).json({
    //                         message: "Login success!",
    //                         email: user.email,
    //                         token,
    //                         expiredAt: new Date(jwt.decode(token).exp * 1000)
    //                     })
    //                 })
    //                 .catch(error => next(error));
    //     })
    //     .catch(error => next(error));
};

module.exports = {
    registerUsers,
    registerAdmin,
    postLogin
};