const { DocumentVerification } = require('../_helpers/db');
const db = require('../_helpers/db');
const Hobby = db.Hobby
const User = db.User
const fs = require('fs')
module.exports = {
    docUpload,
    docAction,
    getDocuments
};

async function docUpload(req){
    const {school,yearOfEntrance,department,userId} = req.query
    console.log("req.body=>",req.body)
    const documentVerification = new DocumentVerification({
        id:userId,
        yearOfEntrance:yearOfEntrance,
        department:department,
        school:school
    });
    if(req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var document = {
            data:docData,
            contentType:req.file.mimetype
        }
        Object.assign(documentVerification,{document:document});
        documentVerification.save();
        // console.log("req.body => ",req.body)
        // console.log("req.file => ",req.file)
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
                    resolve({
                        success:"success",
                        message :"successfully uploaded document for verification"
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





