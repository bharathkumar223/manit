const db = require('../../_helpers/db');
const { School, Hobby, UserVerification, DocumentVerification, User} = require('../../_helpers/db');
module.exports = {
    getStickerVerificationInfo,
    getStickerInfo,
    removeSticker
};

async function removeSticker({stickerId,userId}){
    const school = await School.findOne({_id:stickerId})
    if(!school){
        const hobby = await Hobby.findOne({_id:stickerId})
        if(!hobby){
            return {
                status:"fail",
                message:"sticker not found for the given id : " + stickerId
            }
        }
        const user = await User.findOne({id:userId})
        if(user){
            return new Promise((resolve)=>{
                let temp = user.hobbies
                const index = temp.indexOf(stickerId);
                if (index > -1) {
                    temp.splice(index, 1);
                    Object.assign(user,{hobbies:temp})
                    user.save()
                    .then(()=>{
                        resolve( {
                            status:"success",
                            message:"successfully removed the sticker"
                        })
                    })
                    .catch(err=>{
                        resolve({
                            status:"fail",
                            message:"Error while removing the sticker : " + err.message
                        })
                    })
                }else{
                    resolve({
                        status:"fail",
                        message:"user " + userId + " does not possess the sticker " + hobby.name
                    })
                }
            })
        }else{
            return {
                status:"fail",
                message:"user not found for the given id :  " + userId
            }
        }
    }else{
        return new Promise((resolve) => {
            let unset
            if(school.schoolType === 'mid'){
                unset = {$unset:{midSchoolId:1}}
            }else if(school.schoolType === 'high'){
                unset = {$unset:{highSchoolId:1}}
            }else if(school.schoolType === 'university'){
                unset = {$unset:{universityId:1}}
            }else{
                resolve({
                    status:"fail",
                    message:"sticker school type is not valid : " + school.schoolType
                })
            }
            User.updateOne({id:userId},unset,function(err){
                if(err){
                    resolve({
                        status:"fail",
                        message:"Unable to remove the school sticker : "+err.message
                    })
                }
                School.deleteOne({_id:stickerId},function(err,doc){
                    if(err){
                        resolve({
                            status:"fail",
                            message:"unable to remove the school sticker ," + err.message
                        })
                    }else{
                        resolve({
                            status:"success",
                            message:"successfully removed the school sticker"
                        })  
                        
                    }
                })
            })
            
        })   
    }
}

async function getStickerInfo({stickerId}){
    const school = await School.findOne({_id:stickerId})
    if(!school){
        const hobby = await Hobby.findOne({_id:stickerId})
        if(!hobby){
            return {
                status:"fail",
                message:"sticker not found for the given id : " + stickerId
            }
        }
        return {
          status:"success",
          sticker:{
              type:"hobby",
              name:hobby.name
          }  
        }
    }
    let sticker = {
        type:school.schoolType,
        name:school.name,
        enrollment:school.enrollment,
        yearOfEntrance:school.yearOfEntrance
    }
    if(school.schoolType === "university"){
        Object.assign(sticker,{department:school.department})
    }
    return {
        status:"success",
        sticker:sticker
    }
}

async function getStickerVerificationInfo({userId,stickerId}){
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
