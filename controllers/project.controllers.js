const db = require("../config/database"); 

const getProjects = (req, res, next) => {
    db.from('project').select().then(row => res.send(row)).catch(err => next(err));
};

// res.status(500).send(err)
module.exports = {
    getProjects
};