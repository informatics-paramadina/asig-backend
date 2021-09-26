const db = require("../config/database");
const moment = require('moment');
const axios = require('axios');
const nodemailer = require('nodemailer');

const getTeamsRev = (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    db('game-rev')
        .select()
        .then(row => res.send(row))
        .catch(err => next(err));
}

const getPlayersByTeamRev = (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    db('player-rev')
        .where({team_id: req.params.id})
        .select()
        .then(row => res.send(row))
        .catch(err => next(err));
}

const getPlayersRev = async (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    if (req.params.event === 'mini') {
        db('minigame-rev')
            .select()
            .then(row => res.send(row))
            .catch(err => next(err));
    } else if (req.params.event === 'game') {
        try {
            const data = await db('game-rev')
            .join('player-rev', 'player-rev.team_id', 'game-rev.id')
            .select();

            const resultData = [];
            let teamId = [];

            for (let i=0; i<data.length; i++) {
                if (teamId.includes(data[i].team_id)) {
                    resultData.some(el => {
                        if (el.team_id === data[i].team_id) {
                            let stuff = {
                                name: data[i].name,
                                name_ingame: data[i].name_ingame,
                                phone_number: data[i].phone_number
                            };
                            el.players.push(stuff)
                        }
                    })
                } else {
                    teamId.push(data[i].team_id);
                    let stuff = {
                        team_id: data[i].team_id,
                        team_name: data[i].team_name,
                        team_logo: data[i].team_logo,
                        players: [
                            {
                                name: data[i].leader_name,
                                name_ingame: data[i].leader_name_ingame,
                                phone_number: data[i].leader_phone_number,
                                email: data[i].leader_email,
                                status: 'leader'
                            },
                            {
                                name: data[i].name,
                                name_ingame: data[i].name_ingame,
                                phone_number: data[i].phone_number
                            }
                        ]
                    };
                    resultData.push(stuff);
                }
            }
            
            res.send(resultData);
        } catch(err) {
            next(err);
        }

    } else if (req.params.event === 'talkshow') {
        db('talkshow-rev')
            .select()
            .then(row => res.send(row))
            .catch(err => next(err));
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

const blastDelay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const blastWARev = async (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");

    if (req.params.event === 'talkshow') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('talkshow-rev').select('email', 'phone_number', 'name');

        res.send('ok');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].phone_number,
                    event: 'talkshow'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].phone_number,
                    event: 'talkshow'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }

    } else if (req.params.event === 'mini') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('minigame-rev').select('email', 'phone_number', 'name');

        res.send('ok');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].phone_number,
                    event: 'minigame'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].phone_number,
                    event: 'minigame'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }
        
    } else if (req.params.event === 'game') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('game-rev').select('leader_email', 'leader_phone_number', 'leader_name');

        res.send('ok');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].leader_phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].leader_phone_number,
                    event: 'game'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].leader_phone_number,
                    event: 'game'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }
        
    } else {
        next();
    }
}

const getLogs = (req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH) return res.status(403).send("forbidden");
    
    if (req.params.event === 'talkshow') {
        db('blast')
            .where({ event: 'talkshow' })
            .select()
            .then(row => res.send(row))
            .catch(err => next(err));
    } else if (req.params.event === 'game') {
        db('blast')
            .where({ event: 'game' })
            .select()
            .then(row => res.send(row))
            .catch(err => next(err));
    } else if (req.params.event === 'mini') {
        db('blast')
            .where({ event: 'minigame' })
            .select()
            .then(row => res.send(row))
            .catch(err => next(err));
    } else {
        next();
    }
}

// --------------------------------------------------------------------------------

const getTeams = (req, res, next) => {
    db('team')
        .join('users', 'users.id', 'team.leader_id')
        .leftJoin('bukti', 'bukti.team_id', 'team.id')
        .select('team.id', 'team_name', 'team_logo', 'name AS leader_name', 'bukti.file_bukti', 'bukti.nama_rekening', 'team.created_at', 'team.updated_at')
        .then(row => res.send(row))
        .catch(err => next(err));
}

const getPlayersByTeam = (req, res, next) => {
    db('member')
        .where({team_id: req.params.id})
        .select()
        .then(row => res.send(row))
        .catch(err => next(err));
}

const getPlayers = (req, res, next) => {
    if (req.params.event === 'mini') {
        db('minigame')
            .join('users', 'users.id', 'minigame.user_id')
            .select('minigame.id', 'name_ingame', 'name', 'minigame.created_at', 'minigame.updated_at')
            .then(row => res.send(row))
            .catch(err => next(err));
    } else if (req.params.event === 'game') {
        db('member')
            .join('team', 'team.id', 'member.team_id')
            .select('member.id', 'name_ingame', 'name', 'phone_number', 'team_name', 'team_logo', 'member.created_at', 'member.updated_at')
            .then(row => res.send(row))
            .catch(err => next(err));
    } else {
        next();
    }
}

