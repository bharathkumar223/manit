const { DocumentVerification } = require('../_helpers/db');
const db = require('../_helpers/db');
const Hobby = db.Hobby
const User = db.User
const fs = require('fs')
module.exports = {
    docUpload
};

async function docUpload(req){
    console.log("req.body=>",req.body)
    const documentVerification = new DocumentVerification(req.body);
    
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
    
    
    


}





