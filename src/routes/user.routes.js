let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    { v4: uuidv4 } = require('uuid'),
    router = express.Router();
    //tf = require("@tensorflow/tfjs"),
    //tfn = require("@tensorflow/tfjs-node");

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model
let User = require('../models/User');

router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        profileImg: url + '/public/' + req.file.filename
    });
    

    //const handler = tfn.io.fileSystem(user.profileImg)
    //const model = tf.loadLayersModel('http://localhost:8000/public/models/applesModel.json')
    //user.prediction = model.predict(user.profileImg)
    
    /// DEBUGG!!!!
    //console.log(`registering user at url ${user.profileImg} or sending it back`)

    user.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(`${err} error??? hello????`),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;