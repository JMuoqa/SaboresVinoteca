import path from 'path';
import { fileURLToPath } from 'url';
const __nombreDelArchivo = fileURLToPath(import.meta.url); // Obtiene el archivo actual
const __nombreDelDirectorio = path.dirname(__nombreDelArchivo);       // Obtiene el directorio actual
export default {
  entry: {
    principal: './publico/js/principal.js',
    cargar: './publico/js/adminCargarProductos.js',
    inicio: './publico/js/inicio.js',
    editar: './publico/js/adminEditarProductos.js',
    editarCategorias: './publico/js/adminEditarCategorias',
    editarMarcas: './publico/js/adminEditarMarcas',
    clienteCategoriaSelect: './publico/js/clienteCategoriaSelect.js',
    vistaIndividual: './publico/js/clienteVistaIndividual.js',
    iniciarSession: './publico/js/iniciarSession.js',
    registrarse: './publico/js/registrarse.js',
    exito: './publico/js/exito.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__nombreDelDirectorio, 'publico/js/dist'), // importante
  },
  mode: 'production',
};
