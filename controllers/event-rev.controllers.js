const db = require("../config/database");
const axios = require('axios');

const registerGame = async (req, res, next) => {
    if (!req.body.leader_email || !req.body.leader_phone_number || !req.body.leader_name || !req.body.leader_name_ingame) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('game-rev').where({leader_email: req.body.leader_email}).select('leader_email');
    let checkPhone = await db.from('game-rev').where({leader_phone_number: req.body.leader_phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('leader_phone_number');

    // if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to participate in game event"})

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
                leader_email: req.body.leader_email,
                leader_phone_number: req.body.leader_phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
                leader_name: req.body.leader_name,
                leader_name_ingame: req.body.leader_name_ingame,
                team_name: req.body.team_name,
                team_logo: req.file ? fullUrl : req.protocol + '://' + req.get('host') + '/images/default.png'
            })
            .into('game-rev')
            .transacting(trx)
            .then(ids => {
                members.forEach(member => member.team_id = ids[0]);
                return db('player-rev').insert(members).transacting(trx);
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
    if (!req.body.email || !req.body.phone_number || !req.body.name || !req.body.name_ingame) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('minigame-rev').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('minigame-rev').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');

    // if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to participate in minigame event"})

    db('minigame-rev')
        .insert({
            email: req.body.email,
            phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
            name: req.body.name,
            name_ingame: req.body.name_ingame
        })
        .then(() => {
            res.status(201).json({
                status: "success"
            });
        })
        .catch(error => next(error));
}

const registerTalkshow = async (req, res, next) => {
    if (!req.body.email || !req.body.phone_number || !req.body.name || !req.body.instansi || !req.body.pekerjaan) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('talkshow-rev').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('talkshow-rev').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');

    // if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to attend the talkshow"})

    db('talkshow-rev')
        .insert({
            id_pendaftaran: Date.now() + "" + Math.floor(Math.random() * 10),
            email: req.body.email,
            phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
            name: req.body.name,
            instansi: req.body.instansi,
            pekerjaan: req.body.pekerjaan,
            nim: req.body.nim ? req.body.nim : null
        })
        .then((id) => {
            db('talkshow-rev')
                .where({ id: id[0] })
                .select('phone_number', 'id_pendaftaran')
                .first()
                .then(data => {
                    axios({
                        url: 'https://wa.bot.ghifar.dev/sendText',
                        data: JSON.stringify({
                            "user_id": process.env.WA_ID,
                            "number": data.phone_number,
                            "message": "Terima kasih telah mendaftar Talkshow ASIG 14!\n\n" 
                            + "ID Pendaftaran Anda: " + data.id_pendaftaran + "\n\n"
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
                            uuid: data.id_pendaftaran
                        });
                    }).catch(() => {
                        res.status(400).json({
                            status: "send otp via wa gagal!",
                            uuid: data.id_pendaftaran
                        });
                    })
                })
        })
        .catch(error => next(error));
}

module.exports = {
    registerGame,
    registerTalkshow,
    registerMinigame
} 