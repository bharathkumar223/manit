const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var springedge = require('springedge');
const User = db.User;

module.exports = {
    requestOTP,
    resendOTP,
    validateOTP,
    login,
    saveInfo
};

async function sendOTP(user){

    var generatedOTP = Math.floor(100000 + Math.random() * 900000);
    user.otp = generatedOTP;

    //copy userParam properties to user
    await user.save();

    //demo test credentials from springedge
    var params = {
        'apikey': '6mj40q3t7o89qz93cn0aytz8itxg6641', // API Key
        'sender': 'SEDEMO', // Sender Name
        'to': [
            user.mobile //Moblie Number
        ],
        'message': 'Hi, this is a test message from spring edge',
        'format': 'json'
        };
        
        springedge.messages.send(params, 5000, function (err, response) {
            
            if (err) {
                console.log("error while sending verification code",err);
                // throw 'error while sending verification code "' + err + '"';
                return {
                    status : "error while sending verification code , " + err.error
                }
            }else{
                console.log("successfully sent the verification code",response);
                return {
                    status : "successfully sent the verification code"
                }
            }
        });
}

async function requestOTP(userParam) {
    // validate
    // if (await User.findOne({ id: userParam.id })) {
    //     throw 'Device id "' + userParam.id + '" is already present';
    // }

    // save user
    const user = new User(userParam);

    //sendOTP
    return sendOTP(user);

}

async function resendOTP(userParam) {
    // validate
    const user  =  await User.find({ id: userParam.id , mobile: userParam.mobile });
    
    if (user) {
        return sendOTP(user);
    }else{
        throw 'user with given mobile and deviceId pair not found , "' 
                + userParam.mobile + '", "' + userParam.id +'"';
    }
    

}



async function validateOTP({otp,id}) {

    const user = await User.findOne({ id });
    // validate
    if (user) {
        if (otp === user.otp){
            return {
                status : "match"
            }
        }else{
            return {
                status : "mismatch"
            }
        }
    }else{
        throw 'user with given id "' + userParam.id + '" not found';
    }

}

async function login({ id, password, mobile }) {
    
    const user = await User.findOne({ id , mobile});
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            // ...user.toJSON(),
            token,
            status : "success",
            message : "successfully found the user"
        };
    }else{
        return {
            status : "success",
            message : "user not found"
        }

    }
}

async function saveInfo({id , password}){
    // validate

    const user = await User.findOne({id});
    if(user){
        var hash = bcrypt.hashSync(password, 10);
        Object.assign(user,{hash:hash});
        await user.save();
    }else{
        return {
            status : "user not found"
        }
    }
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            // ...user.toJSON(),
            token,
            status : "success",
            message : "password created successfully"
        };
    }else{
        return {
            status : "user not found"
        }
    }
    // await User.findOne({id}, function(err, user) {
    //       // do your updates here
    //     user.password = password;
    //     await user.save();
    //     if (user && bcrypt.compareSync(password, user.hash)) {
    //         const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    //         return {
    //             // ...user.toJSON(),
    //             token,
    //             status : "success",
    //             message : "password created successfully"
    //         };
    //     }else{
    //         return {
    //             status : "user not found"
    //         }
    //     }
    //   })
}

// async function getAll() {
//     return await User.find();
// }

// async function getById(id) {
//     return await User.findById(id);
// }

// async function update(id, userParam) {
//     const user = await User.findById(id);

//     // validate
//     if (!user) throw 'User not found';
//     if (user.id !== userParam.id && await User.findOne({ id: userParam.id })) {
//         throw 'Username "' + userParam.id + '" is already taken';
//     }

//     // hash password if it was entered
//     if (userParam.password) {
//         userParam.hash = bcrypt.hashSync(userParam.password, 10);
//     }

//     // copy userParam properties to user
//     Object.assign(user, userParam);

//     await user.save();
// }

// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }


// hash password
// if (userParam.password) {
//     user.hash = bcrypt.hashSync(userParam.password, 10);
// }