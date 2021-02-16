const db = require('../../_helpers/db');
const UserVerification = db.UserVerification
const DocumentVerification = db.DocumentVerification
const School = db.School
const schoolService = require('../school/school.service');
module.exports = {
    userRequest,
    getStickerVerificationInfo
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

async function getStickerVerificationInfo({stickerId,userId}){
    const school = await School.findOne({_id:stickerId})
    if(!school){
        return{
            status:"fail",
            message:"sticker with the given id not found : " + stickerId
        }
    }
    let toExistingUsers = await new Promise((resolve) => {
    UserVerification.find({requestBy:userId,school:stickerId},
        function(err,docs){
            if(err){
                resolve({
                    status:"fail",
                    message:"Error while fetching requestInfo , "+err
                })
            }else{
                let pending = approve = decline = pass = requests = 0
                for(let doc of docs){
                    switch(doc.status){
                        case "Pending":{
                            pending++
                            break
                        }
                        case "Approve":{
                            approve++
                            break
                        }
                        case "Decline":{
                            decline++
                            break
                        }
                        case "Pass":{
                            pass++
                            break
                        }
                    }
                }
                requests = pending+pass+approve+decline
                let verificationStatus
                if(requests === 0){
                    verificationStatus = "none"
                }else if(approve>3){
                    verificationStatus = "approved"
                }else if(decline >3){
                    verificationStatus = "declined"
                }else{
                    verificationStatus = "pending"
                }
                resolve({
                    status:"success",
                    verificationStatus:verificationStatus,
                    requests:requests,
                    pending:pending,
                    approve:approve,
                    decline:decline,
                    pass:pass,
                }) 
                
            }
        })
    })
    let documentVerificationStatus
    const document = await DocumentVerification.findOne({school:stickerId})
    if(document){
        documentVerificationStatus = document.status
    }else{
        documentVerificationStatus = "none"
    }
    let response = {
        status:toExistingUsers.status,
        verificationStatus:school.verificationStatus,
        toExistingUsers:toExistingUsers,
        byDocument:{
            verificationStatus:documentVerificationStatus
        }
    }

    if(response.status === "fail"){
        Object.assign(response,{message:toExistingUsers.message})
    }

    return response

}

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
