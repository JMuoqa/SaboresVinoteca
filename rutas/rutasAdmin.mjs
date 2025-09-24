import express from 'express'
import path from 'path';
import multer from 'multer';
import controladorAdmin from '../controladores/controladorAdmin.mjs';
const enrutador = express.Router();
let rutaDeLaCarpeta = '';
if(process.env.NODE_ENV === 'development'){
    rutaDeLaCarpeta = 'C:\\Users\\Joaquin\\Desktop\\Proyectos\\Trabajo\\SaboresVinoteca\\ImagenesSubidas';
}
else{
    //Configurar direccion donde guardar imagenes 
    rutaDeLaCarpeta = '/home/joaquin/Imagenes/SaboresVinoteca/';
}
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, rutaDeLaCarpeta);//direccion donde guardo las imagenes
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Genera un nombre único + extensión
    }
});
const subir = multer({'storage': almacenamiento,
    limits: {
        fileSize: 6 * 1024 * 1024,
        files: 1
    }
});
enrutador.post('/guardar-categoria', subir.single('imagen'), controladorAdmin.InsertarCategoria);
enrutador.post('/guardar-producto', subir.single('imagen'), controladorAdmin.InsertarProducto);
enrutador.post('/cambiar-datos-de-categoria', subir.single('imagen'), controladorAdmin.CambiarDatosDeUnaCategoria);
enrutador.post('/cambiar-imagen-producto', subir.single('imagen'), controladorAdmin.CambiarImagenDelProducto);
/*enrutador.post('/subir-ropa', subir.array('Imagenes', 10), (req, res)=>{ ESTO ES PARA VARIAS IMAGENES
    controladorAdministracion.SubirRopa(req, res);
});*/
enrutador.post('/guardar-marca', controladorAdmin.InsertarMarca);
enrutador.get('/obtener-marcas', controladorAdmin.ObtenerMarcas);
enrutador.get('/obtener-categorias', controladorAdmin.ObtenerCategorias);
enrutador.get('/obtener-productos', controladorAdmin.ObtenerProductosConFiltros);
enrutador.get('/obtener-todos-productos', controladorAdmin.ObtenerTodosProductos);
enrutador.get('/obtener-producto-por-ID', controladorAdmin.ObtenerProductoPorID);
enrutador.get('/obtener-categoria-por-ID', controladorAdmin.ObtenerCategoriaPorID);
enrutador.get('/obtener-marca-por-ID', controladorAdmin.ObtenerMarcaPorID);
enrutador.get('/obtener-marcas-por-categoria', controladorAdmin.ObtenerMarcasPorCategoria);
enrutador.post('/cambiar-datos-principales', controladorAdmin.CambiarDatosPrincipalesDelProducto);
enrutador.post('/cambiar-datos-categoricos', controladorAdmin.CambiarDatosCategoricos);
enrutador.post('/cambiar-datos-de-marca', controladorAdmin.CambiarDatosDeUnaMarca);
export default enrutador;