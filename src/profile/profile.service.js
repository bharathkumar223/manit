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

async function dislikePost({postId}){
    const post = Post.findOne({postId:postId})
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
        let temp = post.likes;
        let index = temp.index(userId)
        if (index > -1) {
            temp.splice(index, 1);
        }
        Object.assign(post,{likes:temp})
        await post.save()
        .then(post=>{
            return{
                status:"success",
                message:"successfully disliked the post : " + postId + " by the user : " + userId
            }
        })
        .catch(err=>{
            return{
                status:"fail",
                message:"error while saving the dislike : " + err.message
            }

        })
    }
}

async function likePost({postId,userId}){
    const post = Post.findOne({postId:postId})
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
        Object.assign(post,{likes:post.likes.push(userId)})
        await post.save()
        .then(post=>{
            return{
                status:"success",
                message:"successfully liked the post : " + postId + " by the user : " + userId
            }
        })
        .catch(err=>{
            return{
                status:"fail",
                message:"error while saving the like : " + err.message
            }

        })
    }
}

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

async function getComment({postId,userId}){
    let filter = {postId:postId,parentComment:{$exists: false}}
    const post = await Post.findOne({postId:postId})
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
    return new Promise((resolve)=>{
        Comment.find(filter,function(err,docs){
            if(err){
                resolve({
                    status:"fail",
                    message:"Error while fetching comments : " + err.message
                })
            }else{
                // Map the docs into an array of just the ids of the user
                docs.map(function(doc) { 
                    Comment.find({parentComment: doc._id,postId:postId}, function(err, docs) {
                        console.log("users=>",docs);
                        if(err){
                            doc.repliedComments = "Error fetching reply comments : "+docs
                        }else{
                            doc.repliedComments = docs
                        }
                        })
                });
                        
                // Get the users whose ids are in the set
                resolve({
                    status:"success",
                    comments:docs
                })
                
            }
        })
    })
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



