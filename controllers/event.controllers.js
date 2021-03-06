const db = require("../config/database");
const axios = require('axios');

const uploadLogo = (req, res, next) => {
    try {
        const halfUrl = req.protocol + '://' + req.get('host') + '/';
        const fullUrl = halfUrl + req.file.path.replace(/\\/g, "/");
        
        res.redirect(fullUrl);
    } catch(error) {
        next(error);
    }
};

const uploadBuktiPembayaran = async (req, res, next) => {
    let getUser = await db("users")
        .join('team', 'team.leader_id', 'users.id')
        .whereRaw('users.id = ?', [req.user.userId])
        .select('team.id AS team_id')
        .first();

    if (!req.file) return res.status(406).json({status: "no file uploaded!"}) 

    const halfUrl = req.protocol + '://' + req.get('host') + '/';
    const fullUrl = halfUrl + req.file.path.replace(/\\/g, "/");

    db("bukti")
        .insert({
            team_id: getUser.team_id,
            file_bukti: fullUrl,
            nama_rekening: req.body.nama_rekening
        })
        .then(() => {
            res.status(201).json({
                status: "success"
            });
        })
        .catch(error => next(error));
};

const registerGame = async (req, res, next) => {
    let checkUser = 
        await db("users")
                .join('team', 'team.leader_id', 'users.id')
                .whereRaw('users.id = ?', [req.user.userId])
                .select();
    if (checkUser.length > 0) return res.status(400).json({status: "user has already registered to participate in game event"})

    db.transaction(trx => {
        let fullUrl;

        if (req.file) {
            const halfUrl = req.protocol + '://' + req.get('host') + '/';
            fullUrl = halfUrl + req.file.path.replace(/\\/g, "/");
        }
            
        const members = [];
        // console.log(req.body.name.length)
        const dataLength = req.body.name.length;
        
        for (let i=0; i<dataLength; i++) {
            if (!req.body.name[i] || !req.body.phone_number[i] || !req.body.name_ingame[i]) return res.status(406).json({status: "registration not accepted!"})
            members.push({
                name: req.body.name[i],
                phone_number: req.body.phone_number[i],
                name_ingame: req.body.name_ingame[i]
            })
        }

        if (!req.body.team_name) return res.status(406).json({status: "registration not accepted!"})

        db
            .insert({
                team_name: req.body.team_name,
                team_logo: req.file ? fullUrl : req.protocol + '://' + req.get('host') + '/images/default.png',
                leader_id: req.user.userId,
            })
            .into('team')
            .transacting(trx)
            .then(ids => {
                members.forEach(member => member.team_id = ids[0]);
                return db('member').insert(members).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })    
    .then(() => {
        res.status(201).json({
            status: "success",
        });
    })
    .catch(error => next(error));
}

const registerMinigame = async (req, res, next) => {
    let checkUser = 
        await db("users")
                .join('minigame', 'minigame.user_id', 'users.id')
                .whereRaw('users.id = ?', [req.user.userId])
                .select();
    if (checkUser.length > 0) return res.status(400).json({status: "user has already registered to participate in minigame event"})

    if (!req.body.name_ingame) return res.status(406).json({status: "registration not accepted!"})

    db('minigame')
        .insert({
            name_ingame: req.body.name_ingame,
            user_id: req.user.userId
        })
        .then(() => {
            res.status(201).json({
                status: "success"
            });
        })
        .catch(error => next(error));
}

const registerTalkshow = async (req, res, next) => {
    let checkUser = 
        await db("users")
                .join('talkshow', 'talkshow.user_id', 'users.id')
                .whereRaw('users.id = ?', [req.user.userId])
                .select();
    if (checkUser.length > 0) return res.status(400).json({status: "user has already registered to attend the talkshow"})

    if (!req.body.instansi || !req.body.pekerjaan) return res.status(406).json({status: "registration not accepted!"})

    db.transaction(trx => {
        db
            .insert({
                uuid: Date.now() + "" + Math.floor(Math.random() * 10),
                instansi: req.body.instansi,
                pekerjaan: req.body.pekerjaan,
                nim: req.body.nim ? req.body.nim : null,
                user_id: req.user.userId
            })
            .into('talkshow')
            .transacting(trx)
            .then(id_user => {
                const getUUID = db('talkshow').where({id: id_user[0]}).select('uuid');
                return db('presence').insert({'user_uuid': getUUID}).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })    
    .then((id) => {
        db('presence')
            .join('talkshow', 'talkshow.uuid', 'presence.user_uuid')
            .join('users', 'users.id', 'talkshow.user_id')
            .whereRaw('presence.id = ?', [id[0]])
            .select('users.phone_number', 'presence.user_uuid')
            .then(data => {
                axios({
                    url: 'https://wa.bot.ghifar.dev/sendText',
                    data: JSON.stringify({
                        "user_id": process.env.WA_ID,
                        "number": data[0].phone_number,
                        "message": "Terima kasih telah mendaftar Talkshow ASIG 14!\n\n" 
                        + "ID Pendaftaran Anda: " + data[0].user_uuid + "\n\n"
                        + "Simpan ID Pendaftaran sebagai langkah untuk memverifikasi presensi Anda dalam Talkshow."
                    }),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": process.env.WA_AUTH
                    }
                }).then((response) => {
                    res.status(201).json({
                        status: response.data.status,
                        uuid: data[0].user_uuid
                    });
                }).catch(() => {
                    res.status(400).json({
                        status: "send otp via wa gagal!",
                        uuid: data[0].user_uuid
                    });
                })
            })


        // db('presence').where({id: id[0]}).select('user_uuid').then(data => {
        //     request.post({
        //         url: 'https://wa.bot.ghifar.dev/sendText',
        //         body: JSON.stringify({
        //             "user_id": process.env.WA_ID,
        //             "number": process.env.WA_NUMBER,
        //             "message": "Terima kasih telah mendaftar Talkshow ASIG 14!\n\n" 
        //             + "ID Pendaftaran Anda: " + data[0].user_uuid + "\n\n"
        //             + "Simpan ID Pendaftaran sebagai langkah untuk memverifikasi presensi Anda dalam Talkshow."
        //         }),
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             "Authorization": process.env.WA_AUTH
        //         }
        //     })
        //     res.status(201).json({
        //         status: "success",
        //         uuid: data[0].user_uuid
        //     });
        // })
    })
    .catch(error => next(error));
}

module.exports = {
    uploadLogo,
    registerGame,
    registerTalkshow,
    registerMinigame,
    uploadBuktiPembayaran
} 