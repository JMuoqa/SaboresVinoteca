/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./publico/js/inicio.js":
/*!******************************!*\
  !*** ./publico/js/inicio.js ***!
  \******************************/
/***/ (() => {

eval("{document.addEventListener('DOMContentLoaded', function(){\r\n    ActualizarSeccionCategorias();\r\n});\r\nasync function Esperar(milisegundos) {\r\n  return new Promise(resolver => setTimeout(resolver,milisegundos))\r\n}\r\nfunction ActualizarSeccionCategorias() {\r\n  const contenedorDeLasCategorias = document.getElementById('contenedorDeLasCategorias');\r\n  AnimacionAviso(true, 0);\r\n  fetch('admin/obtener-categorias')\r\n  .then(respuesta =>{\r\n    if(!respuesta.ok)\r\n      throw new Error('Error en la solicitud'); \r\n    return respuesta.json();    \r\n  }).then(async respuesta => {\r\n    const Categorias = respuesta['Categorias'];\r\n    AnimacionAviso(false, 0);\r\n    if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){\r\n      let html = '<p class=\"texto-centrado\"><strong>No se encontraron categorias cargadas</strong></p>';\r\n      contenedorDeLasCategorias.innerHTML = html;\r\n    }else{\r\n      for(let i = 0; i < Categorias.length; i++){\r\n        const articulo = document.createElement('article');\r\n        articulo.innerHTML = `\r\n        <article class=\"contenedor-categoria contenedor-categoria-funcional\" loading=\"lazy\" alt=\"Imagen de ${Categorias[i].Categoria}\" data-id=${Categorias[i].ID}>\r\n          <img class=\"imagen-categoria\" src=\"${URLMadre}/Imagenes/${Categorias[i].Imagen}\">\r\n          <div class=\"filtro-categoria\"></div>\r\n          <h3 class=\"titulo-categoria\">${Categorias[i].Categoria}</h3>\r\n        </article> `;\r\n        contenedorDeLasCategorias.appendChild(articulo);\r\n        articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado\r\n        articulo.classList.add('animar-contenedor-info-producto');\r\n        await Esperar(50);\r\n      }\r\n      AgregarFuncionesACategorias();\r\n    }\r\n  })\r\n}\r\nfunction AgregarFuncionesACategorias(){\r\n  const categorias = document.querySelectorAll('.contenedor-categoria-funcional');\r\n  for(let i = 0; i<categorias.length; i++){\r\n    categorias[i].addEventListener('click', function(){\r\n      window.location.href = `${URLMadre}/categoria-seleccionada?IDC=${categorias[i].dataset.id}#tituloCategoria`\r\n    });\r\n  }\r\n}\r\nfunction AnimacionAviso(estado, pos){\r\n    const index = parseInt(pos, 10); \r\n    const animacionDeCarga = document.querySelectorAll('.contenedor-espiral');\r\n    if(estado){\r\n        animacionDeCarga[index].style.display = 'flex';\r\n    }else{\r\n        animacionDeCarga[index].style.display = 'none';\r\n    }\r\n}\n\n//# sourceURL=webpack://weboriginal/./publico/js/inicio.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./publico/js/inicio.js"]();
/******/ 	
/******/ })()
;