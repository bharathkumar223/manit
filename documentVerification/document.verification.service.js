const { DocumentVerification } = require('../_helpers/db');
const db = require('../_helpers/db');
const Hobby = db.Hobby
const User = db.User
module.exports = {
    docUpload
};

async function docUpload(docParam){

    const documentVerification = new DocumentVerification(docParam);
    return {
        success:"success"
    }

}





