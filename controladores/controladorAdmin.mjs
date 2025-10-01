import { 
    Con_InsertarMarca, Con_InsertarCategoria, Con_ObtenerMarcas,
    Con_ObtenerCategorias, Con_InsertarProducto, Con_ObtenerIDDeCategoria, 
    Con_ObtenerIDDeMarca, Con_ObtenerProductosConFiltros, Con_ObtenerTodosProductos,
    Con_ObtenerProductoPorID, Con_ObtenerMarcasPorCategoria, Con_CambiarDatosPrincipales,
    Con_CambiarDatosCategoricos, Con_CambiarImagenDelProducto, Con_ObtenerCategoriaPorID,
    Con_CabmiarDatosDeUnaCategoria, Con_ObtenerMarcaPorID, Con_CambiarDatosDeUnaMarca,
    Con_ComprobarProducto, Con_CambiarVisibilidadDelProducto, Con_CambiarVisibilidadDeCategoria,
    Con_CambiarVisibilidadDeMarca
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
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        let { marca, categoria } = req.body;
        const regex = /^[a-zA-Z0-9 @,+._-]+$/; //hay un espacio(' ' en -> '9 @'), para que permita los espacios ya que es una marca
        if (!marca || !regex.test(marca)) {
            return res.json({ estado: 'malo', mensaje: 'La marca contiene caracteres inválidos o está vacía'});
        }
        if(categoria == 'No seleccionada')
            return res.json({ estado: 'malo', mensaje: 'Selecciona la categoria a la que pertenece la marca'});
        marca = marca.trim();
        categoria = categoria.trim();
        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitud = await Con_InsertarMarca(marca, IDCategoria);
        if(!solicitud.estado)
            return res.json({ estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message });
    }
}
const InsertarCategoria = async (req, res) => {
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const imagen = req.file;
        if (!imagen)
            return res.json({estado: 'malo', mensaje: 'No hay una imagen cargada'});
        const rutaOriginal = path.join(rutaDeLaCarpeta, imagen.filename);
        const extension = path.extname(imagen.originalname).toLowerCase();
        const imagenProcesada = await ConvertirImagen(imagen, rutaOriginal, extension);
        let { categoria } = req.body;
        const regex = /^[a-zA-Z0-9 @,+._-]+$/;
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
        return res.json({estado: 'muyMalo', mensaje: error.message });
    }
}
const InsertarProducto = async (req, res) => {
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
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
        console.log(solicitarIDCatecoria)
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;

        const solicitarIDMarca = await Con_ObtenerIDDeMarca(marca, IDCategoria);
        console.log(solicitarIDMarca)
        const IDMarca = solicitarIDMarca.Marca.ID;
        const comprobarProducto = await Con_ComprobarProducto(nombreProducto, IDMarca, IDCategoria);
        if(!comprobarProducto.estado)
            return res.json({ estado: 'malo', mensaje: comprobarProducto.mensaje});
        const solicitud = await Con_InsertarProducto(nombreProducto, IDCategoria, IDMarca, precio, esImportado, imagenProcesada);
        if(!solicitud.estado)
            return res.json({ estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje });
    }catch(error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message });
    }
}
function ValidarDatosDelProducto(nombreProducto, categoria, marca, precio){
    const regex = /^[a-zA-Z0-9 @,+._-]+$/;
    const regexNumeros = /^[0-9]+$/;
    if(!precio || !regexNumeros.test(precio))
        return 'El precio contiene caracteres invalidos o esta vacio';
    if(!nombreProducto || !regex.test(nombreProducto))
        return 'Nombre del producto contiene caracteres invalidos o esta vacio';
    if(!categoria || !regex.test(categoria) || categoria == 'No seleccionada' )
        return 'La categoria contiene caracteres invalidos o esta vacia';
    if(!marca || !regex.test(marca) || marca == 'No seleccionada' || marca == 'Selecciona una categoria para buscar marcas')
        return 'La marca contiene caracteres invalidos o esta vacia';
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
        return res.json({estado: 'muyMalo', Marcas: [{Marca: 'No hay'}], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Marcas: [{Marca: 'No hay'}], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Categorias: [{Categoria: 'No hay'}],mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Productos: [], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Productos: [], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Producto: [], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', Categorias: [], mensaje: error.message});
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
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarDatosPrincipalesDelProducto = async (req, res, next)=>{
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const { nombre, precio, ID } = req.body;
        const solicitud = await Con_CambiarDatosPrincipales(nombre, precio, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarDatosCategoricos = async (req, res, next) =>{
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
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
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarImagenDelProducto = async (req, res, next)=>{
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
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
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarDatosDeUnaCategoria = async (req, res, next)=>{
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
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
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarDatosDeUnaMarca = async (req, res, next)=>{
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const { marca, categoria, ID } = req.body;
        if(!ID)
            return res.json({estado: 'malo', mensaje: 'No se selecciono ninguna marca'});
        if(!marca)
            return res.json({estado: 'malo', mensaje: 'La marca esta vacia'});
        if(!categoria)
            return res.json({estado: 'malo', mensaje: 'No hay una categoria seleccionada'});

        const solicitarIDCatecoria = await Con_ObtenerIDDeCategoria(categoria);
        const IDCategoria = solicitarIDCatecoria.Categoria.ID;
        const solicitud = await Con_CambiarDatosDeUnaMarca(marca, IDCategoria, ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarVisibilidadDelProducto = async (req, res) => {
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const { ID } = req.body;
        if(!ID || ID.trim() == '')
            return res.json({estado: 'malo', mensaje: 'No hay ningun producto seleccionado'});
        const solicitud = await Con_CambiarVisibilidadDelProducto(ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarVisibilidadDeCategoria = async (req, res) => {
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const { ID } = req.body;
        if(!ID || ID.trim() == '')
            return res.json({estado: 'malo', mensaje: 'No hay ninguna categoria seleccionada'});
        const solicitud = await Con_CambiarVisibilidadDeCategoria(ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
const CambiarVisibilidadDeMarca = async (req, res) => {
    try{
        const usuarioLogeado = req.user ?? [];
        const usuarioPermitido = await ComprobarUsuario(usuarioLogeado);
        if(!usuarioPermitido)
            throw new Error('Sin permisos');
        const { ID } = req.body;
        if(!ID || ID.trim() == '')
            return res.json({estado: 'malo', mensaje: 'No hay ninguna categoria seleccionada'});
        const solicitud = await Con_CambiarVisibilidadDeMarca(ID);
        if(!solicitud.estado)
            return res.json({estado: 'malo', mensaje: solicitud.mensaje});
        return res.json({estado: 'exitoso', mensaje: solicitud.mensaje});
    }catch (error){
        console.error(error);
        return res.json({estado: 'muyMalo', mensaje: error.message});
    }
}
async function ConvertirImagen(imagen, rutaOriginal, extension) {
    const nuevoNombre = imagen.filename.replace(extension, ".jpg");
    const tempNombre = "temp_" + nuevoNombre;
    const tempRuta = path.join(rutaDeLaCarpeta, tempNombre);
    const nuevaRuta = path.join(rutaDeLaCarpeta, nuevoNombre);
    const MAX_WIDTH = 720;
    const bufferDeEntrada = fs.readFileSync(rutaOriginal);
    const imagenSharp = sharp(bufferDeEntrada);
    const metadata = await imagenSharp.metadata();
    if (extension === ".heic") {
        // Leer HEIC y convertir a JPEG
        const bufferHEIC = fs.readFileSync(rutaOriginal);
        const bufferJPEG = await convert({
            buffer: bufferHEIC,
            format: "JPEG",
            quality: 0.9
        });
        if(metadata.width > 720) 
            await sharp(bufferJPEG).resize({ width: 720 }).jpeg({ quality: 90, mozjpeg: true }).toFile(nuevaRuta); 
        else 
            await sharp(bufferJPEG).jpeg({ quality: 80, mozjpeg: true }).toFile(nuevaRuta);
        fs.unlinkSync(rutaOriginal);
    } else {
        if(metadata.width > 720) 
            await sharp(bufferDeEntrada).resize({ width: 720 }).jpeg({ quality: 90, mozjpeg: true }).toFile(tempRuta); 
        else 
            await sharp(bufferDeEntrada).jpeg({ quality: 80, mozjpeg: true }).toFile(tempRuta);
        fs.unlinkSync(rutaOriginal);
        fs.renameSync(tempRuta, nuevaRuta);
    }
    return nuevoNombre;
}
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
async function ComprobarUsuario(usuario) {
    if(usuario[0] && usuario[0].Jerarquia &&  usuario[0].Jerarquia == 'ADMIN')
        return true;
    return false
}
export default{
    InsertarMarca, InsertarCategoria, ObtenerMarcas,
    ObtenerCategorias, InsertarProducto, ObtenerProductosConFiltros,
    ObtenerTodosProductos, ObtenerProductoPorID, ObtenerMarcasPorCategoria,
    CambiarDatosPrincipalesDelProducto, CambiarDatosCategoricos, CambiarImagenDelProducto,
    ObtenerCategoriaPorID, CambiarDatosDeUnaCategoria, ObtenerMarcaPorID,
    CambiarDatosDeUnaMarca, CambiarVisibilidadDelProducto, CambiarVisibilidadDeCategoria,
    CambiarVisibilidadDeMarca
}