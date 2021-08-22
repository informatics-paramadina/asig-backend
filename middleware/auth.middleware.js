const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, "shhhhh");
        const user = await decodedToken;

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            error: "Not Authorized!"
        });
    }
};

const adminMiddleware = async (req, res, next) => {
    if (req.user.userRole !==  'admin') {
        return res.status(401).json({
            error: "Not Authorized!"
        });
    }
    next();
}

module.exports = {
    authMiddleware,
    adminMiddleware
}
