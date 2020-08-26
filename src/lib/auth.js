module.exports = {
    isLoggeedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/login');
    },
    isNologgedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/perfiluser');
    }
};