const getSchedule = (req, res, next) => {
    if (req.params.event === 'mini') {
        db('schedule')
            .join('users', 'users.id', 'schedule.created_by')
            .join('minigame AS p1', 'p1.id', 'schedule.player_id_1')
            .join('minigame AS p2', 'p2.id', 'schedule.player_id_2')
            .select('schedule.id', 'event_name', 'description', 'start_at', 'name AS created_by', 'p1.name_ingame AS name_ingame_1', 'p2.name_ingame AS name_ingame_2', 'schedule.created_at', 'schedule.updated_at')
            .then(row => res.send(row))
            .catch(err => next(err));
    } else if (req.params.event === 'game') {
        db('schedule')
            .join('users', 'users.id', 'schedule.created_by')
            .join('team AS t1', 't1.id', 'schedule.team_id_1')
            .join('team AS t2', 't2.id', 'schedule.team_id_2')
            .select('schedule.id', 'event_name', 'description', 'start_at', 'name AS created_by', 't1.team_name AS team_name_1', 't1.team_logo AS team_logo_1', 't2.team_name AS team_name_2', 't2.team_logo AS team_logo_2', 'schedule.created_at', 'schedule.updated_at')
            .then(row => res.send(row))
            .catch(err => next(err));
    } else {
        next();
    }
}

const addSchedule = (req, res, next) => {
    db('schedule')
        .insert({
            event_name: req.body.event_name,
            description: req.body.description ? req.body.description : '-',
            start_at: req.body.start_at ? req.body.start_at : moment().add(1, 'd').toDate(),
            created_by: req.user.userId,
            team_id_1: req.body.team_id_1,
            team_id_2: req.body.team_id_2,
            player_id_1: req.body.player_id_1,
            player_id_2: req.body.player_id_2
        })
        .then(() => {
            res.status(201).json({
                status: "success"
            });
        })
        .catch(error => next(error));
}

const removeSchedule = (req, res, next) => {
    db('schedule')
        .where({ id: req.body.id })
        .del()
        .then(total => {
            res.status(200).json({
                status: "success",
                event_removed: total
            })
        })
        .catch(error => next(error));
}

const editSchedule = (req, res, next) => {
    db('schedule')
        .where({ id: req.body.id })
        .update({
            ...req.body.event_name ? {event_name: req.body.event_name} : {},
            ...req.body.description ? {description: req.body.description} : {},
            ...req.body.start_at ? {start_at: req.body.start_at} : {},
            ...req.body.team_id_1 ? {team_id_1: req.body.team_id_1} : {},
            ...req.body.team_id_2 ? {team_id_1: req.body.team_id_2} : {},
            ...req.body.player_id_1 ? {player_id_1: req.body.player_id_1} : {},
            ...req.body.player_id_2 ? {player_id_2: req.body.player_id_2} : {},
            updated_at: new Date() 
        })
        .then(total => {
            res.status(200).json({ 
                status: "success",
                event_updated: total
            })
        })
        .catch(error => next(error));
}

const blastWA = async (req, res, next) => {
    if (req.params.event === 'talkshow') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('users')
            .join('talkshow', 'users.id', 'talkshow.user_id')
            .select('users.id', 'email', 'phone_number', 'name');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].phone_number,
                    event: 'talkshow'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].phone_number,
                    event: 'talkshow'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }

        // await res.status(200).json({
        //     total_participants: participants.length,
        //     success: success,
        //     failed: failed
        // });
        res.send('ok');
        // setTimeout(() => {
        //     Promise.all(promises).then(() => {
        //         res.status(200).json({
        //             total_participants: participants.length,
        //             success: success,
        //             failed: failed
        //         });
        //     });
        // }, time);
    } else if (req.params.event === 'mini') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('users')
            .join('minigame', 'users.id', 'minigame.user_id')
            .select('users.id', 'email', 'phone_number', 'name');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].phone_number,
                    event: 'minigame'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].phone_number,
                    event: 'minigame'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }
        
        res.send('ok');
    } else if (req.params.event === 'game') {
        if (!req.body.message) return res.status(406).json({status: "message not accepted!"}) 
        // let failed = [];
        // let success = [];
        // let promises = [];
        const participants = await db('users')
            .join('team', 'users.id', 'team.leader_id')
            .select('users.id', 'email', 'phone_number', 'name');

        for (let i=0; i<participants.length; i++) {
            try {
                let res = await axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": participants[i].phone_number,
                        "message": req.body.message
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                })
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'success',
                    phone_number: participants[i].phone_number,
                    event: 'game'
                }).then();
                // success.push(JSON.parse(res.config.data).number);
            } catch(res) {
                db('blast').insert({
                    message: req.body.message,
                    message_time: new Date(),
                    status: 'failed',
                    phone_number: participants[i].phone_number,
                    event: 'game'
                }).then();
                // failed.push(JSON.parse(res.config.data).number);
            }
            await blastDelay(3000);
        }
        
        res.send('ok');
    } else {
        next();
    }
}

const blastEmail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: '',
        subject: 'Test: sending Email using Nodejs',
        text: 'Test'
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Email sent: ' + info.response);
    });

    res.send('success mungkin');
}


module.exports = {
    addSchedule,
    getSchedule,
    removeSchedule,
    editSchedule,
    getPlayersRev,
    getPlayersByTeamRev,
    getTeamsRev,
    deleteData,
    blastWARev,
    blastEmail,
    getLogs
}