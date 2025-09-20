import express from 'express'
import controladorPrincipal from '../controladores/controladorPrincipal.mjs';
const enrutador = express.Router();
enrutador.get('/', controladorPrincipal.VistaPrincipal);
enrutador.get('/cargar-productos-categorias', controladorPrincipal.VistaCargar);
enrutador.get('/editar-productos', controladorPrincipal.VistaEditarProductos);
enrutador.get('/error', controladorPrincipal.VistaError);
export default enrutador;