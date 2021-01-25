const { Image} = require('../_helpers/db');
const fs = require('fs')

function pathToImage(name){
    var data = fs.readFileSync(process.cwd() + '\\assets\\Images\\' + name + '.png');
    // imageInstance.contentType = 'image/png';
    // imageInstance.save(function (err, image) {
    //   if (err) throw err;
    //   console.log("after inserting the image to image model => ",image);
    //   return image._id;
    // })
    return data;
    
}

module.exports = pathToImage