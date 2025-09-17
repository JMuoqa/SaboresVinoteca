
const VistaPrincipal = (req, res) =>{
    res.render('inicio', {
        TITULO: 'SaboresVinoteca',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
}
const VistaCargar = (req, res) =>{
    res.render('administracion/administracionDeCargar', {
        TITULO: 'Cargar productos y categorias',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
    });
}
const VistaEditarProductos = (req, res) =>{
    res.render('administracion/administrarEditarProducto', {
        TITULO: 'Editar productos',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
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
    VistaPrincipal, VistaCargar, VistaEditarProductos
};