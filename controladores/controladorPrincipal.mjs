import { Con_ObtenerMarcas, Con_ObtenerCategorias } from "../solicitudes/admin/solicitudesAdmin.mjs";
let urlMadre = '';
if(process.env.NODE_ENV = 'development'){
    urlMadre = 'http://localhost:5111';
}else{
    urlMadre = 'https://saboresvinoteca.com';
}
const VistaPrincipal = (req, res) =>{
    res.render('inicio', {
        TITULO: 'SaboresVinoteca',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
}
const VistaCargar = async (req, res) =>{
    
    res.render('administracion/administracionDeCargar', {
        TITULO: 'Cargar productos y categorias',
        Usuario: {Nombre: "Joaquin", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
}
const VistaEditarProductos = (req, res) =>{
    res.render('administracion/administrarEditarProducto', {
        TITULO: 'Editar productos',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre : urlMadre,
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
}
const VistaError = (req, res)=>{
    const mensaje = req.query.mensaje;
    res.render('error', {
        TITULO: 'Editar productos',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        Error: mensaje, 
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
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
    VistaPrincipal, VistaCargar, VistaEditarProductos,
    VistaError
};