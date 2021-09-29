const db = require("../config/database");
const axios = require('axios');

const editData = (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    if (req.params.event === 'mini') {
        db('minigame-rev')
            .where({ id: req.body.id })
            .update({
                ...req.body.email ? {email: req.body.email} : {},
                ...req.body.phone_number ? {phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')} : {},
                ...req.body.name ? {name: req.body.name} : {},
                ...req.body.name_ingame ? {name_ingame: req.body.name_ingame} : {},
                updated_at: new Date() 
            })
            .then(() => {
                db('minigame-rev')
                    .where({id: req.body.id })
                    .select('phone_number')
                    .first()
                    .then(data => {
                        axios({
                            url: 'https://wa.bot.ghifar.dev/sendText',
                            data: JSON.stringify({
                                "user_id": process.env.WA_ID,
                                "number": data.phone_number,
                                "message": "Data kompetisi Ludo Anda telah diubah!"
                            }),
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": process.env.WA_AUTH
                            }
                        }).then(() => {
                            res.status(200).json({
                                status: "success"
                            });
                        }).catch(error => next(error));
                    })
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    } else if (req.params.event === 'game') {
        db('game-rev')
            .where({ id: req.body.id })
            .update({
                ...req.body.leader_email ? {leader_email: req.body.leader_email} : {},
                ...req.body.leader_phone_number ? {leader_phone_number: req.body.leader_phone_number.replace(/^[+]/, '').replace(/^0/, '62')} : {},
                ...req.body.leader_name ? {leader_name: req.body.leader_name} : {},
                ...req.body.leader_name_ingame ? {leader_name_ingame: req.body.leader_name_ingame} : {},
                ...req.body.team_name ? {team_name: req.body.team_name} : {},
                updated_at: new Date() 
            })
            .then(() => {
                db('game-rev')
                    .where({id: req.body.id })
                    .select('leader_phone_number')
                    .first()
                    .then(data => {
                        axios({
                            url: 'https://wa.bot.ghifar.dev/sendText',
                            data: JSON.stringify({
                                "user_id": process.env.WA_ID,
                                "number": data.leader_phone_number,
                                "message": "Data kompetisi Valorant Anda telah diubah!"
                            }),
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": process.env.WA_AUTH
                            }
                        }).then(() => {
                            res.status(200).json({
                                status: "success"
                            });
                        }).catch(error => next(error));
                    })
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    } else if (req.params.event === 'game-player') {
        db('player-rev')
            .where({ id: req.body.id })
            .update({
                ...req.body.name_ingame ? {name_ingame: req.body.name_ingame} : {},
                ...req.body.phone_number ? {phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')} : {},
                ...req.body.name ? {name: req.body.name} : {},
                updated_at: new Date() 
            })
            .then(() => {
                db('player-rev')
                    .where({id: req.body.id })
                    .select('phone_number')
                    .first()
                    .then(data => {
                        axios({
                            url: 'https://wa.bot.ghifar.dev/sendText',
                            data: JSON.stringify({
                                "user_id": process.env.WA_ID,
                                "number": data.phone_number,
                                "message": "Data kompetisi Valorant Anda telah diubah!"
                            }),
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": process.env.WA_AUTH
                            }
                        }).then(() => {
                            res.status(200).json({
                                status: "success"
                            });
                        }).catch(error => next(error));
                    })
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    } else if (req.params.event === 'talkshow') {
        db('talkshow-rev')
            .where({ id: req.body.id })
            .update({
                ...req.body.email ? {email: req.body.email} : {},
                ...req.body.phone_number ? {phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')} : {},
                ...req.body.name ? {name: req.body.name} : {},
                ...req.body.instansi ? {instansi: req.body.instansi} : {},
                ...req.body.pekerjaan ? {pekerjaan: req.body.pekerjaan} : {},
                ...req.body.nim ? {nim: req.body.nim} : {},
                updated_at: new Date() 
            })
            .then(() => {
                db('talkshow-rev')
                    .where({id: req.body.id })
                    .select('phone_number')
                    .first()
                    .then(data => {
                        axios({
                            url: 'https://wa.bot.ghifar.dev/sendText',
                            data: JSON.stringify({
                                "user_id": process.env.WA_ID,
                                "number": data.phone_number,
                                "message": "Data Talkshow Anda telah diubah!"
                            }),
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": process.env.WA_AUTH
                            }
                        }).then(() => {
                            res.status(200).json({
                                status: "success"
                            });
                        }).catch(error => next(error));
                    })
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    } else {
        next();
    }
}


const deleteData = (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    if (req.params.event === 'mini') {
        db('minigame-rev')
            .where({ id: req.body.id })
            .del()
            .then(total => {
                res.status(200).json({
                    status: "success",
                    data_removed: total
                })
            })
            .catch(error => next(error));
    } else if (req.params.event === 'game') {
        db('game-rev')
            .where({ id: req.body.id })
            .del()
            .then(total => {
                res.status(200).json({
                    status: "success",
                    data_removed: total
                })
            })
            .catch(error => next(error));
    } else if (req.params.event === 'talkshow') {
        db('talkshow-rev')
            .where({ id: req.body.id })
            .del()
            .then(total => {
                res.status(200).json({
                    status: "success",
                    data_removed: total
                })
            })
            .catch(error => next(error));
    } else {
        next();
    }
}

module.exports = {
    editData,
    deleteData
}