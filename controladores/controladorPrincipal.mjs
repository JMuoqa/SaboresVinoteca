import { Con_ObtenerProductoPorID, Con_ObtenerCategoriaPorID } from '../solicitudes/admin/solicitudesAdmin.mjs' 
let urlMadre = '';
if(process.env.NODE_ENV == 'development'){
    urlMadre = 'http://localhost:5111';
}else{
    urlMadre = 'https://saboresvinoteca.com';
}
const tituloInicio = 'SaboresVinoteca | Bebidas nacionales e importadas';
const tituloCargar = 'SaboresVinoteca | Cargar productos y categorias';
const tituloEditar = 'SaboresVinoteca | Editar productos';
const tituloEditarCategorias = 'SaboresVinoteca | Editar Categoria';
const tituloEditarMarcas = 'SaboresVinoteca | Editar Marcas';
const tituloCategoriaSelec = 'SaboresVinoteca | Categoria';
const tituloProductoIndividual = 'SaboresVinoteca | Ver producto';
const tituloError = 'SaboresVinoteca | Error';
const tituloExito = 'SaboresVinoteca | Exito';
const tituloIniciarSession = 'SaboresVinoteca | Iniciar sessión';
const tituloRegistrarse = 'SaboresVinoteca | Registrarse';
const tituloContacto = 'SaboresVinoteca | Contactate con nosotros'
const VistaInicio = (req, res) =>{
    const usuario = req.user ?? [];
    console.log(usuario);
    res.render('inicio', {
        TITULO: tituloInicio,
        Usuario: usuario[0],
        URLMadre : urlMadre,
        orgURL: req.originalUrl,
        Descripcion: 'SaboresVinoteca | Bebidas nacionales e importadas',
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaCargar = async (req, res) =>{
    const usuario = req.user ?? [];
    if(usuario[0] && usuario[0].Jerarquia && usuario[0].Jerarquia == 'ADMIN'){
        res.render('administracion/administracionDeCargar', {
            TITULO: tituloCargar,
            Usuario: usuario[0],
            URLMadre: urlMadre,
            orgURL: req.originalUrl,
            Descripcion: 'SaboresVinoteca | Cargar',
            F_UsuarioActivo: UsuarioActivo,
            F_AdminActivo: AdminActivo,
            F_DetectarJavaScript: DetectarJavaScript,
        });
    }else{
        VistaInicio(req, res);
    }
}
const VistaEditarProductos = (req, res) =>{
    const usuario = req.user ?? [];
    if(usuario[0] && usuario[0].Jerarquia && usuario[0].Jerarquia == 'ADMIN'){
        res.render('administracion/administrarEditarProducto', {
            TITULO: tituloEditar,
            Usuario: usuario[0],
            URLMadre : urlMadre,
            orgURL: req.originalUrl,
            Descripcion: 'SaboresVinoteca | Editar productos',
            F_UsuarioActivo: UsuarioActivo,
            F_AdminActivo: AdminActivo,
            F_DetectarJavaScript: DetectarJavaScript,
        });
    }else{
        VistaInicio(req, res);
    }
}
const VistaError = (req, res)=>{
    const usuario = req.user ??[];
    const mensaje = req.query.mensaje;
    res.render('error', {
        TITULO: tituloError,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        Error: mensaje, 
        orgURL: req.originalUrl,
        Descripcion: 'SaboresVinoteca | Lo sentimos, ocurrió un error. Volvé a la página de inicio o contactanos si necesitas ayuda.',
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarCategorias = (req, res) =>{
    const usuario = req.user ?? [];
    if(usuario[0] && usuario[0].Jerarquia && usuario[0].Jerarquia == 'ADMIN'){
        res.render('administracion/adminEditarCategoria', {
            TITULO: tituloEditarCategorias,
            Usuario: usuario[0],
            URLMadre: urlMadre,
            orgURL: req.originalUrl,
            Descripcion: 'SaboresVinoteca | Editar categorias.',
            F_UsuarioActivo: UsuarioActivo,
            F_AdminActivo: AdminActivo,
            F_DetectarJavaScript: DetectarJavaScript,
        });
    }else{
        VistaInicio(req, res);
    }
}
const VistaEditarMarcas = (req, res)=>{
    const usuario = req.user ?? [];
    if(usuario[0] && usuario[0].Jerarquia && usuario[0].Jerarquia == 'ADMIN'){
        res.render('administracion/adminEditarMarcas', {
            TITULO: tituloEditarMarcas,
            Usuario: usuario[0],
            URLMadre: urlMadre,
            orgURL: req.originalUrl,
            Descripcion: 'SaboresVinoteca | Editar marcas.',
            F_UsuarioActivo: UsuarioActivo,
            F_AdminActivo: AdminActivo,
            F_DetectarJavaScript: DetectarJavaScript,
        });
    }else{
        VistaInicio(req, res);
    }
}
const VistaCategoriaSeleccionada = async (req, res)=>{
    const _IDCategoria = req.query.IDC;
    const categoria = await Con_ObtenerCategoriaPorID(_IDCategoria);
    console.log(categoria.Categoria[0]);
    const usuario = req.user ?? [];
    res.render('cliente/categoriaSelec', {
        TITULO: `${tituloCategoriaSelec} ${categoria.Categoria[0].Categoria}`,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        IDCategoria: _IDCategoria,
        orgURL: req.originalUrl,
        Descripcion: `SaboresVinoteca | ${categoria.Categoria[0].Categoria} | Descubrí nuestro amplio catálogo de bebidas, con opciones nacionales e importadas para todos los gustos.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaIndividualProducto = async (req, res)=>{
    const _IDProducto = req.query.IDP;
    const producto = await Con_ObtenerProductoPorID(_IDProducto);
    const categoria = await Con_ObtenerCategoriaPorID(producto.Productos[0].IDCategoria);
    const usuario = req.user ?? [];
    res.render('cliente/vistaIndividual', {
        TITULO: `${tituloProductoIndividual} | ${categoria.Categoria[0].Categoria} | ${producto.Productos[0].Producto}`,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        IDProducto: _IDProducto,
        orgURL: req.originalUrl,
        Descripcion: `${categoria.Categoria[0].Categoria} | ${producto.Productos[0].Producto} |  Descubrí nuestro catálogo en SaboresVinoteca.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaIniciarSession = (req, res)=>{
    const usuario = req.user ?? [];
    res.render('autenticacion/iniciarSession', {
        TITULO: tituloIniciarSession,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        orgURL: req.originalUrl,
        Descripcion: `SaboresVinoteca | Inicia sesión.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaRegistrarse = (req, res)=>{
    const usuario = req.user ?? [];
    res.render('autenticacion/registrarse', {
        TITULO: tituloRegistrarse,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        orgURL: req.originalUrl,
        Descripcion: `SaboresVinoteca | Registrate.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaExito = (req, res)=>{
    const usuario = req.user ?? [];
    const mensaje = req.query.mensaje;
    res.render('exito', {
        TITULO: tituloExito,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        Exito: mensaje, 
        orgURL: req.originalUrl,
        Descripcion: `SaboresVinoteca | Exito.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaContacto = (req, res)=>{
    const usuario = req.user ?? [];
    res.render('contacto', {
        TITULO: tituloContacto,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        orgURL: req.originalUrl,
        Descripcion: `SaboresVinoteca | Contactate con nosotros y consultá sobre nuestros vinos y bebidas nacionales e importadas.`,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
function DetectarJavaScript(titulo){
    if(titulo.startsWith(tituloCategoriaSelec))
        return {js: '/dist/js/clienteCategoriaSelect.bundle.js', existe:true};
    if(titulo.startsWith(tituloProductoIndividual))
        return {js: '/dist/js/vistaIndividual.bundle.js', existe:true}
    switch(titulo){
        case tituloInicio: return {js:'/dist/js/inicio.bundle.js', existe: true };
        case tituloCargar: return {js:'/dist/js/cargar.bundle.js', existe: true };
        case tituloEditar: return {js:'/dist/js/editar.bundle.js', existe: true };
        case tituloEditarMarcas: return {js:'/dist/js/editarMarcas.bundle.js', existe: true };
        case tituloEditarCategorias: return {js:'/dist/js/editarCategorias.bundle.js', existe: true };
        case tituloIniciarSession: return {js: '/dist/js/iniciarSession.bundle.js', existe:true};
        case tituloRegistrarse: return {js: '/dist/js/registrarse.bundle.js', existe:true};
        case tituloExito: return {js: '/dist/js/exito.bundle.js', existe:true};
        default: return { existe: false }; 
    }
}
function UsuarioActivo(Usuario){
    if(Usuario)
        return true;
    return false;
}
function AdminActivo(Jerarquia){
    if(Jerarquia == "ADMIN")
        return true;
    return false;
}
export default { 
    VistaInicio, VistaCargar, VistaEditarProductos,
    VistaError, VistaEditarCategorias, VistaEditarMarcas,
    VistaCategoriaSeleccionada, VistaIndividualProducto,
    VistaIniciarSession, VistaRegistrarse, VistaExito,
    VistaContacto
};