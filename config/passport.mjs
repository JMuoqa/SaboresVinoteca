import passport from 'passport'; // En muoqa.mjs importamos ./config/passport.mjs ya que aca hacemos la configuracion
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { ObtenerDatosUsuario, ObtenerUsuario } from '../solicitudes/solicitudesAuttenticacion/solicitudesAut.mjs';
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (Usuario, Contrasena, done) =>{
    try{
        const fila = await ObtenerDatosUsuario(Usuario);
        //done() es la funcion que finaliza la verificacion. recibe 3 parametros (error, usuario, mensaje)
        if (fila.length === 0) return done(null, false, { message: 'Usuario no encontrado' });
        const usuario = fila[0];
        const match = await bcrypt.compare(Contrasena, usuario["Contraseña"]);
        if (!match) return done(null, false, { message: 'Contraseña incorrecta' });
        return done(null, usuario);
    }catch(error){
        console.log(error);
        return done(error);
    }
}));
//serializeUser guarda un dato(en este caso el id) para usarlo en cada request del usaurio despues de logearse
passport.serializeUser((user, done) => done(null, user.ID)); 
passport.deserializeUser(async (id, done) => {//Aca usamos el dato(el id guardado despues de logearse) para consultar los datos del usaurio
    try {
        const filas = await ObtenerUsuario(id); 
        done(null, filas);
    } catch (err) {
        done(err);
    }
});
export default passport;