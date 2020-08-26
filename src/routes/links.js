const express = require('express');
const router = express.Router();

const pool = require('../database');
const help = require('../lib/helpers');

const {isLoggeedIn} =require('../lib/auth');


//cargar vista de Editar usuario
router.get('/useredit', isLoggeedIn, (req, res) => {
    res.render('links/useredit');
});
//hacer un select para llenar la lista de user con una query y traer los datos desde la BD
router.get('/user', isLoggeedIn, async (req, res) => {

    const users = await pool.query('SELECT * FROM users');
     //console.log(users);
    res.render('links/user', {users});
 
});
//metodo para la eliminacion de la tabla user a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra la lista de los user con los datos actualizados
router.get('/userdelet/:id', isLoggeedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);

    res.redirect('/links/user');
});
//metodo para la editar de la tabla user a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra el formulario para editar los datos a nuestro gusto
//esto se logra obteniendo el id de la tabla para lograr la actualizaccion
router.get('/useredit/:id', isLoggeedIn, async (req, res) => {
    const { id} = req.params;
    const links = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    res.render('links/useredit', {link: links[0]})
});

//metodo para la editar de la tabla user a la BD con una quiery y el metodo POST en el formulario
//al momento que le demos clic en el guardado neustros datos viajaran por post y con una query de UPDATE
//vamos a lograr que nuestros datos se actualicen de forma adecuada
//al final nos redireccionara a la vista donde tenemos lalista de los user
router.post('/useredit/:id', isLoggeedIn, async (req, res) => {
    const {id} = req.params;
    const {name, last_name, email,  } = req.body;
    const resid = {id};
    const edituser = {
        name,
        last_name,
        email,
    };
    //console.log(id)
    //console.log(edituser);
    //res.send('Editado');
    const resultado = await pool.query('UPDATE users set ? WHERE id = ?', [edituser, id]);
    console.log(resultado);
    res.redirect('/perfiluser');
});


//perfil admin
router.get('/adperfil', isLoggeedIn, (req, res) =>{
    res.render('links/adperfil');
});

//restaurantes sin sesion
router.get('/listarest', async(req, res) =>{
    const restlucky = await pool.query('SELECT * FROM restaurantes WHERE id = 1');
    const restpampas = await pool.query('SELECT * FROM restaurantes WHERE id = 2');
    const restsureño = await pool.query('SELECT * FROM restaurantes WHERE id = 3');
    //console.log(restluky);
    //console.log(restpampas);
    //console.log(restsureño);
    res.render('links/listaRest', {lucky:restlucky[0], sureño: restsureño[0], pampas: restpampas[0]}); 
 });
 router.get('/rest', isLoggeedIn,  async (req, res) =>{
    const rests = await pool.query('SELECT * FROM restaurantes');
     res.render('links/rest', {rests}) 
 });

 //funciones restaurante login
 router.get('/restadd', isLoggeedIn, (req, res) =>{
    res.render('links/restadd');
 });
 router.post('/restadd', isLoggeedIn, async(req, res) =>{
    
    const { name,address, description, phone_numbre } = req.body;
    const newLink = {
        name,
        address,
        description,
        phone_numbre
    };

    await pool.query('INSERT INTO restaurantes set ?', [newLink]);
    req.flash('success', 'Restaurante Agregado Correctamente');
    res.redirect('/links/rest');
    
 });
 router.get('/restedit', isLoggeedIn, (req, res) =>{
    res.render('links/restedit');
 });
 router.get('/restedit/:id', isLoggeedIn, async (req, res) => {

    const { id } = req.params;
    const rests = await pool.query('SELECT * FROM restaurantes WHERE ID = ?', [id]);
    res.render('links/restedit', {rest: rests[0]});
});
router.post('/restedit/:id', isLoggeedIn, async (req, res) => {
    const { id } = req.params;
    const { name, address, description, phone_numbre } = req.body;
    const resid = {id};
    const newLink = {
        name,
        address,
        description,
        phone_numbre
    };

    await pool.query('UPDATE restaurantes set ? WHERE id = ?', [newLink, id]);
    res.redirect('/links/rest');
});
router.get('/restdelet/:id', isLoggeedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM restaurantes WHERE ID = ?', [id]);
    req.flash('success', 'Restaurante Agregado Correctamente');
    res.redirect('/links/rest');
});

//reservaciones
router.get('/reservacion/:id',isLoggeedIn, async(req, res) =>{
    const {id} = req.params;
    const {idu} = req.body;
    const Reserv = await pool.query("SELECT * FROM restaurantes WHERE id = ?", [id]);
    //console.log(Reserv);
    res.render('links/reservacion',{resv: Reserv[0]});
})
router.post('/reservacion', isLoggeedIn, async(req, res)=>{
    const { fk_user,fk_rest,fecha,per_adicional} = req.body;
    const newLink = {
        fk_user,
        fk_rest,
        fecha,
        per_adicional
    };

    await pool.query('INSERT INTO reservaciones set ?', [newLink]);
    req.flash('success', 'Restaurante Agregado Correctamente');
    res.redirect('/perfiluser');
});

//editar la reservacion
router.get('/resvedit/:id',isLoggeedIn, async(req, res) =>{
    const {id} = req.params;
    const resv = await pool.query('Select * from reservaciones  inner JOIN restaurantes on reservaciones.fk_rest = restaurantes.id  WHERE  id_resv = ?',[id]);
    //console.log(resv);
    res.render('links/resvedit', {res: resv[0]});
})
//guardar la edicion de la reservacion 
router.post('/resvedit/:id', isLoggeedIn, async (req, res) => {
    const { id } = req.params;
    const { fk_user,fk_rest,fecha,per_adicional} = req.body;
    const newLink = {
        fk_user,
        fk_rest,
        fecha,
        per_adicional
    };

    await pool.query('UPDATE reservaciones set ? WHERE id_resv = ?', [newLink, id]);
    res.redirect('/perfiluser');
});



router.get('/misresv', isLoggeedIn, async(req, res)=>{
    const resv = await pool.query('Select * from reservaciones  inner JOIN restaurantes on reservaciones.fk_rest = restaurantes.id  WHERE  fk_user = ?',[req.user.id]);
    //console.log(resv);
    res.render('links/misresv', {resv}) 
});
router.get('/resvdelet/:id', isLoggeedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM reservaciones WHERE id_resv = ?', [id]);
    //req.flash('success', 'Restaurante Agregado Correctamente');
    res.redirect('/perfiluser');
});


module.exports = router;