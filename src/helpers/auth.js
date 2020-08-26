const helpers = {};

helpers.isAutenticado = (req,res,next)=>{
    if(req.isAutenticado()){
        return next();
    }
    res.redirect('/links/login');
}

module.exports = helpers;