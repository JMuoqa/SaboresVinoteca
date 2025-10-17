import path from 'path';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import RemoveEmptyScriptsPlugin from "webpack-remove-empty-scripts";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
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
    //css
    estiloAdminCargar: './publico/css/estiloAdminDeCargar.css',
    estiloClienteCatSelect: './publico/css/estiloClienteCatSelect.css',
    estiloEditarCategorias: './publico/css/estiloEditarCategorias.css',
    estiloEditarMarcas: './publico/css/estiloEditarMarcas.css',
    estiloEditarProductos: './publico/css/estiloEditarProductos.css',
    estiloExito: './publico/css/estiloExito.css',
    estiloIniciarSession: './publico/css/estiloIniciarSession.css',
    estiloInicio: './publico/css/estiloInicio.css',
    estiloPrincipal: './publico/css/estiloPrincipal.css',
    estiloRegistrarse: './publico/css/estiloRegistrarse.css',
    estiloVerProducto: './publico/css/estiloVerProducto.css',
    estiloContacto: './publico/css/estiloContacto.css',
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__nombreDelDirectorio, 'publico/dist'), // importante
    clean:true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
    }),
  ],
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // mantiene TerserPlugin para JS
      new CssMinimizerPlugin()
    ]
  }
}

