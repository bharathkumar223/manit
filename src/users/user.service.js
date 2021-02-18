const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
var springedge = require('springedge');
const User = db.User;
const UserVerification = db.UserVerification
const globals = require('../../globals');
const { School } = require('../../_helpers/db');

module.exports = {
    requestOTP,
    resendOTP,
    validateOTP,
    login,
    saveInfo,
    getById,
    isIdAvailable,
    savePersonalInfo,
    requestVerification,
    getVerificationRequest,
    respondVerificationRequest,
    getUserInfo,
    getProfile,
    getNavigation,
    editIsNewUser
};

async function getProfile({userId}){
    const user = await User.findOne({id:userId})
    let schoolList = []
    if(user){
        if(user.highSchoolId){
            const school = await School.findOne({_id:user.highSchoolId})
            if(school){
                schoolList.push({highSchool:{
                    name:school.name,
                    enrollment:school.enrollment,
                    verificationStatus:school.verificationStatus
                }})
            }
        }
        if(user.midSchoolId){
            const school = await School.findOne({_id:user.midSchoolId})
            if(school){
                schoolList.push({midSchool:{
                    name:school.name,
                    enrollment:school.enrollment,
                    verificationStatus:school.verificationStatus
                }})
            }  
        }
        if(user.universityId){
            const school = await School.findOne({_id:user.universityId})
            if(school){
                schoolList.push({university:{
                    name:school.name,
                    enrollment:school.enrollment,
                    verificationStatus:school.verificationStatus
                }})
            }  
        }
    }else{
        return {
            status:"success",
            message:"user not found for given id : "+userId
        }
    }
    return {
        status:"success",
        school:schoolList,
        hobby:user.hobbies
    }
}

async function respondVerificationRequest({id, requestById, school, status}){
    const userVerification = await UserVerification.findOne({
        requestBy:requestById,
        requestTo:requestToId,
        school:school
    })
    //add code to make sure the status sent from user is either of the approve/decline/pass
    if(userVerification){
        Object.assign(userVerification,{status:status});
        await userVerification.save(function(err, user) {
            if (err) {
                console.log(err);
                return {
                    status:"fail",
                    message:"Error while updating the status , Error : " + err
                }
            }
            return {
                status:"success",
                message:"status updated"
            }
        });
    }else{
        return {
            status:"fail",
            message:"There is no request with the given combination"
        }
    }
}

async function requestVerification({requestById, requestToId, school}){
    const userVerification = await UserVerification.findOne({
        requestBy:requestById,
        requestTo:requestToId,
        school:school
    })
    if(userVerification){
        return{
            status:"fail",
            message:"Request is already placed and the status is : " + userVerification.status
        }
    }
    userVerification = new UserVerification({
        requestBy:requestById,
        requestTo:requestToId,
        school:school
    });
    await userVerification.save(function(err, user) {
        if (err) {
            console.log(err);
            return {
                status:"fail",
                message:"Error while placing the request , Error : " + err
            }
        }
        return {
            status:"success",
            message:"Request placed successfully"
        }
    });

}

async function getVerificationRequest({id}){
    
    const user = await User.findOne({id});
    if(!user){
        return {
            status:"fail",
            message:"Unable to find user with the given id : " + id
        }
    }
    return UserVerification.find({requestToId:id},function(err,docs){
        if(err){
            return {
                status:'fail',
                message:err
            }
        }else{
            return {
                users:docs
            }
        }
    })
}

async function getUserInfo(userParam){
    
    console.log("userParam=>",userParam)
    const user = await User.findOne({id:userParam.userId})
    if(user){
        console.log("user=>",user)
        return {
            status:"success",
            message:"user found",
            user:user
        }
    }else{
        return {
            status:"fail",
            message:"Unable to find the user with given credentials"
        }
    }
}

async function sendOTP(user){

    var generatedOTP = Math.floor(100000 + Math.random() * 900000);
    Object.assign(user,{otp:generatedOTP});
    await user.save();


    //demo test credentials from springedge
    var params = {
        'apikey': '6mj40q3t7o89qz93cn0aytz8itxg6641', // API Key
        'sender': 'SEDEMO', // Sender Name
        'to': [
            user.mobile //Moblie Number
        ],
        'message': 'Hi, this is a test message from spring edge',
        // 'message': 'OTP for manito app verification : ' + generatedOTP,
        'format': 'json'
        };
        
        return new Promise((resolve, reject) => {
            springedge.messages.send(params, 5000, function (err, response) {
        
                // if (response {
                    console.log("response=> ",response);
                    resolve({
                        status:"success",
                        message:"successfully sent the OTP",
                        OtpDetails:response
                    })
                // }else{
                //     console.log("error => ",response.error);
                //     reject({
                //         status:"fail",
                //         message:"Unable to send OTP",
                //         OtpDetails:response
                //     })
                // }
            })
        }) 
}





