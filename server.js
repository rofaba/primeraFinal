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
var archivo = new Contenedor('productos.txt'); 
var carrito = new Contenedor('carrito.txt')

//SERVER PRINCIPAL

const express = require('express');
const app = express();

const ejs = require('ejs');
const {body, validationResult} = require('express-validator')

const router = require('./src/routes')
const port = process.env.PORT || 8080;

const fs = require ('fs');
const { collapseTextChangeRangesAcrossMultipleVersions, InferencePriority } = require('typescript');
const { Console } = require('console');
const e = require('express');

//SETTINGS

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('port', process.env.PORT || 8080)

//MIDDLEWARES

app.use(express.json())
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

app.get('/productos/:id', (req, res)=> {
   const data= archivo.getAll();
   let arrayproductos = data;
   console.log(arrayproductos)
        
   try {    // const datosExistentes = JSON.parse(await fs.promises.readFile(`./${this.contenedor}`, 'utf-8'));
            // let arrayProductos = datosExistentes;
            let num = req.params.id;
            console.log(num)
            const elementoBuscado = arrayproductos.find((element) => element.id == num);
            if (elementoBuscado == undefined) {
                console.log(`No se encuentra ningún elemento con el id: ${num}`)
            } else ;
            let objdatos= []
            objdatos.push(elementoBuscado)
            console.log(objdatos)
            res.render('productos', {
                datos: objdatos
            });
        } catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)

    }    })

app.post('/productos', 

//[     body('admin', 'Ruta autorizada solo para administradores')
//         .exists()
// ], 
(req, res) => {

    //validacion campos
    // const error = validationResult(req);
    // if (!error.isEmpty()){
    //     console.log({error: -1, descripcion: "ruta /productos en método POST, no autorizada"});
            
    // } else{

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
            console.log('producto guardado');
            res.redirect('/')
            
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
    })

//

app.put('/productos/:id', (req, res) => {

    // borrar anterior
    const existentes = JSON.parse(fs.readFileSync('productos.txt', 'utf-8'));
    const productosarray = existentes;
    const idparaborrar = Number(req.params.id);
          try {
            let elementoParaBorrar = productosarray.findIndex((element) => element.id == idparaborrar);
            
                if (elementoParaBorrar != -1) {
            productosarray.splice((productosarray.findIndex((producto) => producto.id == idparaborrar)), 1);
            fs.writeFileSync('productos.txt', JSON.stringify(productosarray, null, 2));
               } else console.log('No se encuentra el producto con el id solicitado')
    }
    catch (error) {
        console.log('Ha ocurrido un error en el proceso', error)
    }
// grabar producto editado
    
    try {
        const nuevoProducto = req.body;
        nuevoProducto.id = req.params.id;
         
        productosarray.push(nuevoProducto)
        
        const nuevoarchivo = JSON.stringify(productosarray, null, 2)
        fs.writeFileSync('productos.txt', nuevoarchivo);
        console.log('producto guardado');
        res.redirect('/')
        
    }
    catch (error) {
        console.log('Ha ocurrido un error en el proceso', error)
    }
})

