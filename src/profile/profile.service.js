const db = require('../../_helpers/db');
const Hobby = db.Hobby
const User = db.User
const fs = require('fs')
module.exports = {
    uploadProfilePic
};

// async function getProfile({userId}){
//     const user = await User.findOne({id:userId})
//     let hobbies = user.hobbies
//     const index = hobbies.indexOf(hobby);
//     if (index > -1) {
//         hobbies.splice(index, 1);
//     }
//     if(user){
//         return new Promise((resolve) => {
//             Object.assign(user,{hobbies:hobbies})
//              user.save()
//             .then(response=>{
//                 resolve({
//                     status:"success",
//                     message:"successfully removed the hobby : " + hobby
//                 })
//             })
//             .catch(err=>{
//                 resolve({
//                     status:"fail",
//                     message:"Unable to remove the hobby : " + err.message
//                 })
//             })
//         })
//     }else{
//         return{
//             status:"fail",
//             message:"No user found for the given id : " + userId
//         }
//     }
// }

async function uploadProfilePic(req){
    const {userId} = req.body
    const user = await User.findOne({id:userId})
    
    if(req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var profilePic = {
            data:docData,
            contentType:req.file.mimetype
        }
        Object.assign(user,{profilePic:profilePic});
        let message
        fs.unlink('assets/Images/'+req.file.filename, (err) => {
            if (err){
                message+= "error while deleting redundant file :" + err
            } else{
                console.log('assets/Images/'+req.file.filename+' was deleted');
            }
        });
        return new Promise((resolve) => {
            user.save()
            .then(user=>{
                resolve({
                    status:"success",
                    message:"uploaded the profile pic successfully" +
                            message?" and "+message:""
                })
            })
            .catch(err=>{
                resolve( {
                    status:"fail",
                    message:"Error while updating profile pic : " + err.message  +
                    message?" and "+message:""
                })
            })
        })
    }else{
        return{
            status:"fail",
            message:"Unable to extract the file attached,please try again"
        }
    }
}



