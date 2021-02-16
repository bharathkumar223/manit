const { DocumentVerification, School } = require('../../_helpers/db');
const db = require('../../_helpers/db');
const schoolService = require('../school/school.service');
const fs = require('fs')
module.exports = {
    docUpload,
    docAction,
    getDocuments
};

async function docUpload(req){
    const {schoolName,yearOfEntrance,department,userId, enrollment,schoolType} = req.query
    if(req.file && req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var document = {
            data:docData,
            contentType:req.file.mimetype
        }
        const response = await new Promise((resolve) => {
            schoolService.save({
                schoolName:schoolName,
                userId:userId,
                enrollment:enrollment,
                department:department,
                yearOfEntrance:yearOfEntrance,
                schoolType:schoolType
                })
            .then(school=>{
                if(school.status === "fail"){
                    resolve({
                        status:"fail",
                        message:"Error while saving school info : " + school.message
                    })
                }
                const documentVerification = new DocumentVerification({
                    id:userId,
                    yearOfEntrance:yearOfEntrance,
                    department:department,
                    school:school.id,
                    document:document
                });
                documentVerification.save()
                .then((doc)=>{
                    resolve({
                        status:"success",
                        message:"successfully saved school info and uploaded the document"
                    })
                })
                .catch(err=>{
                    resolve( {
                        status:"fail",
                        message:" Error while saving the file uploaded : " + err.message
                    })
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"Error while saving school info : " + err.message
                })
            })  
        })
        return new Promise((resolve)=>{
            fs.unlink('assets/Images/'+req.file.filename, (err) => {
                if (err){
                    resolve({
                        status:"fail",
                        message:response.message + " and error while deleting redundant file : " + err.message
                    })
                } else{
                    console.log('assets/Images/'+req.file.filename+' was deleted');
                    resolve({
                        ...response
                    })
                }
            });
        })
    }else{
        return{
            status:"fail",
            message:"Unable to extract the file attached,please try again"
        }
    }

}

async function getDocuments(){
    return new Promise((resolve, reject) => {
        DocumentVerification.find({status:"Pending"},function(err,docs){
            if(err){
                reject({
                    status:"fail",
                    message:err
                })
            }else{
                resolve({
                    status:"success",
                    docs:docs
                })
            }
        })
    })
}

async function docAction({userId,docId,status}){
    const documentVerification = await DocumentVerification.findOne({
        _id:docId,
    })
    if(documentVerification){
        Object.assign(documentVerification,{status:status})
        await documentVerification.save()
        return{
            status:"success",
            message:"successfully updated the status to "+ status
        }
    }else{
        return{
            status:"fail",
            message:"unable to find any document for the given user and school "+docId
        }
    }
}





