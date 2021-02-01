const { DocumentVerification } = require('../_helpers/db');
const db = require('../_helpers/db');
const Hobby = db.Hobby
const User = db.User
const fs = require('fs')
module.exports = {
    docUpload,
    docAction
};

async function docUpload(req){
    console.log("req.body=>",req.body)
    const documentVerification = new DocumentVerification(req.body);
    if(req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var document = {
            data:docData,
            contentType:req.file.mimetype
        }
        Object.assign(documentVerification,{document:document,status:"Pending"});
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

async function docAction({userId,school,status}){
    const documentVerification = await DocumentVerification.findOne({
        id:userId,
        school:school,
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
            message:"unable to find any document for the given user and school "+userId
        }
    }
}





