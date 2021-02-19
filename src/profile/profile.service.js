const fs = require('fs');
const { resolve } = require('path');
const { School, SchoolList, Comment ,Post, User, Hobby} = require('../../_helpers/db');
const { post } = require('./profile.controller');
// const Transaction = require("mongoose-transactions");
// const transaction = new Transaction();
module.exports = {
    uploadProfilePic,
    removeProfilePic,
    getProfile,
    uploadPhoto,
    addComment,
    getComments,
    likePost,
    dislikePost,
    getPhotos,
    editPhoto,
    removePhoto,
    replyComment,
    editComment,
    deleteComment
};

async function removePhoto({photoId,userId}){
    try{
        const post = await Post.findOne({userId:userId,_id:photoId})
        if(!post){
            return {
                status:"fail",
                message:"Unable to find photo for the given userId and photoId"
            } 
        }
        return new Promise((resolve)=>{
            
            Post.deleteOne({userId:userId,_id:photoId},function(err,doc){
                if(err){
                    resolve({
                        status:"fail",
                        message:"Error while removing photo : " + err.message
                    })
                }else{
                    resolve({
                        status:"success",
                        message:"successfully removed the photo " 
                    })
                }
            })
            
        })
    }catch(err){
        resolve({
            status:"fail",
            message:"Error while removing photo : " + err
        })
    }
}

async function editPhoto(req){
    const {userId,photoId} = req.query
    const post = await Post.findOne({userId:userId,_id:photoId})
    if(post){
        if(req.file && req.file.filename){
            var docData = fs.readFileSync('assets/Images/'+req.file.filename);
            var image = {
                data:docData,
                contentType:req.file.mimetype
            }
            Object.assign(post,{image:image})
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
                        message:"photo edited successfully " + message
                    })
                })
                .catch(err=>{
                    resolve( {
                        status:"fail",
                        message:"Error while editing photo : " + err.message  + message
                    })
                })
            })
        }else{
            return{
                status:"fail",
                message:"Unable to extract the file attached,please try again"
            }
        }
    }else{
        return{
            status:"fail",
            message:"Unable to find photo for the given userId and photoId"
        } 
    }
}

async function getPhotos({userId}){
    const user = await User.findOne({id:userId})
    if(user){
        return new Promise((resolve)=>{
            Post.find({userId:userId},function(err,docs){
                if(err){
                    resolve({
                        status:"fail",
                        message:"error while fetching photos : " + err.message
                    })
                }
                resolve({
                    status:"success",
                    photos:docs.map(photo=>{
                        return {
                            userId:userId,
                            userName:user.name,
                            profilePic:user.profilePic,
                            photoId:photo._id,
                            uri:photo.image,
                            createdDate:photo.createdDate,
                            isLiked:photo.isLiked,
                            likes:photo.likes.length,
                            comments:photo.commentCount,
                            bodyText:photo.text
                        }
                    })
                })
            })
        })
    }else{
        return {
            status:"fail",
            message:"unable to find user for the given id : " + userId
        }
    }
}

async function removeProfilePic({userId}){
    const user = await User.findOne({id:userId})
    if(user){
        user.profilePic = undefined
        return new Promise((resolve)=>{
             user.save()
            .then(post=>{
                resolve({
                    status:"success",
                    message:"successfully removed the profile pic"
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"error while removing the profile pic : " + err.message
                })
            })
        })
    }else{
        return {
            status:"fail",
            message:"unable to find user for the given id : " + userId
        }
    }
    
}

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

