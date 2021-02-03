const express = require('express');
const router = express.Router();
const docService = require('./document.verification.service');
const authenticateJWT = require('../auth/auth');
const multer = require('multer')

var upload = multer({ dest: 'assets/Images' })

router.post('/upload', authenticateJWT, upload.single('document') ,docUpload);
router.get('/get',authenticateJWT,getDocuments)
router.put('/action', authenticateJWT, docAction);

module.exports = router;

function docUpload(req, res, next) {
    docService.docUpload(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getDocuments(req, res, next) {
    docService.getDocuments(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function docAction(req, res, next) {
    docService.docAction(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}