//BORRAR PRODUCTO POR ID
app.delete('/productos/:id', (req, res) => {
         
        const existentes = JSON.parse(fs.readFileSync('productos.txt', 'utf-8'));
        const productosarray = existentes;
        const idparaborrar = Number(req.params.id);
              try {
                let elementoParaBorrar = productosarray.findIndex((element) => element.id == idparaborrar);
                
                    if (elementoParaBorrar != -1) {
                productosarray.splice((productosarray.findIndex((producto) => producto.id == idparaborrar)), 1);
                fs.writeFileSync('productos.txt', JSON.stringify(productosarray, null, 2));
                console.log(`El producto ${idparaborrar} ha sido correctamente eliminado`)

                    } else console.log('No se encuentra el producto con el id solicitado')
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
    })

// app.use('/productos', router);
// app.use('/carrito', router);

// RUTAS CARRO // RUTAS CARRO // RUTAS CARRO  // RUTAS CARRO

app.post('/carrito', (req, res) => {
    const carritos = carrito.getAll();
    const carrosArray = carritos;
    const nuevoCarro = req.body
    
    try {
        if (carrosArray.length == 0) {
            nuevoCarro.id = 1
        } else {
            const identificadores = [];
            carrosArray.forEach(element => identificadores.push(element.id));
            nuevoCarro.id = (Math.max(...identificadores) + 1);
        }
        carrosArray.push(nuevoCarro);

        const nuevoArrayCarros = JSON.stringify(carrosArray, null, 2)
        fs.writeFileSync('carrito.txt', nuevoArrayCarros);
        console.log(`se ha ingresado un carro nuevo con el id: ${nuevoCarro.id}`)
        res.sendStatus(200)
    }
    catch (error) {
        console.log('Ha ocurrido un error en el proceso', error)
    }
})

app.delete('/carrito/:id', (req, res) => {
         
        const carrosexistentes = JSON.parse(fs.readFileSync('carrito.txt', 'utf-8'));
        const carrosarray = carrosexistentes;
        const idparaborrar = Number(req.params.id);
              try {
                let elementoParaBorrar = carrosarray.findIndex((element) => element.id == idparaborrar);
                
                    if (elementoParaBorrar != -1) {
                carrosarray.splice((carrosarray.findIndex((carro) => carro.id == idparaborrar)), 1);
                fs.writeFileSync('carrito.txt', JSON.stringify(carrosarray, null, 2));
                console.log(`El carrito ${idparaborrar} ha sido correctamente eliminado`)

                    } else console.log('No se encuentra un carro con el id solicitado')
        }
        catch (error) {
            console.log('Ha ocurrido un error en el proceso', error)
        }
    })


app.get('/carrito/:id/productos', (req, res) => {
    
    const carros = JSON.parse(fs.readFileSync('carrito.txt', 'utf-8'));
    let carrosarray = carros;
    const idcarro = req.params.id;
    if ( carrosarray.find(e => e.id == idcarro) == undefined) {
        console.log('ERROR. No existe carro con ese id')}
    const carroSolicitado = carrosarray.indexOf(carrosarray.find(e => e.id == idcarro));
    const carroparafront = carrosarray[carroSolicitado].productos
            res.render('carrito', { datosCarro: carroparafront })

                 
            })
app.post('/carrito/:id/productos/:id_product', (req, res, next) => {
   try {  
    const todosProductos = JSON.parse(fs.readFileSync('productos.txt', 'utf-8'));
    const productosarray = todosProductos;
    const idproducto = Number(req.params.id_product); 
    const indiceAgregar =  productosarray.findIndex((element) => element.id == idproducto);  
    const productoAgregar = productosarray[indiceAgregar]
        //buscar carro asociado
    const carrosexistentes = JSON.parse(fs.readFileSync('carrito.txt', 'utf-8'));
    const carrosarray = carrosexistentes;
    const idcarropost = Number(req.params.id);
    const carroModificar = carrosarray.findIndex(element => element.id == idcarropost);
    const carroactual = carrosarray[carroModificar]
        
    const productosencarro = carroactual.productos;
    productosencarro.push(productoAgregar);
    carroactual.productos = productosencarro;
    carrosarray[idcarropost] = carroactual
    fs.writeFileSync('carrito.txt', JSON.stringify(carrosarray, null, 2));
    console.log(carrosarray[idcarropost])
    console.log('producto agregado')
    //leer nuevo carro
    res.redirect(200)
    
    }
    catch (error) {
    console.log('Ha ocurrido un error en el proceso', error)
    }
})
// BORRAR PRODUCTO POR ID CARRO Y PRODUCTO

app.delete('/carrito/:id/productos/:id_product', (req, res) => {
    try {
                //busca carro a modificar 
     const carrosexistentes = JSON.parse(fs.readFileSync('carrito.txt', 'utf-8'));
     const carrosarray = carrosexistentes;
     const idcarrodel = Number(req.params.id);
     const indexCarroModificar = carrosarray.findIndex(element => element.id == idcarrodel);
     const carroactual = carrosarray[indexCarroModificar] 
     const grupoproductos = carroactual.productos
     //busqueda producto
        console.log(grupoproductos)
     const idproductodel = Number(req.params.id_product); 
     const indiceBorrar =  grupoproductos.findIndex((element) => element.id == idproductodel);  
     grupoproductos.splice(indiceBorrar, 1)

     carroactual.productos = grupoproductos         
     carrosarray[indexCarroModificar]=carroactual
     
     fs.writeFileSync('carrito.txt', JSON.stringify(carrosarray, null, 2));
     console.log(carrosarray[indexCarroModificar])
     console.log('producto eliminado')
     //leer nuevo carro
     res.send(200)
     
     }
     catch (error) {
     console.log('Ha ocurrido un error en el proceso', error)
     }
 })



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