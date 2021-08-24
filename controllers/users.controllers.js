const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const registerUsers = async (req, res, next) => {
    let checkEmail = await db.from('users').where({email: req.body.email}).select('email');
    if (checkEmail.length === 1) return res.status(400).send('email already exists');

    db.transaction(trx => {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                if (req.body.role === 'user') {
                    db
                        .insert({
                            uuid: uuidv4(),
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            name: req.body.name,
                            password: hash,
                            role: req.body.role
                        })
                        .into('users')
                        .transacting(trx)
                        .then(id_user => {
                            const getUUID = db('users').where({id: id_user[0]}).select('uuid');
                            return db('presence').insert({'user_uuid': getUUID}).transacting(trx);
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                } else {
                    db
                        .insert({
                            uuid: uuidv4(),
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            name: req.body.name,
                            password: hash,
                            role: req.body.role
                        })
                        .into('users')
                        .transacting(trx)
                        .then(trx.commit)
                        .catch(trx.rollback);
                }
            })
            .catch(error => next(error));
        })
        
    .then((id) => {
        if (req.body.role !== 'user') {
            return res.status(201).json({
                status: "user registered succcessfully",
            });
        } else {
            db('presence').where({id: id[0]}).select('user_uuid').then(data => {
                res.status(201).json({
                    status: "user registered succcessfully",
                    uuid: data[0].user_uuid
                });
            })
        }
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

const updateUsers = (req, res, next) => {
    if (req.body.name) {
        db
            .from('users')
            .where({ id: req.user.userId })
            .update({ name: req.body.name, updated_at: new Date() })
            .then(() => {
                res.status(200).json({ status: "user updated succcessfully" })
            })
            .catch(error => next(error));
    } else {
        throw Error('bad');
    }
}

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
                            userRole: user.role
                        }, 
                        'shhhhh',
                        { expiresIn: "24h" });

                        db('auth').insert({
                            token: token,
                            expired_at: new Date(jwt.decode(token).exp * 1000),
                            user_id: user.id
                        }).then();

                        res.status(200).json({
                            message: "Login success!",
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
                res.status(200).json({ status: "user presence updated succcessfully" })
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
                res.status(200).json({ status: "user presence updated succcessfully" })
            })
            .catch(error => next(error));
    } else {
        throw Error('bad');
    }
}

module.exports = {
    registerUsers,
    registerAdmin,
    updateUsers,
    postLogin,
    updatePresence
};