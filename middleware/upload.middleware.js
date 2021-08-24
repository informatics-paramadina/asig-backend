const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname);
        // cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file if its not jpeg or png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {   
        cb(null, true);
    } else {
        cb(new Error('error, the file that you are trying to upload is not an image'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 8
    },
    fileFilter: fileFilter
});

module.exports = upload;