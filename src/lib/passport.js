const passport =  require('passport');
const straty = require('passport-local').Strategy;
const help = require('../lib/helpers');

const pool = require('../database');

passport.use('local.login', new straty({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if( rows.length > 0 ){
        const user = rows[0];
        const valpass = await help.matchpassword(password, user.password)
        if (valpass){
            done(null, user,console.log('Bievenido usuario: ', user.name));
        }else{
            done(null, false, console.log('contraseña incorrecta'));
        }
    }else{
        return done(null,flase,console.log('usuario no existe') )
    }
}));

passport.use('local.signup', new straty({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done)=>{
    const {name} = req.body;
    const {last_name} = req.body;
    const {rol} = req.body;
    const newuser = {
        name,
        last_name,
        email,
        password,
        rol
    }
    newuser.password = await help.encrypPassword(password);
    const resul =await pool.query('INSERT INTO users set ?',newuser);
    newuser.id = resul.insertId;
    return done(null, newuser);
    console.log(resul);
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0]);
});