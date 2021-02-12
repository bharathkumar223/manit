const fs = require('fs');
const { School, SchoolList, Comment ,Post, User} = require('../../_helpers/db');
const { post } = require('./profile.controller');
module.exports = {
    uploadProfilePic,
    getProfile,
    addPost,
    comment,
    getComment,
    likePost,
    dislikePost
};

async function dislikePost({postId,userId}){
    const post = await Post.findOne({_id:postId})
    if(!post){
        return {
            status:"fail",
            message:"post with given id not found : " + postId
        }
    }
    if(!post.likes.includes(userId)){
        return {
            status:"fail",
            message:"user need to have liked the post inorder to unlike the post"
        }
    }else{
        return new Promise((resolve)=>{
            let temp = post.likes;
            let index = temp.indexOf(userId)
            if (index > -1) {
                temp.splice(index, 1);
            }
            Object.assign(post,{likes:temp})
            post.save()
            .then(post=>{
                resolve({
                    status:"success",
                    message:"successfully disliked the post : " + postId + " by the user : " + userId
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"error while saving the dislike : " + err.message
                })

            })
        })
    }
}

async function likePost({postId,userId}){
    const post = await Post.findOne({_id:postId})
    if(!post){
        return {
            status:"fail",
            message:"post with given id not found : " + postId
        }
    }
    if(post.likes.includes(userId)){
        return {
            status:"fail",
            message:"user already liked the post,cannot do more than once"
        }
    }else{
        return new Promise((resolve)=>{
            let temp = post.likes
            temp.push(userId)
            Object.assign(post,{likes:temp})
             post.save()
            .then(post=>{
                resolve({
                    status:"success",
                    message:"successfully liked the post : " + postId + " by the user : " + userId
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"error while saving the like : " + err.message
                })

            })
        })
    }
}

async function comment({userId,comment,postId,commentId}){
    if(commentId){
        const coment = await Comment.findOne({_id:commentId})
        if(coment){
            var childComment = new Comment({
                postId:coment.postId,
                commentedUser:userId,
                parentComment:coment._id,
                comment:comment
            })
            return new Promise((resolve)=>{
                childComment.save()
                .then(comment=>{
                    resolve({
                        status:"success",
                        message:"successfully added the comment"
                    })
                })
                .catch(err=>{
                    resolve({
                        status:"fail",
                        message:"failed to add comment : " + err.message
                    })
                })
            })
        }else{
            return{
                status:"fail",
                message:"unable to find the comment with id : " + commentId
            }
        }
    }else{
        var coment = new Comment({
            postId:postId,
            commentedUser:userId,
            comment:comment
        })
        return new Promise((resolve)=>{
             coment.save()
            .then(comment=>{
                resolve({
                    status:"success",
                    message:"successfully added the comment"
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"failed to add comment : " + err.message
                })
            })
        })
    }
}

async function getComment({postId,userId}){
    let filter = {postId:postId,parentComment:{$exists: false}}
    const post = await Post.findOne({_id:postId})
    if(post){
        if(!(post.userId === userId)){
            filter = {
                ...filter,
                commentedUser:userId
            }
        }
    }else{
        return{
            status:"fail",
            message:"unable to find post for the given postId : " + postId
        }
    }
    const parentComments = await new Promise((resolve)=>{
        Comment.find(filter,function(err,docs){
            if(err){
                resolve({
                    status:"fail",
                    message:"Error while fetching comments : " + err.message
                })
            }else{
                resolve({
                    status:"success",
                    comments:docs
                })
                
            }
        })
    })

    if(parentComments.status === "success"){
        for(let comment of parentComments.comments){
            const repliedComments = await new Promise((resolve)=>{
                Comment.find({parentComment: comment._id,postId:postId}, function(err, docs) {
                    if(err){
                        resolve({
                            repliedComments:"Error fetching reply comments : "+err.message})
                    }else{
                        resolve({repliedComments:docs})
                    }
                    
                    })
            });
            comment["repliedComments"] = repliedComments.repliedComments
        }
    }
    
    return parentComments 
}

async function getProfile({userId}){
    const user = await User.findOne({id:userId})
    let response = {}
    if(user){
        Object.assign(response,{
            status:"success",
            name:user.name,
            profilePic:user.profilePic,
            hobbies : user.hobbies
        })
        Object.assign(response,await new Promise((resolve)=>{
            School.find({$or:[{_id:user.highSchoolId},
                {_id:user.midSchoolId},
                {_id:user.universityId}]},
                function(err,schools){
                    if(err){
                        resolve({
                            schools : "Error fetching schools of the user : " + err.message,
                            status : "fail"
                        })
                    }else{
                        resolve({
                            schools:schools
                        })
                    }
                })
        }))
        let responseSchools = []
        for(const school of response.schools){
            const schoolSticker = await SchoolList.findOne({name:school.name})
            responseSchools.push({
                        name:school.name,
                        enrollment:school.enrollment,
                        sticker:schoolSticker?schoolSticker.logo:"school sticker not available"
                    })
        }
        Object.assign(response,{schools:responseSchools})
        Object.assign(response,await new Promise((resolve)=>{
            Post.find({userId:user.id},function(err , posts){
                if(err){
                    resolve({
                        posts:"Error fetching schools of the user : " + err.message,
                        status:"fail"
                    })
                }else{
                    resolve({
                        posts:posts.map(function(doc){
                            return {
                                post:doc.image,
                                text:doc.text,
                                dateOfPost:doc.dateOfPost,
                                likeCount:doc.likes.length,
                                commentCount:doc.commentCount
                            } 
                        })
                    })
                }
            })
        }))

        return response
        
        
    }else{
        return {
            status:"fail",
            message:"No user found for the given id : " + userId
        }
    }

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
    const {userId,text} = req.body
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
            text:text,
            image:image
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



