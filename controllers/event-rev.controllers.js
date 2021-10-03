const db = require("../config/database");
const axios = require('axios');

const registerGame = async (req, res, next) => {
    if (!req.body.leader_email || !req.body.leader_phone_number || !req.body.leader_name || !req.body.leader_name_ingame) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('game-rev').where({leader_email: req.body.leader_email}).select('leader_email');
    let checkPhone = await db.from('game-rev').where({leader_phone_number: req.body.leader_phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('leader_phone_number');

    if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to participate in game event"})

    axios({
        url: 'https://wa.bot.ghifar.dev/sendText',
        data: JSON.stringify({
            "user_id": process.env.WA_ID,
            "number": req.body.leader_phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
            "message": "Terima kasih telah mendaftar kompetisi Valorant pada ASIG 14!\n" + "Nantikan informasi berikutnya mengenai kompetisi melalui nomor ini.\n"
        }),
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": process.env.WA_AUTH
        }
    }).then(() => {
        db.transaction(trx => {
            let fullUrl;

            if (req.file) {
                const halfUrl = req.protocol + '://' + req.get('host') + '/';
                fullUrl = halfUrl + req.file.path.replace(/\\/g, "/");
            }
                
            const members = [];
            // console.log(req.body.name.length)
            const nameConverted = req.body.name.split(',');
            const phoneConverted = req.body.phone_number.split(',');
            const nameGameConverted = req.body.name_ingame.split(',');

            const dataLength = nameConverted.length;
            
            for (let i=0; i<dataLength; i++) {
                if (!nameConverted[i] || !phoneConverted[i] || !nameGameConverted[i]) return res.status(406).json({status: "registration not accepted!"})
                members.push({
                    name: nameConverted[i],
                    phone_number: phoneConverted[i],
                    name_ingame: nameGameConverted[i]
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
    }).catch(() => {
        res.status(400).json({
            status: "Nomor WA ketua salah!"
        });
    })
}

const registerMinigame = async (req, res, next) => {
    if (!req.body.email || !req.body.phone_number || !req.body.name || !req.body.name_ingame) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('minigame-rev').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('minigame-rev').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');

    if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to participate in minigame event"})

    axios({
        url: 'https://wa.bot.ghifar.dev/sendText',
        data: JSON.stringify({
            "user_id": process.env.WA_ID,
            "number": req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
            "message": "Terima kasih telah mendaftar kompetisi Ludo pada ASIG 14!\n" + "Nantikan informasi berikutnya mengenai kompetisi melalui nomor ini.\n"
        }),
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": process.env.WA_AUTH
        }
    }).then(() => {
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
    }).catch(() => {
        res.status(400).json({
            status: "Nomor WA salah!"
        });
    })
}

const registerTalkshow = async (req, res, next) => {
    if (!req.body.email || !req.body.phone_number || !req.body.name || !req.body.instansi || !req.body.pekerjaan) return res.status(406).json({status: "registration not accepted!"})
    
    let checkEmail = await db.from('talkshow-rev').where({email: req.body.email}).select('email');
    let checkPhone = await db.from('talkshow-rev').where({phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62')}).select('phone_number');

    if (checkEmail.length > 0 || checkPhone.length > 0) return res.status(400).json({status: "user has already registered to attend the talkshow"})

    let idDaftar = Date.now() + "" + Math.floor(Math.random() * 10);

    axios({
        url: 'https://wa.bot.ghifar.dev/sendText',
        data: JSON.stringify({
            "user_id": process.env.WA_ID,
            "number": req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
            "message": "Terima kasih telah mendaftar Talkshow ASIG 14!\n\n" 
            + "ID Pendaftaran Anda: " + idDaftar + "\n\n"
            + "Simpan ID Pendaftaran sebagai langkah untuk memverifikasi presensi Anda dalam Talkshow.\n\n"
            + "*Pengingat Talkshow beserta link nya akan diberitahukan melalui nomor whatsapp ini."
        }),
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": process.env.WA_AUTH
        }
    }).then(() => {
        db('talkshow-rev')
            .insert({
                id_pendaftaran: idDaftar,
                email: req.body.email,
                phone_number: req.body.phone_number.replace(/^[+]/, '').replace(/^0/, '62'),
                name: req.body.name,
                instansi: req.body.instansi,
                pekerjaan: req.body.pekerjaan,
                nim: req.body.nim ? req.body.nim : null
            })
            .then(() => {
                res.status(200).json({
                    status: "success"
                });
            })
            .catch(error => next(error));
    }).catch(() => {
        res.status(400).json({
            status: "Nomor WA salah!"
        });
    })
}

module.exports = {
    registerGame,
    registerTalkshow,
    registerMinigame
} 