async function addComment({userId,comment,photoId}){

    const user = await User.findOne({id:userId})
    if(!user){
        return{
            status:"fail",
            message:"unable to find user for the given user Id : " + userId
        }
    }
    const post = await Post.findOne({_id:photoId})
    if(!post){
        return{
            status:"fail",
            message:"unable to find post for the given postId : " + postId
        }
    }

    // if(commentId){
    //     const coment = await Comment.findOne({_id:commentId})
    //     if(coment){
            // try{
            //     const id = transaction.insert("Comment", {
            //         postId:coment.postId,
            //         commentedUser:userId,
            //         parentComment:coment._id,
            //         comment:comment
            //     });
            //     transaction.update("Post", postId, {$inc:{commentCount:1}});
            //     const final = await transaction.run();
            //     console.log("final=>",final)
            //     return {
            //         status:"success",
            //         message:"successfully added the comment"
            //     }
            // } catch (error) {
            //     console.error(error);
            //     const rollbackObj = await transaction.rollback().catch(console.error);
            //     transaction.clean();
            //     return {
            //         status:"fail",
            //         message:"failed to add comment : " + error
            //     }
            //   }
            
            // var childComment = new Comment({
            //     postId:coment.postId,
            //     commentedUser:userId,
            //     parentComment:coment._id,
            //     comment:comment
            // })
            // return new Promise((resolve)=>{
            //     childComment.save()
            //     .then(comment=>{
            //         resolve({
            //             status:"success",
            //             message:"successfully added the comment"
            //         })
            //     })
            //     .catch(err=>{
            //         resolve({
            //             status:"fail",
            //             message:"failed to add comment : " + err.message
            //         })
            //     })
            // })
    //     }else{
    //         return{                                                                                              
    //             status:"fail",
    //             message:"unable to find the comment with id : " + commentId
    //         }
    //     }
    // }else{

        // try{
        //     const id = transaction.insert("Comment", {
        //         postId:postId,
        //         commentedUser:userId,
        //         comment:comment
        //     });
        //     transaction.update("Post", postId, {$inc:{commentCount:1}});
        //     const final = await transaction.run();
        //     console.log("final=>",final)
        //     return {
        //         status:"success",
        //         message:"successfully added the comment"
        //     }
        // } catch (error) {
        //     console.error(error);
        //     const rollbackObj = await transaction.rollback().catch(console.error);
        //     transaction.clean();
        //     return {
        //         status:"fail",
        //         message:"failed to add comment : " + error
        //     }
        //   }
        
        var coment = new Comment({
            postId:photoId,
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
    // }
}

async function replyComment({userId,comment,commentId}){
    
    const user = await User.findOne({id:userId})
    if(!user){
        return{
            status:"fail",
            message:"unable to find user for the given user Id : " + userId
        }
    }
    
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
                    message:"successfully replied the comment"
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"failed to reply comment : " + err.message
                })
            })
        })
    }else{
        return{                                                                                              
            status:"fail",
            message:"unable to find the comment with id : " + commentId
        }
    }
}

async function editComment({userId,comment,commentId}){

    const user = await User.findOne({id:userId})
    if(!user){
        return{
            status:"fail",
            message:"unable to find user for the given user Id : " + userId
        }
    }
    const post = await Post.findOne({_id:photoId})
    if(!post){
        return{
            status:"fail",
            message:"unable to find post for the given postId : " + postId
        }
    }

    const coment = await Comment.findOne({_id:commentId})
    if(coment){        
        Object.assign(coment,{comment:comment})
        return new Promise((resolve)=>{
            comment.save()
            .then(comment=>{
                resolve({
                    status:"success",
                    message:"successfully edited the comment"
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"failed to edit the comment : " + err.message
                })
            })
        })
    }else{
        return{                                                                                              
            status:"fail",
            message:"unable to find the comment with id : " + commentId
        }
    }
}

async function deleteComment({userId,comment,commentId}){

    const user = await User.findOne({id:userId})
    if(!user){
        return{
            status:"fail",
            message:"unable to find user for the given user Id : " + userId
        }
    }
    const coment = await Comment.findOne({_id:commentId})
    if(coment){        
        Object.assign(coment,{comment:comment})
        return new Promise((resolve)=>{
            comment.save()
            .then(comment=>{
                resolve({
                    status:"success",
                    message:"successfully edited the comment"
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"failed to edit the comment : " + err.message
                })
            })
        })
    }else{
        return{                                                                                              
            status:"fail",
            message:"unable to find the comment with id : " + commentId
        }
    }
}

async function updateCommentCount({postId}){
    await Post.findOneAndUpdate({_id: postId}, {$inc:{commentCount:1}}, (err, doc) => {
        if (err) {
            return {
                status:"fail",
                message:"Error updating comment count : " + err.message
            }
        }else{
            return {
                status:"success",
                message:"Successfully updated the commentCount"
            }
        }
    });    
}

