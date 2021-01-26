const express = require('express');
const router = express.Router();
const schoolService = require('./school.service');
var multer  = require('multer')
var upload = multer({ dest: __dirname +'uploads/' });
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            // req.user = user;
            console.log("user => ",user);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// routes
router.get('/search', authenticateJWT ,search);
router.post('/save', authenticateJWT ,save);
router.get('/getusers/school', authenticateJWT ,matchSameSchool);
router.post('/getusers/univ', authenticateJWT ,matchSameUniv);
router.post('/upload', authenticateJWT ,upload.array('file', 12) , uploadImage);

module.exports = router;

function search(req, res, next) {
    schoolService.search(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function save(req, res, next) {
    schoolService.save(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function matchSameSchool(req, res, next) {
    schoolService.matchSameSchool(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function matchSameUniv(req, res, next) {
    schoolService.matchSameUniv(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function uploadImage(req, res, next) {
    schoolService.uploadImage(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}



// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function update(req, res, next) {
//     userService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     userService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function authenticate(req, res, next) {
//     userService.authenticate(req.body)
//         .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
//         .catch(err => next(err));
// }

// function getAll(req, res, next) {
//     userService.getAll()
//         .then(users => res.json(users))
//         .catch(err => next(err));
// }