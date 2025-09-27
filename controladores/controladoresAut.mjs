import validator from "validator"
import bcrypt from 'bcrypt';
import passport from '../config/passport.mjs';
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { CargarUsuarioComun, ChequearEmail, ChequearUsuario, ObtenerUsuario } from "../solicitudes/solicitudesAuttenticacion/solicitudesAut.mjs";
const saltoDeRondas = 12
let urlMuoqa = '';
if(process.env.NODE_ENV === 'development'){
    urlMuoqa = 'https://muoqa.com:5010';
}
else{
    urlMuoqa = 'https://muoqa.com';
}
const Registrarse = async (req, res, next) => {
    const { usuario, email, contraseña, contraseñaR } = req.body;
    try{
        const bandera = await ValidarDatosParaRegistrarse(usuario, email, contraseña, contraseñaR) ?? null;
        if(bandera)
            return res.json({estado: 'muyMalo', mensaje: bandera});
        const contraseñaEncriptada = await bcrypt.hash(contraseña, saltoDeRondas);
        const solicitudCarga = await CargarUsuarioComun(usuario, contraseñaEncriptada, email);
        if(!solicitudCarga)
            return res.json({estado: 'muyMalo', mensaje: "No pudimos registrar tu usuario"});
        req.body.username = usuario; 
        req.body.password = contraseña;
        passport.authenticate('local', (err, user, info) => {
            if(err) return next(err);
            if(!user) return res.json({estado: 'muyMalo', mensaje: info.message});

            req.login(user, (err) => {
                if(err) return next(err);
                return res.json({estado: 'exitoso', mensaje: 'Usuario registrado y logueado'});//, user: {ID: user.ID, Usuario: user.Usuario, Email: user.Email}});
            });
        })(req, res, next);
    }catch(error){
        console.log(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
async function ValidarDatosParaRegistrarse(usuario, email, contraseña, contraseñaR) {
    const regexUsuario = /^[a-zA-Z0-9@._-]+$/;
    if (!usuario || !regexUsuario.test(usuario)) {
        return 'Usuario contiene caracteres inválidos o está vacío';
    }
    if (!contraseña || !regexUsuario.test(contraseña)) {
        return 'Contraseña contiene caracteres inválidos o está vacía';
    }
    if (!email || !validator.isEmail(email)) {
        return 'Email no es válido o está vacío';
    }
    if(contraseñaR != contraseñaR){
        return 'Las contraseñas no son iguales'
    }
    const chequearUsuario = await ChequearUsuario(usuario);
    if(chequearUsuario)
        return chequearUsuario;
    const chequearEmail = await ChequearEmail(email);
    if(chequearEmail)
        return chequearEmail;
    return null;
}
const IniciarSession = async (req, res, next) =>{
    try{
        const { usuario, contraseña } = req.body;
        const bandera = await ValidarDatosParaIniciarSession(usuario, contraseña) ?? null;
        if(bandera)
            return res.json({estado: 'malo', mensaje: bandera});
        req.body.username = usuario; // passport local usa req.body.username por defecto
        req.body.password = contraseña;
        passport.authenticate('local', (err, user, info) => {
            if(err) return next(err);
            if(!user) return res.json({estado: 'muyMalo', mensaje: info.message});
            req.login(user, (err) => {
                if(err) return next(err);
                return res.json({estado: 'exitoso', mensaje: 'Usuario logueado'});
            });
        })(req, res, next);
    }catch(error){
        console.log(error);
        return res.json({estado: 'muyMalo', mensaje: error});
    }
}
async function ValidarDatosParaIniciarSession(usuario, contraseña) {
    const regexUsuario = /^[a-zA-Z0-9@._-]+$/;
    if (!usuario || !regexUsuario.test(usuario)) {
        return 'El usuario contiene caracteres inválidos o está vacío';
    }
    if (!contraseña || !regexUsuario.test(contraseña)) {
        return 'La contraseña contiene caracteres inválidos o está vacía';
    }
    return null;
}
export default{
    Registrarse, IniciarSession
}