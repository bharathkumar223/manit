const express = require('express');
const router = express.Router();
const userService = require('./user.verification.service');
const authenticateJWT = require('../auth/auth')

// routes
router.get('/request', authenticateJWT ,userRequest);
router.get('/requestInfo', authenticateJWT ,getRequestInfo);

module.exports = router;

function userRequest(req, res, next) {
    console.log(req.body)
    userService.userRequest(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getRequestInfo(req, res, next) {
    console.log(req.body)
    userService.getRequestInfo({...req.body,...req.query})
        .then(response => res.json(response))
        .catch(err => next(err));
}




