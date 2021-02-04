const db = require('../_helpers/db');
const UserVerification = db.UserVerification
const DocumentVerification = db.DocumentVerification
const schoolService = require('../school/school.service');
module.exports = {
    userRequest,
    getRequestInfo
};

async function getRequestInfo({userId,school}){
    let documentInprocess
    const response = await getRequest(userId,school)
    if(response.status === "success"){
        const documentVerification = await DocumentVerification.findOne({
            id:userId,
            school:school,
            status:"Pending"
        })
        if(documentVerification){
            documentInprocess = true
        }else{
            documentInprocess = false
        }
    }
    return{
        ...response,
        documentInprocess:documentInprocess
    }
}

async function getRequest(userId,school){
    return new Promise((resolve, reject) => {
    UserVerification.find({requestBy:userId,school:school},
        function(err,docs){
            if(err){
                reject({
                    status:"fail",
                    message:"Error while fetching requestInfo , "+err
                })
            }else{
                let pending = approve = decline = pass = 0,documentInprocess
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
                resolve({
                    status:"success",
                    number:pending+pass+approve+decline,
                    pending:pending,
                    approve:approve,
                    decline:decline,
                    pass:pass
                }) 
                
            }
        })
    })
}

async function userRequest(req){
    
    const {userId,requestedTo,schoolName} = req.body
    return new Promise((resolve, reject) => {
        for(let requestTo of requestedTo){ 
            const userVerification = new UserVerification({
                requestBy:userId,
                requestTo:requestTo,
                school:schoolName
            })
            userVerification.save()
            .then((user)=>{
                console.log("successfully saved the request , "+user)
            }).catch((error)=>{
                resolve ({
                    status:"fail",
                    message:error.message
                })
            }
            );
            
        }
        schoolService.save(req.body)
            .then(response => {
                console.log("respone=>",response)
                resolve({
                    status:response.status==="success"?"success":"fail",
                    message:"saved the requests successfully" + " and " + response.message,
                })
            })
            .catch(err => {
                resolve( {
                    status:"fail",
                    message:"saved the requests successfully , "+err.message
                })
            });
        })
    // return new Promise((resolve, reject) => {
    // schoolService.save(req.body)
    //     .then(response => {
    //         resolve({
    //             ...returnResponse,
    //             schoolSaveStatus:response.status,
    //             schoolSaveMessage:response.message
    //         })
    //     })
    //     .catch(err => {
    //         reject( {
    //             ...returnResponse,
    //             schoolSaveStatus:"fail",
    //             schoolSaveMessage:err.message
    //         })
    //     });
    // })
}







