const db = require('../../_helpers/db');
const UserVerification = db.UserVerification
const DocumentVerification = db.DocumentVerification
const School = db.School
const schoolService = require('../school/school.service');
module.exports = {
    userRequest
};

// async function getRequestInfo({userId,school}){
//     let documentInprocess
//     const response = await getRequest(userId,school)
//     if(response.status === "success"){
//         const documentVerification = await DocumentVerification.findOne({
//             id:userId,
//             school:school,
//             status:"Pending"
//         })
//         if(documentVerification){
//             documentInprocess = true
//         }else{
//             documentInprocess = false
//         }
//     }
//     return{
//         ...response,
//         documentInprocess:documentInprocess
//     }
// }

async function userRequest(req){
    
    const {userId,requestedTo,schoolName,enrollment,
            department,yearOfEntrance,schoolType} = req.body

    const schoolSaveStatus = await new Promise((resolve) =>{
        schoolService.save({schoolName:schoolName,
            userId:userId,
            enrollment:enrollment,
            department:department,
            yearOfEntrance:yearOfEntrance,
            schoolType:schoolType})
            .then(response => {
                resolve({
                    status:response.status,
                    message: response.message,
                    id:response.id
                })
            })
            .catch(err => {
                resolve({
                    status:"fail",
                    message:"Error while saving school info , " + err.message
                })
            });
        })

    if(schoolSaveStatus.status === "fail"){
        return schoolSaveStatus
    }

    let userRequests = []
    for(const requestTo of requestedTo){
        userRequests = [
            ...userRequests,
            await new Promise((resolve) =>{
                const userVerification = new UserVerification({
                    requestBy:userId,
                    requestTo:requestTo,
                    school:schoolSaveStatus.id
                })
                userVerification.save()
                .then(()=>{
                    resolve({
                        user:requestTo,
                        status:"success",
                        message:"Successfully placed the request to the user : " + requestTo
                    })
                }).catch((error)=>{
                    resolve({
                        user:requestTo,
                        status:"fail",
                        message:"Error requesting the user " + requestTo + " : " + error.message
                    })
                }); 
            
            })
        ]
    }
    
    return { 
        status:"success",
        userRequests:userRequests,
        schoolSaveStatus:schoolSaveStatus
    }
}
