import express from 'express'
import controladorPrincipal from '../controladores/controladorPrincipal.mjs';
const enrutador = express.Router();

let pagado = true;
if(pagado){
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
}
else{
    enrutador.get('/', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/cargar-productos-categorias', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/editar-productos', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/error', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/editar-categorias', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/editar-marcas', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/categoria-seleccionada', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/ver-producto', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/autenticacion', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/registrarse', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/exito', controladorPrincipal.VistaServicioImpago);
    enrutador.get('/contacto', controladorPrincipal.VistaServicioImpago);
}
export default enrutador;