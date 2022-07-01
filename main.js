/*  
PRIMERA ENTREGA FINAL BACKEND
RODRIGO FAURE COMISION 30995
*/

const express = require('express');
const app = express();
const router = require('./routes')
const port = 8080;
const fs = require ('fs');

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extend: true }))
// app.use('/static', express.static(__dirname + '/public'));


//ROUTES
app.get('/', (req, res) => {
    res.send('Servidor online. Favor dirigirse a "localhost:8080/api" para empezar')
})

app.get('/api', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')

})

app.use('/api/productos', router);

//error404
app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/public/404.html')
})
//puerto activo
app.listen(port, () => {
    console.log(`El servidor se encuentra operativo y esperando solicitudes en el puerto ${port}`);
})


/*

El router base '/api/productos' implementará cuatro funcionalidades:
a. GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
b. POST: '/' - Para incorporar productos al listado (disponible para administradores)
c. PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
d. DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
  
PRIMERA ENTREGA DEL PROYECTO FINAL
Formato: link a un repositorio en Github con el proyecto cargado. Sugerencia: no incluir los node_modules
 
2. El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores: a. POST: '/' - Crea un carrito y devuelve su id.
b. DELETE: '/:id' - Vacía un carrito y lo elimina.
c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
d. POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de
producto
3. Crear una variable booleana administrador, cuyo valor configuraremos más adelante con el sistema
de login. Según su valor (true ó false) me permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }

*/