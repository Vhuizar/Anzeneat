const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggeedIn, isNologgedIn}  = require('../lib/auth');
const help = require('../lib/helpers');
const pool = require('../database');

router.get('/admuser', isLoggeedIn, (req,res)=>{
    res.render('auth/admuser');
});

//cuando no tenga nada en el dominio de la url  redirecciona a login  
router.get('/',(req,res)=>{
    res.redirect('/login')
});

//login
router.get('/login', isNologgedIn,(req,res)=>{
    res.render('auth/login');
});
router.post('/login', isNologgedIn, (req, res, next)=>{
    passport.authenticate('local.login',{
        successRedirect: '/perfiluser',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//crear user
router.get('/creuser', isNologgedIn, (req, res) =>{
    if(req.user){
        //console.log('usuario en sesion')
        if(req.user.rol == "Administrador"){
            //console.log("Administrador");
            res.render('auth/admuser');
        }
        else{
            console.log('Usuario');
            
        }
    }
    else{
        //console.log('usuario sin sesion');
        res.render('auth/creuser');
    }
    
    
});
router.post('/adcreuser', isLoggeedIn, async(req, res) =>{

    const { name,last_name, email, password, rol } = req.body;
    const newuser = {
        name,
        last_name,
        email,
        password,
        rol
    }
    newuser.password = await help.encrypPassword(password);
    const resul =await pool.query('INSERT INTO users set ?',newuser);
    //console.log(resul);
    res.redirect('/perfiluser');

});

router.post('/creuser', isNologgedIn, passport.authenticate('local.signup',{
        successRedirect: '/inicio',
        failureRedirect: '/creuser',
        failureFlash: true
    }));

router.get('/perfiluser', isLoggeedIn, (req, res)=>{
    if(req.user.rol == "Administrador"){
        //console.log("Administrador");
        res.render('links/adperfil');
    }
    else{
        //console.log('Usuario');
        res.render('perfiluser');
    }
    
    
})

router.get('/logout', isLoggeedIn,(req, res) =>{
    req.logOut();
    res.redirect('/login')
});
module.exports = router;