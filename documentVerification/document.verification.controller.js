const express = require('express');
const router = express.Router();
const docService = require('./document.verification.service');
const authenticateJWT = require('../auth/auth');
const multer = require('multer')

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, config.secret, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             // req.user = user;
//             console.log("user => ",user);
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

// routes


// var uploading = multer({
//     dest: function (req, file, cb) {
//         cb(null, process.cwd() +'\\assets\\Images\\'+ req.id)
//        },
//     filename: function (req, file, cb) {
//         console.log(file);
//         let extArray = file.mimetype.split("/");
//         let extension = extArray[extArray.length - 1];
//         // cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
//         cb(null, file.originalname + '-' + Date.now() + '.' + extension);
//         },
//     limits: {fileSize: 1000000, files:1},
//   });

// var uploading = function(req,res,next){
//     multer({
//         dest: process.cwd() +'\\assets\\Images\\'+ req.body.id ,
//         limits: {fileSize: 1000000, files:1},
//       })
//     next();
// }
var upload = multer({ dest: 'assets/Images' })

router.post('/upload', authenticateJWT, upload.single('avatar') ,docUpload);

module.exports = router;

function docUpload(req, res, next) {
    console.log(req)
    docService.docUpload(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}


