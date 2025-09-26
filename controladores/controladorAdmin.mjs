import { 
    Con_InsertarMarca, Con_InsertarCategoria, Con_ObtenerMarcas,
    Con_ObtenerCategorias, Con_InsertarProducto, Con_ObtenerIDDeCategoria, 
    Con_ObtenerIDDeMarca, Con_ObtenerProductosConFiltros, Con_ObtenerTodosProductos,
    Con_ObtenerProductoPorID, Con_ObtenerMarcasPorCategoria, Con_CambiarDatosPrincipales,
    Con_CambiarDatosCategoricos, Con_CambiarImagenDelProducto, Con_ObtenerCategoriaPorID,
    Con_CabmiarDatosDeUnaCategoria, Con_ObtenerMarcaPorID, Con_CambiarDatosDeUnaMarca
} from "../solicitudes/admin/solicitudesAdmin.mjs"
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
        let { marca, categoria } = req.body;
        const regex = /^[a-zA-Z0-9 @._-]+$/; //hay un espacio(' ' en -> '9 @'), para que permita los espacios ya que es una marca
        if (!marca || !regex.test(marca)) {
            return res.json({ estado: 'malo', mensaje: 'La marca contiene caracteres inválidos o está vacía'});
        }
        if(categoria == 'No seleccionada')
            return res.json({ estado: 'malo', mensaje: 'Selecciona la categoria a la que pertenece la marca'});
        marca = marca.trim();
        categoria = categoria.trim();
        console.log(marca, categoria);
        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitud = await Con_InsertarMarca(marca, IDCategoria);
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
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitarIDMarca = await Con_ObtenerIDDeMarca(marca, IDCategoria);
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
        return res.json({estado: 'muyMalo', Marcas: [{Marca: 'No hay'}], mensaje: error});
    }
}
const ObtenerMarcasPorCategoria = async (req, res)=>{
    try{
        const categoria = req.query.categoria;
        const iDcategoria = req.query.IDC;
        let obtenerMarcas;
        if(iDcategoria)
            obtenerMarcas = await Con_ObtenerMarcasPorCategoria(iDcategoria);
        else{
            const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
            const IDCategoria = solicitarIDCatecoria.Categoria.ID;
            obtenerMarcas = await Con_ObtenerMarcasPorCategoria(IDCategoria);
        }
        let marcas;
        if(obtenerMarcas.Marcas)
            marcas = obtenerMarcas.Marcas
        else
            marcas = [{Marca: 'No hay'}];
        return res.json({ estado: 'exitoso', Marcas: marcas });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Marcas: [{Marca: 'No hay'}], mensaje: error});
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
        return res.json({estado: 'muyMalo', Categorias: [{Categoria: 'No hay'}],mensaje: error});
    }
}
const ObtenerProductosConFiltros = async (req, res) =>{
    try{
        let { categoria, marca, precioMin, precioMax, importado, busqueda, pagina, limite} = req.query || {};
        if(busqueda){

        }else
            busqueda = null
        if((!categoria || categoria === 'Sin filtro'))
            categoria = null;
        else if(isNaN(categoria)){
            const obtenerCategorias = await Con_ObtenerCategorias();
            const categoriasObtenidas = obtenerCategorias.Categorias;
            for(let i = 0; i< categoriasObtenidas.length; i++){
                if(categoriasObtenidas[i].Categoria == categoria){
                    categoria = categoriasObtenidas[i].ID;
                    break;
                }
            }
        }
        if(!marca || marca === 'Sin filtro' || marca === 'Selecciona una categoria para buscar marcas')
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
        if(!pagina)
            pagina = 1;
        if(!precioMin)
            precioMin = null;
        if(!precioMax)
            precioMax = null;
        if(!importado)
            importado = null;
        if(!limite)
            limite = 10
        limite = parseInt(limite);
        const posicion = (pagina * limite) - limite;
        const solicitud = await Con_ObtenerProductosConFiltros(categoria, marca, precioMin, precioMax, busqueda, importado, posicion, limite)
        const obtenerMarcas = await Con_ObtenerMarcas();
        let marcas = obtenerMarcas.Marcas;
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({ estado: 'exitoso', Productos: solicitud.Productos, Marcas: marcas})
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Productos: [], mensaje: error});
    }
}
const ObtenerTodosProductos = async (req, res, next)=>{
    try{
        const solicitud = await Con_ObtenerTodosProductos();
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({ estado: 'exitoso', Productos: solicitud.Productos})
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', Productos: [], mensaje: error});
    }
}
const ObtenerProductoPorID = async (req, res, next)=>{
    try{
        const ID = req.query.ID;
        const solicitud = await Con_ObtenerProductoPorID(ID);
        const obtenerMarcas = await Con_ObtenerMarcas();
        let marcas;
        if(obtenerMarcas.Marcas)
            marcas = obtenerMarcas.Marcas
        else
            marcas = [{Marca: 'No hay'}];
        const obtenerCategorias = await Con_ObtenerCategorias();
        let categorias;
        if(obtenerCategorias.Categorias)
            categorias = obtenerCategorias.Categorias;
        else
            categorias = [{Categoria: 'No hay'}];
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({ estado: 'exitoso', Producto: solicitud.Productos, Marcas: marcas, Categorias: categorias})
    }catch{
        console.error(error);
        return res.json({estado: 'muyMalo', Producto: [], mensaje: error});
    }
}
const ObtenerCategoriaPorID = async (req, res, next) =>{
    try{
        const ID = req.query.ID;
        const solicitud = await Con_ObtenerCategoriaPorID(ID);
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({estado: 'exitoso', Categoria: solicitud.Categoria});
    }catch{
        console.error(error);
        return res.json({estado: 'muyMalo', Categorias: [], mensaje: error});
    }
}
const ObtenerMarcaPorID = async (req, res, next)=>{
    try{
        const ID = req.query.ID;
        const solicitud = await Con_ObtenerMarcaPorID(ID);
        if(!solicitud.estado)
            throw new Error(solicitud.mensaje);
        return res.json({estado: 'exitoso', Marca: solicitud.Marca});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
const CambiarDatosPrincipalesDelProducto = async (req, res, next)=>{
    try{
        const { nombre, precio, ID } = req.body;
        const solicitud = await Con_CambiarDatosPrincipales(nombre, precio, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
const CambiarDatosCategoricos = async (req, res, next) =>{
    try{
        const { categoria, marca, ID } = req.body;
        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitarIDMarca = await Con_ObtenerIDDeMarca(marca, IDCategoria);
        const IDMarca = solicitarIDMarca.Marca.ID;
        const solicitud = await Con_CambiarDatosCategoricos(IDCategoria, IDMarca, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
const CambiarImagenDelProducto = async (req, res, next)=>{
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
        const { ID } = req.body;
        const solicitud = await Con_CambiarImagenDelProducto(imagenProcesada, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
const CambiarDatosDeUnaCategoria = async (req, res, next)=>{
    try{
        const imagen = req.file;
        let imagenProcesada = null;
        if (imagen){
            const rutaOriginal = path.join(rutaDeLaCarpeta, imagen.filename);
            const extencion = path.extname(imagen.originalname).toLowerCase();
            if(extencion == '.heic')
                imagenProcesada = await ConvertirImagen(imagen, rutaOriginal);
            else
                imagenProcesada = imagen.filename;
        }
        let { categoria, ID } = req.body;
        const solicitud = await Con_CabmiarDatosDeUnaCategoria(imagenProcesada, categoria.toUpperCase(), ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
const CambiarDatosDeUnaMarca = async (req, res, next)=>{
    try{
        const { marca, categoria, ID } = req.body;
        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitud = await Con_CambiarDatosDeUnaMarca(marca, IDCategoria, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error});
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
    ObtenerTodosProductos, ObtenerProductoPorID, ObtenerMarcasPorCategoria,
    CambiarDatosPrincipalesDelProducto, CambiarDatosCategoricos, CambiarImagenDelProducto,
    ObtenerCategoriaPorID, CambiarDatosDeUnaCategoria, ObtenerMarcaPorID,
    CambiarDatosDeUnaMarca,
}