const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session =  require('express-session');
const MySQLStore = require('express-mysql-session');
const passport =  require('passport');

const {database} = require('./keys');

//inicializaciones
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'nodesession',
    resave: false,
    saveUninitialized: false,
    store: MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//variables globales
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    //console.log(req.user);
    app.locals.user = req.user;
    //app.locals.user = req.user
    next();
});


//rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//inicio del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});