async function getComments({photoId,userId}){
    let filter = {postId:photoId,parentComment:{$exists: false}}
    const user = await User.findOne({id:userId})
    if(!user){
        return{
            status:"fail",
            message:"unable to find user for the given user Id : " + userId
        }
    }
    const post = await Post.findOne({_id:photoId})
    if(!post){
        return{
            status:"fail",
            message:"unable to find post for the given postId : " + postId
        }
        // if(!(post.userId === userId)){
        //     filter = {
        //         ...filter,
        //         commentedUser:userId
        //     }
        // }
    }
    const parentComments = await new Promise((resolve)=>{
        Comment.find({postId:photoId,parentComment:{$exists: false}},function(err,docs){
            if(err){
                resolve({
                    status:"fail",
                    message:"Error while fetching comments : " + err.message
                })
            }else{
                resolve({
                    status:"success",
                    photoId:post._id,
                    userId:userId,
                    userName:user.name,
                    profilePic:user.profilePic,
                    createdDate:post.createdDate,
                    bodyText:post.text,
                    comments:docs
                    })
            
                }
                
            })
    })
    console.log("parentComments=>",parentComments)
    let commentsOrganised = []
    if(parentComments.status === "success"){
        for(let comment of parentComments.comments){
            const parentCommentUser = await User.findOne({id:comment.commentedUser})
            const repliedComments = await new Promise((resolve)=>{
                Comment.find({parentComment: comment._id,postId:photoId}, function(err, docs) {
                    
                    if(err){
                        resolve({
                            repliedComments:"Error fetching reply comments : "+err.message})
                    }else{
                        resolve(docs)
                    }
                })
            });
            console.log("repliedComments=>",repliedComments)
            let repliedCommentOrganised = []
            for(let repliedComment of repliedComments){
                
                const repliedCommentUser = await User.findOne({id:repliedComment.commentedUser})
                
                repliedCommentOrganised = [
                    ...repliedCommentOrganised,
                    {
                        userId:repliedCommentUser.id,
                        userName:repliedCommentUser.name,
                        profilePic:repliedCommentUser.profilePic,
                        commentId:repliedComment._id,
                        comment:repliedComment.comment,
                        createdDate:repliedComment.dateOfComment
                    }
                ]
                
            }
            commentsOrganised = [
                ...commentsOrganised,
                {
                    userId:parentCommentUser.id,
                    userName:parentCommentUser.name,
                    profilePic:parentCommentUser.profilePic,
                    commentId:comment._id,
                    comment:comment.comment,
                    createdDate:comment.dateOfComment,
                    comments:repliedCommentOrganised
                }
            ]
        }
        console.log("commentsOrganised=>",commentsOrganised)
    }
    Object.assign(parentComments,{comments:commentsOrganised})
    
    return parentComments
}

async function getProfile({userId}){
    const user = await User.findOne({id:userId})
    let response = {}
    if(user){
        Object.assign(response,{
            status:"success",
            userId:user.id,
            userName:user.name,
            userPhoto:user.profilePic,
        })
        Object.assign(response,await new Promise((resolve)=>{
            School.find({$or:[{_id:user.highSchoolId},
                {_id:user.midSchoolId},
                {_id:user.universityId}]},
                function(err,schools){
                    if(err){
                        resolve({
                            message : "Error fetching schools of the user : " + err.message,
                            status : "fail"
                        })
                    }else{
                        resolve({
                            stickers:schools
                        })
                    }
                })
        }))
        let stickers = []
        for(const school of response.stickers){
            // const schoolSticker = await SchoolList.findOne({name:school.name})
            stickers.push({
                        stickerId:school._id,
                        type:school.schoolType,
                        name:school.name,
                        enrollment:school.enrollment,
                        verificationStatus:school.verificationStatus
                        // sticker:schoolSticker?schoolSticker.logo:"school sticker not available"
                    })
        }
        for(let hobby of user.hobbies){
            const userHobby = await Hobby.findOne({_id:hobby})
            stickers.push({
                stickerId: hobby,
                type: "hobby",
                name: userHobby?userHobby.name:"unknownHobby"
            })
        }
        Object.assign(response,{stickers:stickers})
        // Object.assign(response,await new Promise((resolve)=>{
        //     Post.find({userId:user.id},function(err , posts){
        //         if(err){
        //             resolve({
        //                 message:"Error fetching schools of the user : " + err.message,
        //                 status:"fail"
        //             })
        //         }else{
        //             resolve({
        //                 posts:posts.map(function(doc){
        //                     return {
        //                         post:doc.image,
        //                         text:doc.text,
        //                         dateOfPost:doc.dateOfPost,
        //                         likeCount:doc.likes.length,
        //                         commentCount:doc.commentCount
        //                     } 
        //                 })
        //             })
        //         }
        //     })
        // }))

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

async function uploadPhoto(req){
    const {userId} = req.body
    const {bodyText} = req.query
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
            text:bodyText,
            image:image,
            userName:user.name
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
                    message:"photo saved successfully " + message
                })
            })
            .catch(err=>{
                resolve( {
                    status:"fail",
                    message:"Error while saving photo : " + err.message  + message
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



