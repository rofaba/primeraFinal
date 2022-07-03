/*  
PRIMERA ENTREGA FINAL BACKEND
RODRIGO FAURE COMISION 30995
*/

 // ARCHIVO PADRE CLASES Y METODOS

 class Contenedor {
    constructor(nombre) {
        this.contenedor = nombre
    }

    //método "save": recibe un objeto, lo guarda en archivo y devuelve su id.
    async save(productoNuevo) {
        try {
            const datosExistentes = JSON.parse(await fs.promises.readFile(`./${this.contenedor}`, 'utf-8'));
            let arrayProductos = datosExistentes;
            


            if (arrayProductos.length == 0) {
                productoNuevo.id = 1
            } else {
                const identificadores = [];
                arrayProductos.forEach(element => identificadores.push(element.id));
                productoNuevo.id = (Math.max(...identificadores) + 1);
            }

            arrayProductos.push(productoNuevo);
            let arrayString = JSON.stringify(arrayProductos, null, 2)
            await fs.promises.writeFile(`./${this.contenedor}`, arrayString);
            console.log('Se ha guardado correctamente el producto')
            console.log(productoNuevo)
            console.log(`Se le asignó el Id: ${productoNuevo.id}`)
        }

        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
    }

    // método "getById()" recibe un id y retorna el objeto con ese id || null si no está.            
    async getById(num) {
        try {
            const datosExistentes = JSON.parse(await fs.promises.readFile(`./${this.contenedor}`, 'utf-8'));
            let arrayProductos = datosExistentes;
            const elementoBuscado = arrayProductos.find((element) => element.id == num);
            if (elementoBuscado == undefined) {
                console.log(`No se encuentra ningún elemento con el id: ${num}`)
                return (null)
            } else console.log('El producto solicitado es:')
            console.log(elementoBuscado);
            return elementoBuscado
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)

        }
    }

    // método "gelAll()" Devuelve un array con los objetos presentes en el archivo
    getAll() {
        try {
            const datosExistentes = JSON.parse(fs.readFileSync(`./${this.contenedor}`, 'utf-8'));
            
            if (datosExistentes.length == 0) {
                console.log('El archivo no contiene productos')
            } else 
                {
                   
                return datosExistentes
                    
                };
                                    
        }

        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)

        }
    }

    // método "deleteById" recibe un id y elimina el objeto con el id buscado.
    async deleteById(numero) {
        try {
            const datosExistentes = JSON.parse(await fs.promises.readFile(`./${this.contenedor}`, 'utf-8'));
            let arrayProductos = datosExistentes;
            let elementoParaBorrar = arrayProductos.findIndex((element) => element.id == numero);
            if (elementoParaBorrar != -1) {
                arrayProductos.splice((arrayProductos.findIndex((producto) => producto.id == numero)), 1);
                await fs.promises.writeFile(`./${this.contenedor}`, JSON.stringify(arrayProductos, null, 2));
                console.log('El producto ha sido correctamente eliminado')
            } else console.log('No se encuentra el producto con el id solicitado')
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
    }

    // método "deleteAll()"  Elimina todos los abjetosd presente en al archivo
    async deleteAll() {
        {
            try {
                await fs.promises.writeFile(`./${this.contenedor}`, "[ ]");
                console.log('Se han eliminado todos los productos')

            }

            catch (error) {
                console.log('Ha ocurrido un error en el proceso', error)
            }
        }

    }
}

//se utilizará el archivo llamado productos.txt
var archivo = new Contenedor('productos.txt') 
var carrito = new Contenedor('carrito.txt')

//SERVER PRINCIPAL

const express = require('express');
const app = express();

const ejs = require('ejs');

const router = require('./src/routes')
const port = process.env.PORT || 8080;
const fs = require ('fs');
const { collapseTextChangeRangesAcrossMultipleVersions, InferencePriority } = require('typescript');
const { Console } = require('console');

//SETTINGS

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('port', process.env.PORT || 8080)

//MIDDLEWARES

// app.use(express.json())
app.use(express.urlencoded({ extend: true }))
app.use(express.static(__dirname + '/public'));


//ROUTES
// app.get('/', (req, res) => {
//     res.send('Servidor online. Favor dirigirse a "localhost:8080/api" para empezar')
// })

app.get('/', (req, res) => {
    res.render('index')

})

app.get('/productos', (req, res) => {

    const data = archivo.getAll();
    res.render('productos',{
        datos: data
    });    
}); 

app.post('/productos', (req, res) => {
        const productos = archivo.getAll();
        const productosarray = productos;

        try {
            const nuevoProducto = req.body;
            if (productosarray.length == 0) {
                nuevoProducto.id = 1
            } else {
                const identificadores = [];
                productosarray.forEach(element => identificadores.push(element.id));
                nuevoProducto.id = (Math.max(...identificadores) + 1);
            }
            productosarray.push(nuevoProducto)
            
            const nuevoarchivo = JSON.stringify(productosarray, null, 2)
            fs.writeFileSync('productos.txt', nuevoarchivo);
            console.log('producto guardado')
            res.redirect('/')
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
})



// app.use('/productos', router);
// app.use('/carrito', router);

//error404
app.use((req, res, next) => {
    res.status(404).render('404')
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