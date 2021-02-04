const db = require('../_helpers/db');
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

    if (typeof hobbies !== 'undefined' && hobbies.length > 0) {
        // the array is defined and has at least one element
        const user = await User.findOne({id:userId});
        if(user){
            Object.assign(user,{hobbies:hobbies});
            await user.save();
            return {
                status : "success",
                message : "Hobbies successfully saved"
            };
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