async function requestOTP(userParam) {
    // validate
    const user = await User.findOne({ id: userParam.userId })
    const koreanPhoneRegex = new RegExp(globals.koreanMobileRegex);
    if(koreanPhoneRegex.test(userParam.mobile)){
        if (user) {
            //sendOTP
            Object.assign(user,{mobile:userParam.mobile});
            return sendOTP(user);
        }else{
            return {
                status:"fail",
                message:"User not found with the given id, please signup before requesting OTP"
            }
            // throw "User not found with the given id, please signup before requesting OTP"
        }
    }else{
        return {
            status:"fail",
            message:"mobile is not in the format of korean phone number"
        }
        // throw "mobile is not in the format of korean phone number"
    }
}

async function resendOTP(userParam) {
    
    const user  =  await User.findOne({ id: userParam.userId});
    
    if (user) {
        return sendOTP(user);
    }else{
        return {
            status:"fail",
            message:"user with given id not found , id : " + userParam.userId
        }
        // throw "user with given id not found , id : " + userParam.userId
    }

}

async function validateOTP(userParam) {

    const user = await User.findOne({ id : userParam.userId });
    if (user) {
        if (user.otp === userParam.otp){
            Object.assign(user,{isVerified:true})
            await user.save()
            return {
                status : "success",
                message:"Successfully verified OTP",
            }
        }else{
            return {
                status : "fail",
                message:"OTP does not match,please try again"
            }
            // throw "OTP does not match,please try again"
        }
    }else{
        return {
            status : "fail",
            message:"user with given id " + userParam.userId + " not found"
        }
        // throw 'user with given id "' + userParam.userId + '" not found';
    }

}

async function login({ id, password }) {
    
    const user = await User.findOne({ id });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            status : "success",
            message : "successfully found the user" ,
            token
        };
    }else{
        // throw "user id or password is incorrect"
        return {
            status : "fail",
            message : "user id or password is incorrect"
        }
    }
}

async function saveInfo({id , password}){

    const user = await User.findOne({id});
    if(user){
        return {
            status : "fail",
            message:"user already signed up with the id : " + id
        }
        // throw "user already signed up with the id : " + id
    }else{
        var hash = bcrypt.hashSync(password, 10);
        const newUser = new User({id : id, hash:hash});
        await newUser.save();
        const token = jwt.sign({ sub: id }, config.secret, { expiresIn: '7d' });
        return {
            status : "success",
            message : "New password created successfully",
            token:token
        };
    }
}

async function isIdAvailable({id}){
    const user = await User.findOne({id});

    if(user){
        return {
            status:"fail",
            message:"Id already taken, please choose another id"
        }
    }
    else{
        return {
            status:"success",
            message:"Id is available"
        }
    }
}

async function getNavigation({userId}){
    
    const user = await User.findOne({id : userId});

    if(user){
        return {
            status:"success",
            isVerified:user.isVerified,
            isNewUser:user.isNewUser,
            isPersonalInfo:user.isPersonalInfo,
        }
    }
    else{
        return {
            status:"fail",
            message:"user with the id " + userId + " doest not exist"
        }
    }
}

async function editIsNewUser({userId,isNewUser}){
    const user = await User.findOne({id : userId});
    return new Promise((resolve) => {
        if(user){
            Object.assign(user,{isNewUser:isNewUser})
             user.save()
            .then(user=>{
                resolve({
                    status:"success",
                    message:"successfully modified isNewUser to : " + user.isNewUser
                })
            })
            .catch(err=>{
                resolve( {
                    status:"fail",
                    message:"Error while updating isNewUser : " + err.message
                })
            })
            
        }
        else{
            resolve( {
                status:"fail",
                message:"user with the id " + userId + " doest not exist"
            })
        }
    })
}

async function savePersonalInfo(userParam){

    const user = await User.findOne({id : userParam.userId});

    if(user){
        Object.assign(user,{name:userParam.name,
                            gender:userParam.gender,
                            birthDate:userParam.birthDate,
                            isPersonalInfo:true
                        });
        await user.save();
        return {
            status:"success",
            message:"personal info saved successfully",
        }
    }
    else{
        return {
            status:"fail",
            message:"user with the id " + userParam.userId + " doest not exist"
        }
    }
}

// async function getAll() {
//     return await User.find();
// }

async function getById(id) {
    const user = await User.findById(id);
    console.log("getById => ", id , user);
}

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