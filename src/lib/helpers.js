const bcryp = require('bcryptjs');
const helpers = {};

helpers.encrypPassword =  async(password) =>{
    const salt = await bcryp.genSalt(10);
    const finalpass =  await bcryp.hash(password, salt);
    return finalpass;
};
helpers.matchpassword = async(password, savedpassword) =>{
    try{
        return await bcryp.compare(password, savedpassword);

    } catch (e){
        console.log(e);
    }
};

module.exports = helpers;