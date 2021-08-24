const db = require("../config/database");

const uploadLogo = (req, res, next) => {
    try {
        const halfUrl = req.protocol + '://' + req.get('host') + '/';
        const fullUrl = halfUrl + req.file.path.replace(/\\/g, "/")
        
        res.redirect(fullUrl);
    } catch(error) {
        next(error);
    }
};
module.exports = {
    uploadLogo
} 