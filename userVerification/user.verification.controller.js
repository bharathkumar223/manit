const express = require('express');
const router = express.Router();
const hobbyService = require('./hobby.service');
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
router.get('/get', authenticateJWT ,getHobbies);
router.post('/save', authenticateJWT ,saveHobbies);

module.exports = router;

function getHobbies(req, res, next) {
    hobbyService.getHobbies(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function saveHobbies(req, res, next) {
    hobbyService.saveHobbies(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}
