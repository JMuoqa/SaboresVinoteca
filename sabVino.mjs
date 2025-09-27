import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import expressLayouts from 'express-ejs-layouts';
import minifyHTML from 'express-minify-html';
import rutasPrincipales from './rutas/rutasPrincipales.mjs';
import rutasAdmin from './rutas/rutasAdmin.mjs';
import rutasAut from './rutas/rutasAut.mjs'
import session from 'express-session';
import passport from './config/passport.mjs';

let urlMadre = '';
if(process.env.NODE_ENV == 'development'){
    urlMadre = 'http://localhost:5111';
}else{
    urlMadre = 'https://saboresvinoteca.com';
}
const app = express();
const __nombreDelArchivo = fileURLToPath(import.meta.url); // Obtiene el archivo actual
const __nombreDelDirectorio = path.dirname(__nombreDelArchivo);       // Obtiene el directorio actual
app.set('view engine', 'ejs');
app.set('views', path.join(__nombreDelDirectorio, 'vistas'));
app.use(express.static(path.join(__nombreDelDirectorio, 'publico')));
app.use(expressLayouts);
app.use(express.json()); // para JSON
app.use(express.urlencoded({ extended: true })); // para datos de formulario
app.set('layout', '_Diseno');
app.set('view cache', true);
app.use(minifyHTML({
  override: true,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    minifyJS: true
  }
}));
// Session (necesaria para Passport)
app.use(session({ secret: process.env.Mi_secreto, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use('/', rutasPrincipales);
app.use('/admin', rutasAdmin);rutasAut
app.use('/aut', rutasAut);
if(process.env.NODE_ENV === 'development'){
    app.use('/Imagenes', express.static('C:\\Users\\Joaquin\\Desktop\\Proyectos\\Trabajo\\SaboresVinoteca\\ImagenesSubidas'));
}else{
    app.use('/Imagenes', express.static('/home/joaquin/Imagenes/SaboresVinoteca'));
}
app.use((req, res, next) => {
    const error = 'Vista no encontrada';
    res.status(404).render('error', {
        TITULO: 'Error',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        Error: error, 
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
});
app.use((err, req, res, next) => {
    console.error(err);
    console.log('Error - interno: ' + err);
    const error = err.message;
    res.render('error', {
        TITULO: 'Error',
        Usuario: {Nombre: "prueba", Jerarquia: "ADMIN"},
        URLMadre: urlMadre,
        Error: error, 
        F_UsuarioActivo: UsuarioActivo,
        F_AdminActivo: AdminActivo,
        F_DetectarJavaScript: DetectarJavaScript,
    });
});


function DetectarJavaScript(titulo){
    return false;
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
const PORT = 5111;
app.listen(PORT, () => {
    console.log(`Servidor escuchando por el puerto ${PORT}: http://dominio:${PORT}`);
});