import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import expressLayouts from 'express-ejs-layouts';
import minifyHTML from 'express-minify-html';
import rutasPrincipales from './rutas/rutasPrincipales.mjs';
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
app.use('/', rutasPrincipales);
const PORT = 5111;
if(process.env.NODE_ENV === 'development'){
    app.use('/Imagenes', express.static(path.join(__nombreDelDirectorio, 'carpeta_imagenes/subidas')));
}else{
    app.use('/Imagenes', express.static('/home/joaquin/Imagenes/SaboresVinoteca'));
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando por el puerto ${PORT}: http://dominio:${PORT}`);
});