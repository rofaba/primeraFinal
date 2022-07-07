const fs = require ('fs');
const {Contenedor} = require('../src/contenedor')
var archivo = new Contenedor('productos.txt'); 
var carrito = new Contenedor('carrito.txt')
module.exports = {

postCarro: (req, res) => {
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
},

delCarro: (req, res) => {
         
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
}, 

getIdProducts: (req, res) => {
    
    const carros = JSON.parse(fs.readFileSync('carrito.txt', 'utf-8'));
    let carrosarray = carros;
    const idcarro = req.params.id;
    if ( carrosarray.find(e => e.id == idcarro) == undefined) 
    {   res.send(" No existe un carro con ese id ")
        console.log('ERROR. No existe carro con ese id')
    }
        
        const carroSolicitado = carrosarray.indexOf(carrosarray.find(e => e.id == idcarro));
    const carroparafront = carrosarray[carroSolicitado].productos
            res.render('carrito', { datosCarro: carroparafront })

                 
 },
 postByIds: (req, res, next) => {
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
 },

 deleteByIds: (req, res) => {
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
 }








}  