const fs = require('fs');
const { School, SchoolList, Comment ,Post, User} = require('../../_helpers/db');
module.exports = {
    uploadProfilePic,
    getProfile,
    addPost,
    comment
};

async function comment({userId,comment,postId,commentId}){
    if(commentId){
        const comment = await Comment.findOne({_id:commentId})
        if(comment){
            var childComment = new Comment({
                postId:comment.postId,
                commentedUser:userId,
                parentComment:comment._id
            })
            await childComment.save()
            .then(comment=>{
                return {
                    status:"success",
                    message:"successfully added the comment"
                }
            })
            .catch(err=>{
                return{
                    status:"fail",
                    message:"failed to add comment : " + err.message
                }
            })
        }else{
            return{
                status:"fail",
                message:"unable to find the comment with id : " + commentId
            }
        }
    }else{
        var comment = new Comment({
            postId:postId,
            commentedUser:userId
        })
        await comment.save()
        .then(comment=>{
            return {
                status:"success",
                message:"successfully added the comment"
            }
        })
        .catch(err=>{
            return{
                status:"fail",
                message:"failed to add comment : " + err.message
            }
        })
    }
}

async function getProfile({userId}){
    const user = await User.findOne({id:userId})
    let response = {}
    return new Promise((resolve)=>{
    if(user){
        response.name = user.name,
        response.profilePic = user.profilePic
        response.hobbies = user.hobbies
        response.status = "success"
        School.find({$or:[{_id:user.highSchoolId},
                {_id:user.midSchoolId},
                {_id:user.universityId}]},
                function(err,schools){
                    if(err){
                        response.schools = "Error fetching schools of the user : " + err.message
                        response.status = "fail"
                    }else{
                        response.schools = schools.map(function(doc){
                                                const schoolSticker = SchoolList.findOne({name:doc.name})
                                                if(schoolSticker){
                                                    schoolSticker = schoolSticker.logo
                                                }else{
                                                    schoolSticker = "school sticker not available"
                                                }
                                                return {
                                                    name:doc.name,
                                                    enrollment:doc.enrollment,
                                                    sticker:schoolSticker
                                                } 
                                            })
                    }
                })
        Post.find({userId:user.id},function(err){
            if(err){
                response.posts = "Error fetching schools of the user : " + err.message
                response.status = "fail"
            }else{
                response.schools = schools.map(function(doc){
                    return {
                        post:doc.image,
                        text:doc.text,
                        dateOfPost:doc.dateOfPost,
                        likeCount:doc.likes.length - 1,
                        commentCount:doc.commentCount
                    } 
                })
            }
        })
        
        resolve({response})
        
        
    }else{
        resolve({
            status:"fail",
            message:"No user found for the given id : " + userId
        })
    }
})
}

async function uploadProfilePic(req){
    const userId = req.body.userId
    const user = await User.findOne({id:userId})
    if(!user){
        return {
            status:"fail",
            message:"user with the given id not found : " + userId
        }
    }
    if(req.file && req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var profilePic = {
            data:docData,
            contentType:req.file.mimetype
        }
        Object.assign(user,{profilePic:profilePic});
        let message = ""
        fs.unlink('assets/Images/'+req.file.filename, (err) => {
            if (err){
                message+= " , error while deleting redundant file :" + err
            } else{
                console.log('assets/Images/'+req.file.filename+' was deleted');
            }
        });
        return new Promise((resolve) => {
            user.save()
            .then(user=>{
                resolve({
                    status:"success",
                    message:"uploaded the profile pic successfully " + message
                })
            })
            .catch(err=>{
                resolve( {
                    status:"fail",
                    message:"Error while updating profile pic : " + err.message  + message
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

async function addPost(req){
    const {userId,text} = req.body.userId
    const user = await User.findOne({id:userId})
    if(!user){
        return {
            status:"fail",
            message:"user with the given id not found : " + userId
        }
    }
    if(req.file && req.file.filename){
        var docData = fs.readFileSync('assets/Images/'+req.file.filename);
        var image = {
            data:docData,
            contentType:req.file.mimetype
        }
        const post = new Post({
            userId:user.id,
            image:image,
            text:text
        })
        let message = ""
        fs.unlink('assets/Images/'+req.file.filename, (err) => {
            if (err){
                message+= " , error while deleting redundant file :" + err
            } else{
                console.log('assets/Images/'+req.file.filename+' was deleted');
            }
        });
        return new Promise((resolve) => {
            post.save()
            .then(user=>{
                resolve({
                    status:"success",
                    message:"post saved successfully " + message
                })
            })
            .catch(err=>{
                resolve( {
                    status:"fail",
                    message:"Error while saving post : " + err.message  + message
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



