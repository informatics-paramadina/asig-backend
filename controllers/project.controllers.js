const db = require("../config/database");

const getAnimationProjects = (req, res, next) => {
    db.from('project').where({type: 'animasi'}).select().then(row => res.send(row)).catch(err => next(err));
};

const getGameProjects = (req, res, next) => {
    db.from('project').where({type: 'game'}).select().then(row => res.send(row)).catch(err => next(err));
};

// res.status(500).send(err)
module.exports = {
    getAnimationProjects,
    getGameProjects
};