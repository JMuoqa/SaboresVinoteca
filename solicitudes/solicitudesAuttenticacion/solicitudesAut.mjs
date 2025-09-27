import { Conexion, CerrarConexion } from "../../modelos/conexionSaboresVinoteca.mjs";
async function CargarUsuarioComun(usuario, contraseña, mail) {
    const conexion = await Conexion();
    try{
        const insertarUsuario = 'INSERT INTO Usuarios (Usuario, Email, Contraseña, Jerarquia) VALUES(?,?,?,?)';
        const valores = [usuario, mail, contraseña, "usuario"];
        await conexion.query(insertarUsuario, valores, (error, resultado)=>{
            if (error) {
                throw new Error('Error al registrarse: ', error)
            }
        });
        return true;
    }catch(error){
        console.error('Error al obtener datos: ', error);
        return false;
    }
    finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerUsuario(ID) {
    const conexion = await Conexion();
    try{
        const obtener = "SELECT Email, ID, Jerarquia, Usuario FROM Usuarios WHERE ID = ?";
        const [fila] = await conexion.execute(obtener, [ID]);
        return fila;
    }catch(error){
        console.log(error);
        return 'Error al comprobar el usuario';
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ChequearUsuario(usuario) {
    const conexion = await Conexion();
    try{
        const seleccionarUsuario = 'SELECT Usuario FROM Usuarios WHERE Usuario = ?'
        const [fila] = await conexion.execute(seleccionarUsuario, [usuario]);
        if(fila.length > 0 && fila[0].Usuario && fila[0].Usuario == usuario){
            return 'Ese usuario ya existe';
        }
        return false;
    }catch(error){
        console.log(error);
        return 'Error al comprobar el usuario';
    }
    finally{
        await CerrarConexion(conexion);
    }
}
async function ChequearEmail(email) {
    const conexion = await Conexion();
    try{
        const seleccionarEmail = 'SELECT Email FROM Usuarios WHERE Email = ?'
        const [fila] = await conexion.execute(seleccionarEmail, [email]);
        if(fila.length > 0 && fila[0].Email && fila[0].Email == email){
            return 'Ese email ya existe';
        }
        return false;
    }catch(error){
        console.log(error);
        return 'Error al comprobar el email';
    }
    finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerDatosUsuario(usuario) {
    const conexion = await Conexion();
    try{
        const obtener = "SELECT * FROM Usuarios WHERE Usuario = ?";
        const [fila] = await conexion.execute(obtener, [usuario]);
        return fila;
    }catch(error){
        console.log(error);
        return 'Error al comprobar el usuario';
    }finally{
        await CerrarConexion(conexion);
    }
}
export {
    CargarUsuarioComun, ObtenerUsuario, ChequearUsuario,
    ChequearEmail, ObtenerDatosUsuario
}