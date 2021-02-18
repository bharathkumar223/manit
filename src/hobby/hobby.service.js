const { Hobbies } = require('../../_helpers/db');
const db = require('../../_helpers/db');
const Hobby = db.Hobby
const User = db.User
module.exports = {
    getHobbies,
    saveHobbies,
    deleteHobbies
};

async function deleteHobbies({userId,hobby}){
    const user = await User.findOne({id:userId})
    let hobbies = user.hobbies
    const index = hobbies.indexOf(hobby);
    if (index > -1) {
        hobbies.splice(index, 1);
    }
    if(user){
        return new Promise((resolve) => {
            Object.assign(user,{hobbies:hobbies})
             user.save()
            .then(response=>{
                resolve({
                    status:"success",
                    message:"successfully removed the hobby : " + hobby
                })
            })
            .catch(err=>{
                resolve({
                    status:"fail",
                    message:"Unable to remove the hobby : " + err.message
                })
            })
        })
    }else{
        return{
            status:"fail",
            message:"No user found for the given id : " + userId
        }
    }
}

async function getHobbies(){

    const hobbies = await Hobby.find({});
        if (hobbies) {
            console.log(hobbies);
            return {
                status:"success",
                hobbies:hobbies
            }
        }else{
            return {
                status : "fail",
                message : "unable to get hobbies, try again"
            }
        }
}

async function saveHobbies({userId, hobbies}){

    try{
    if (typeof hobbies !== 'undefined' && hobbies.length > 0) {
        // the array is defined and has at least one element
        const user = await User.findOne({id:userId});
        if(user){
            let newHobbies = []
            for(let hobbyId of hobbies){
                const userHobby = await Hobby.findOne({_id:hobbyId})
                if(!userHobby){
                    return {
                        status:"fail",
                        message:"unable to find hobby for the given id : " + hobbyId
                    }
                }else{
                    newHobbies.push(userHobby._id)
                }
            }
            Object.assign(user,{hobbies:newHobbies});
            return new Promise((resolve)=>{
                user.save()
                .then(()=>{
                    resolve( {
                        status : "success",
                        message : "Hobbies successfully saved"
                    })
                })
                .catch(err=>{
                    resolve( {
                        status : "fail",
                        message : "Error while saving hobbies : " + err.message
                    })
                })
            })
        }else{
            return {
                status : "fail",
                message:"user not found for the given id : " + userId
            }
        }
    }else{
        return {
            status : "fail",
            message:"Hobbies list cannot be empty"
        }
    }
    }
    catch(err){
        return {
            status : "fail",
            message:"Error while saving hobbies : " + err
        } 
    }
}



