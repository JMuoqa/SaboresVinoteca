let urlMadre = '';
if(process.env.NODE_ENV == 'development'){
    urlMadre = 'http://localhost:5111';
}else{
    urlMadre = 'https://saboresvinoteca.com';
}
const tituloInicio = 'SaboresVinoteca';
const tituloCargar = 'Cargar productos y categorias';
const tituloEditar = 'Editar productos';
const tituloEditarCategorias = 'Editar Categoria';
const tituloEditarMarcas = 'Editar Marcas';
const tituloCategoriaSelec = 'Categoria seleccionada';
const tituloProductoIndividual = 'Ver producto';
const tituloError = 'Error';
const tituloExito = 'Exito';
const tituloIniciarSession = 'Iniciar sessión';
const tituloRegistrarse = 'Registrarse';
const VistaInicio = (req, res) =>{
    const usuario = req.user ?? [];
    console.log(usuario);
    res.render('inicio', {
        TITULO: tituloInicio,
        Usuario: usuario[0],
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaCargar = async (req, res) =>{
    const usuario = req.user ?? [];
    res.render('administracion/administracionDeCargar', {
        TITULO: tituloCargar,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarProductos = (req, res) =>{
    const usuario = req.user ?? [];
    res.render('administracion/administrarEditarProducto', {
        TITULO: tituloEditar,
        Usuario: usuario,
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaError = (req, res)=>{
    const usuario = req.user ?? [];
    const mensaje = req.query.mensaje;
    res.render('error', {
        TITULO: tituloError,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        Error: mensaje, 
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarCategorias = (req, res) =>{
    const usuario = req.user ?? [];
    res.render('administracion/adminEditarCategoria', {
        TITULO: tituloEditarCategorias,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarMarcas = (req, res)=>{
    const usuario = req.user ?? [];
    res.render('administracion/adminEditarMarcas', {
        TITULO: tituloEditarMarcas,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaCategoriaSeleccionada = (req, res)=>{
    const _IDCategoria = req.query.IDC;
    const usuario = req.user ?? [];
    res.render('cliente/categoriaSelec', {
        TITULO: tituloCategoriaSelec,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        IDCategoria: _IDCategoria,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaIndividualProducto = (req, res)=>{
    const _IDProducto = req.query.IDP;
    const usuario = req.user ?? [];
    res.render('cliente/vistaIndividual', {
        TITULO: tituloProductoIndividual,
        Usuario: usuario[0],
        URLMadre: urlMadre,
        IDProducto: _IDProducto,
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
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
function DetectarJavaScript(titulo){
    switch(titulo){
        case tituloInicio: return {js:'/js/dist/inicio.bundle.js', existe: true };
        case tituloCargar: return {js:'/js/dist/cargar.bundle.js', existe: true };
        case tituloEditar: return {js:'/js/dist/editar.bundle.js', existe: true };
        case tituloEditarMarcas: return {js:'/js/dist/editarMarcas.bundle.js', existe: true };
        case tituloEditarCategorias: return {js:'/js/dist/editarCategorias.bundle.js', existe: true };
        case tituloCategoriaSelec: return {js: '/js/dist/clienteCategoriaSelect.bundle.js', existe:true};
        case tituloProductoIndividual: return {js: '/js/dist/vistaIndividual.bundle.js', existe:true};
        case tituloIniciarSession: return {js: '/js/dist/iniciarSession.bundle.js', existe:true};
        case tituloRegistrarse: return {js: '/js/dist/registrarse.bundle.js', existe:true};
        case tituloExito: return {js: '/js/dist/exito.bundle.js', existe:true};
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
    VistaIniciarSession, VistaRegistrarse, VistaExito
};