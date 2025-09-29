import mysql from 'mysql2/promise';
async function Conexion() {
    try{
        const conexion = await mysql.createConnection({
            host: process.env.HOSTVPS,
            user: process.env.UsuarioSaboresVinoteca,
            password: process.env.ContrasenaBaseSaboresVinoteca,
            database: process.env.VPSBaseSaboresVinoteca
        })
        console.log('Conexion a MySQL establecida.');
        return conexion;
    }
    catch (error){
        console.error('Error al conectar a MySQL: ', error);
        throw error;
    }
}
async function CerrarConexion(Conexion) {
    if (Conexion) {
        try {
            await Conexion.end();
            console.log('Conexion a MySQL cerrada.');
        } catch (e) {
            console.error("Error al cerrar la conexión:", e);
        }
    }
}
export { Conexion, CerrarConexion };