import express from 'express'
import controladorPrincipal from '../controladores/controladorPrincipal.mjs';
const enrutador = express.Router();
enrutador.get('/', controladorPrincipal.VistaInicio);
enrutador.get('/cargar-productos-categorias', controladorPrincipal.VistaCargar);
enrutador.get('/editar-productos', controladorPrincipal.VistaEditarProductos);
enrutador.get('/error', controladorPrincipal.VistaError);
enrutador.get('/editar-categorias', controladorPrincipal.VistaEditarCategorias);
enrutador.get('/editar-marcas', controladorPrincipal.VistaEditarMarcas);
enrutador.get('/categoria-seleccionada', controladorPrincipal.VistaCategoriaSeleccionada);
enrutador.get('/ver-producto', controladorPrincipal.VistaIndividualProducto);
enrutador.get('/autenticacion', controladorPrincipal.VistaIniciarSession);
enrutador.get('/registrarse', controladorPrincipal.VistaRegistrarse);
enrutador.get('/exito', controladorPrincipal.VistaExito);
enrutador.get('/contacto', controladorPrincipal.VistaContacto);
export default enrutador;