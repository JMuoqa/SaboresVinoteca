let urlMadre = '';
if(process.env.NODE_ENV = 'development'){
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
const VistaInicio = (req, res) =>{
    res.render('inicio', {
        TITULO: tituloInicio,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaCargar = async (req, res) =>{
    
    res.render('administracion/administracionDeCargar', {
        TITULO: tituloCargar,
        Usuario: {Nombre: "Joaquin", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarProductos = (req, res) =>{
    res.render('administracion/administrarEditarProducto', {
        TITULO: tituloEditar,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaError = (req, res)=>{
    const mensaje = req.query.mensaje;
    res.render('error', {
        TITULO: tituloError,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        Error: mensaje, 
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarCategorias = (req, res) =>{
    res.render('administracion/adminEditarCategoria', {
        TITULO: tituloEditarCategorias,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaEditarMarcas = (req, res)=>{
    res.render('administracion/adminEditarMarcas', {
        TITULO: tituloEditarMarcas,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
}
const VistaCategoriaSeleccionada = (req, res)=>{
    const _IDCategoria = req.query.IDC;
    res.render('cliente/categoriaSelec', {
        TITULO: tituloCategoriaSelec,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        IDCategoria: _IDCategoria,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
}
const VistaIndividualProducto = (req, res)=>{
    const _IDProducto = req.query.IDP;
    res.render('cliente/vistaIndividual', {
        TITULO: tituloProductoIndividual,
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        IDProducto: _IDProducto,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    })
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
};