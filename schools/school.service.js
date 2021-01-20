const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var springedge = require('springedge');
const { User , School} = require('../_helpers/db');

module.exports = {
    search,
    save,
    matchSameSchool,
    matchSameUniv
};

async function search({searchString}){

    School.find(
        { "name": { "$regex": searchString , "$options": "i" } },
        function(err,docs) { 
            if(err){
                return {
                    status : err.error
                }
            }else{
                return {
                    ...docs.toJSON()
                }
            }
        }

    );
}

async function save(schoolParam){

    if(schoolParam.schoolType === 'highSchool'){
        return saveSchoolInfo(schoolParam);
    }else if(schoolParam.schoolType === 'university'){
        return saveUnivInfo(schoolParam);
    }else{
        return {
            status : "required param school type missing,unable to  save info"
        }
    }
}

async function saveSchoolInfo(schoolParam){
    
    const school = await School.findOne({ id });
    if (school) {
        Object.assign(school,schoolParam);
        await school.save();
    }else{
        const newSchool = new School(highSchoolParam);
        await newSchool.save();
    }
    return {
        status : "successfully saved the school Info"
    }
}

async function saveUnivInfo(univParam){
    
    const univ = await School.findOne({ id });
    if (univ) {
        Object.assign(univ,univParam);
        await univ.save();
    }else{
        const newUniv = new School(univParam);
        await newUniv.save();
    }
    return {
        status : "successfully saved the university Info"
    }
}

async function matchSameSchool({schoolName}){

    School.find({name: schoolName}, function(err, docs) {

        if(err){
            return {
                status : err.error
            }
        }else{
            // Map the docs into an array of just the ids of the user
            var ids = docs.map(function(doc) { return doc.id; });
        
            // Get the users whose ids are in the set
            User.find({id: {$in: ids}}, function(err, docs) {
                
                if(err){
                    return {
                        status : err.error
                    }
                }else{
                    return {
                        users : docs.map(function(doc){
                            return {
                                id:doc.id,
                                name:doc.name
                            }
                        })
                    }
                }

            });
        }
    });
}

async function matchSameUniv({universityName}){

    School.find({name: universityName}, function(err, docs) {

        if(err){
            return {
                status : err.error
            }
        }else{
            // Map the docs into an array of just the ids of the user
            var ids = docs.map(function(doc) { return doc.id; });
        
            // Get the users whose ids are in the set
            User.find({id: {$in: ids}}, function(err, docs) {
                
                if(err){
                    return {
                        status : err.error
                    }
                }else{
                    return {
                        users : docs.map(function(doc){
                            return {
                                id:doc.id,
                                name:doc.name
                            }
                        })
                    }
                }

            });
        }
    });
}

// async function getAll() {
//     return await User.find();
// }

// async function getById(id) {
//     return await User.findById(id);
// }

// async function update(id, userParam) {
//     const user = await User.findById(id);

//     // validate
//     if (!user) throw 'User not found';
//     if (user.id !== userParam.id && await User.findOne({ id: userParam.id })) {
//         throw 'Username "' + userParam.id + '" is already taken';
//     }

//     // hash password if it was entered
//     if (userParam.password) {
//         userParam.hash = bcrypt.hashSync(userParam.password, 10);
//     }

//     // copy userParam properties to user
//     Object.assign(user, userParam);

//     await user.save();
// }

// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }


// hash password
// if (userParam.password) {
//     user.hash = bcrypt.hashSync(userParam.password, 10);
// }