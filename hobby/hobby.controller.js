const express = require('express');
const router = express.Router();
const hobbyService = require('./hobby.service');
const authenticateJWT = require('../auth/auth')

// routes
router.get('/get', authenticateJWT ,getHobbies);
router.post('/save', authenticateJWT ,saveHobbies);
router.delete('/delete', authenticateJWT ,deleteHobbies);

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

function deleteHobbies(req, res, next) {
    hobbyService.deleteHobbies(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}
