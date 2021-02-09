const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../src/users/user.service');

async function isRevoked(req, payload, done) {
    console.log("in isRevoked => ", payload);
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};


function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/api/login',
            '/api/signup/otp/request',
            '/api/signup/otp/resend',
            '/api/signup/otp/validate',
            '/api/signup/save',
            '/api/signup/id/validation',
            '/school/search',
            '/school/save',
            '/school/getusers/univ',
            '/school/getusers/school',
            '/document/upload',
            '/hobby/get',
            '/hobby/save',
            '/api/get/userInfo'
        ]
    });
}

module.exports = jwt;

