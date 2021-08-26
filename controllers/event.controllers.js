const db = require("../config/database");
const request = require('request');

const uploadLogo = (req, res, next) => {
    try {
        const halfUrl = req.protocol + '://' + req.get('host') + '/';
        const fullUrl = halfUrl + req.file.path.replace(/\\/g, "/");
        
        res.redirect(fullUrl);
    } catch(error) {
        next(error);
    }
};

const registerGame = (req, res, next) => {
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
            members.push({
                name: req.body.name[i],
                phone_number: req.body.phone_number[i],
                name_ingame: req.body.name_ingame[i]
            })
        }

        db
            .insert({
                team_name: req.body.team_name,
                team_logo: req.file ? fullUrl : 'nope',
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

const registerMinigame = (req, res, next) => {
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

const registerTalkshow = (req, res, next) => {
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
        db('presence').where({id: id[0]}).select('user_uuid').then(data => {
            request.post({
                url: 'https://wa.bot.ghifar.dev/sendText',
                body: JSON.stringify({
                    "user_id": process.env.WA_ID,
                    "number": process.env.WA_NUMBER,
                    "message": `Terima kasih telah mendaftar Talkshow ASIG 14!
                    ID Pendaftaran Anda: ${data[0].user_uuid}
                    simpan ID Pendaftaran sebagai langkah untuk memverifikasi presensi Anda dalam Talkshow.`
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": process.env.WA_AUTH
                }
            })
            res.status(201).json({
                status: "success",
                uuid: data[0].user_uuid
            });
        })
    })
    .catch(error => next(error));
}

module.exports = {
    uploadLogo,
    registerGame,
    registerTalkshow,
    registerMinigame
} 