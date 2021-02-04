const { DocumentVerification } = require('../_helpers/db');
const db = require('../_helpers/db');
const schoolService = require('../school/school.service');
const fs = require('fs')
module.exports = {
    docUpload,
    docAction,
    getDocuments
};

async function docUpload(req){
    const {schoolName,yearOfEntrance,department,userId} = req.query
    console.log("req.body=>",req.body)
    const documentVerification = new DocumentVerification({
        id:userId,
        yearOfEntrance:yearOfEntrance,
        department:department,
        school:schoolName
    });
    if(req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var document = {
            data:docData,
            contentType:req.file.mimetype
        }
        Object.assign(documentVerification,{document:document});
        documentVerification.save();
        return new Promise((resolve, reject) => {
            fs.unlink('assets/Images/'+req.file.filename, (err) => {
                if (err){
                    // throw err;
                    reject({
                        status:"fail",
                        message :"uploaded the file successfully,but error while deleting redundant file," + err
                    })
                } else{
                    console.log('assets/Images/'+req.file.filename+' was deleted');
                    schoolService.save(req.query)
                        .then(response => {
                            console.log("respone=>",response)
                            resolve({
                                status:response.status==="success"?"success":"fail",
                                message:"successfully uploaded document for verification" + " and " + response.message,
                            })
                        })
                        .catch(err => {
                            resolve( {
                                status:"fail",
                                message:"successfully uploaded document for verification , "+err.message
                            })
                        });
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





