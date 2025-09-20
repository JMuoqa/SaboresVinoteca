import { 
    Con_InsertarMarca, Con_InsertarCategoria, Con_ObtenerMarcas,
    Con_ObtenerCategorias, Con_InsertarProducto, Con_ObtenerIDDeCategoria, 
    Con_ObtenerIDDeMarca, Con_ObtenerProductosConFiltros } from "../solicitudes/admin/solicitudesAdmin.mjs"
import convert from "heic-convert";
import fs from 'fs';
import path from "path";
import sharp from 'sharp';

let rutaDeLaCarpeta = '';
if(process.env.NODE_ENV === 'development'){
    rutaDeLaCarpeta = 'C:\\Users\\Joaquin\\Desktop\\Proyectos\\Trabajo\\SaboresVinoteca\\ImagenesSubidas';
}
else{
    //Configurar direccion donde guardar imagenes 
    rutaDeLaCarpeta = '/home/joaquin/Imagenes/SaboresVinoteca/';
}
const InsertarMarca = async (req, res, next) =>{
    try{
        let { marca } = req.body;
        const regex = /^[a-zA-Z0-9 @._-]+$/; //hay un espacio(' ' en -> '9 @'), para que permita los espacios ya que es una marca
        if (!marca || !regex.test(marca)) {
            return res.json({ estado: 'malo', mensaje: 'La marca contiene caracteres inválidos o está vacía'});
        }
        marca = marca.trim(); 
        const solicitud = await Con_InsertarMarca(marca);
        if(!solicitud.estado)
            return res.json({ estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error });
    }
}
const InsertarCategoria = async (req, res) => {
    try{
        const imagen = req.file;
        let imagenProcesada;
        if (!imagen)
            return res.json({estado: 'malo', mensaje: 'No hay una imagen cargada'});
        const rutaOriginal = path.join(rutaDeLaCarpeta, imagen.filename);
        const extencion = path.extname(imagen.originalname).toLowerCase();
        if(extencion == '.heic')
            imagenProcesada = await ConvertirImagen(imagen, rutaOriginal);
        else
            imagenProcesada = imagen.filename;
        let { categoria } = req.body;
        const regex = /^[a-zA-Z0-9 @._-]+$/;
        if (!categoria || !regex.test(categoria)) {
            return res.json({ estado: 'malo', mensaje: 'La categoria contiene caracteres inválidos o está vacía'});
        }
        categoria = categoria.trim();
        const solicitud = await Con_InsertarCategoria(categoria.toUpperCase(), imagenProcesada);
        if(!solicitud.estado)
            return res.json({ estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error });
    }
}
const InsertarProducto = async (req, res) => {
    try{
        const imagen = req.file;
        let imagenProcesada;
        if (!imagen)
            return res.json({estado: 'malo', mensaje: 'No hay una imagen cargada'});
        const rutaOriginal = path.join(rutaDeLaCarpeta, imagen.filename);
        const extencion = path.extname(imagen.originalname).toLowerCase();
        if(extencion == '.heic')
            imagenProcesada = await ConvertirImagen(imagen, rutaOriginal);
        else
            imagenProcesada = imagen.filename;
        const { nombreProducto, importado, categoria, marca, precio } = req.body;
        const validacion = ValidarDatosDelProducto(nombreProducto, categoria, marca, precio);
        if(validacion)
            return res.json({ estado: 'malo', mensaje: validacion});
        let esImportado;
        if(importado)
            esImportado = 1;
        else
            esImportado = 0;
        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const solicitarIDMarca = await Con_ObtenerIDDeMarca(marca);
        console.log(solicitarIDCatecoria)
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        console.log(solicitarIDMarca)
        const IDMarca = solicitarIDMarca.Marca.ID;
        const solicitud = await Con_InsertarProducto(nombreProducto, IDCategoria, IDMarca, precio, esImportado, imagenProcesada);
        if(!solicitud.estado)
            return res.json({ estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error });
    }
}
function ValidarDatosDelProducto(nombreProducto, categoria, marca, precio){
    const regex = /^[a-zA-Z0-9 @._-]+$/;
    const regexNumeros = /^[0-9]+$/;
    if(!precio || !regexNumeros.test(precio))
        return 'El precio contiene caracteres invalidos o esta vacio';
    if(!nombreProducto || !regex.test(nombreProducto))
        return 'El precio contiene caracteres invalidos o esta vacio';
    if(!categoria || !regex.test(categoria))
        return 'El precio contiene caracteres invalidos o esta vacio';
    if(!marca || !regex.test(marca))
        return 'El precio contiene caracteres invalidos o esta vacio';
    return false;
}
const ObtenerMarcas = async (req, res) =>{
    try{
        const obtenerMarcas = await Con_ObtenerMarcas();
        let marcas;
        if(obtenerMarcas.Marcas)
            marcas = obtenerMarcas.Marcas
        else
            marcas = [{Marca: 'No hay'}];
        return res.json({ estado: 'exitoso', Marcas: marcas });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Marcas: [{Marca: 'No hay'}]});
    }
}
const ObtenerCategorias = async (req, res) =>{
    try{
        const obtenerCategorias = await Con_ObtenerCategorias();
        let categorias;
        if(obtenerCategorias.Categorias)
            categorias = obtenerCategorias.Categorias;
        else
            categorias = [{Categoria: 'No hay'}];
        return res.json({ estado: 'exitoso', Categorias: categorias });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Categorias: [{Categoria: 'No hay'}]});
    }
}
const ObtenerProductosConFiltros = async (req, res) =>{
    try{
        let { categoria, marca, precioMin, precioMax, importado, busqueda} = req.query || {};
        if(busqueda){

        }else
            busqueda = null
        if(!categoria || categoria === 'Sin filtro')
            categoria = null;
        else{
            const obtenerCategorias = await Con_ObtenerCategorias();
            const categoriasObtenidas = obtenerCategorias.Categorias;
            for(let i = 0; i< categoriasObtenidas.length; i++){
                if(categoriasObtenidas[i].Categoria == categoria){
                    categoria = categoriasObtenidas[i].ID;
                    break;
                }
            }
        }
        if(!marca || marca === 'Sin filtro')
            marca = null;
        else{
            const obtenerMarcasParaBusqueda = await Con_ObtenerMarcas();
            const marcasObtenidas = obtenerMarcasParaBusqueda.Marcas;
            for(let i = 0; i< marcasObtenidas.length; i++){
                if(marcasObtenidas[i].Marca == marca){
                    marca = marcasObtenidas[i].ID;
                    break;
                }
            }
        }
        if(!precioMin)
            precioMin = null;
        if(!precioMax)
            precioMax = null;
        if(!importado)
            importado = null;
        const solicitud = await Con_ObtenerProductosConFiltros(categoria, marca, precioMin, precioMax, busqueda, importado)
        const obtenerMarcas = await Con_ObtenerMarcas();
        let marcas = obtenerMarcas.Marcas;
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({ estado: 'exitoso', Productos: solicitud.Productos, Marcas: marcas})
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Productos: []});
    }
}
async function ConvertirImagen(imagen, rutaOriginal) {
    const nuevoNombre = imagen.filename.replace(/\.heic$/i,'.jpg');
    const nuevaRuta = path.join(rutaDeLaCarpeta, nuevoNombre);
    const bufferDeEntrada = fs.readFileSync(rutaOriginal); // esto lee el archivo por que convert(heic-convert), no lee el archivo pasandole la ruta.
    const jpegBuffer = await convert({
        buffer: bufferDeEntrada,  // buffer de entrada. (El archivo)
        format: 'JPEG',       // formato de salida
        quality: 0.9          // calidad jpeg
    });
    await sharp(jpegBuffer).jpeg({ quality: 90 }).toFile(nuevaRuta); //Guarda la nueva imagen
    fs.unlinkSync(rutaOriginal);//Esto borra la imagen .heic que se subio.
    return nuevoNombre
}

export default{
    InsertarMarca, InsertarCategoria, ObtenerMarcas,
    ObtenerCategorias, InsertarProducto, ObtenerProductosConFiltros,
    ObtenerProductosImportadosConFiltros
}