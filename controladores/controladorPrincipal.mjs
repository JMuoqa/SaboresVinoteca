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
function DetectarJavaScript(titulo){
    switch(titulo){
        case tituloInicio: return {js:'/js/dist/inicio.bundle.js', existe: true };
        case tituloCargar: return {js:'/js/dist/cargar.bundle.js', existe: true };
        case tituloEditar: return {js:'/js/dist/editar.bundle.js', existe: true };
        case tituloEditarCategorias: return {js:'/js/dist/editarCategorias.bundle.js', existe: true };
        default: return { existe: false }; 
    }
}
function UsuarioActivo(Usuario){
    if(!Usuario)
        return true;
    return false;
}
function AdminActivo(Jerarquia){
    if(Jerarquia == "ADMIN")
        return true;
    return false;
}
export default { 
    VistaInicio, VistaCargar, VistaEditarProductos, VistaError, VistaEditarCategorias,
};