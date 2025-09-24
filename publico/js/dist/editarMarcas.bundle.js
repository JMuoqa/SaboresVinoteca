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

/***/ "./publico/js/adminEditarMarcas.js":
/*!*****************************************!*\
  !*** ./publico/js/adminEditarMarcas.js ***!
  \*****************************************/
/***/ (() => {

eval("{document.addEventListener('DOMContentLoaded', function(){\r\n    EditarOtros();\r\n    ActualizarListaCategorias();\r\n    Carrusel()\r\n});\r\nfunction EditarOtros(){\r\n    const botonEditarProductos = document.getElementById('botonEditarProductos');\r\n    botonEditarProductos.addEventListener('click', function(){\r\n        window.location.href = `${URLMadre}/editar-productos`;\r\n    });\r\n    const botonEditarCategorias = document.getElementById('botonEditarCategorias');\r\n    botonEditarCategorias.addEventListener('click', function(){\r\n      window.location.href = `${URLMadre}/editar-categorias`;\r\n    });\r\n}\r\nasync function ActualizarListaCategorias() {\r\n    const entradaCategoriasBusqueda = document.getElementById('entradaCategoriasBusqueda')\r\n    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria')\r\n    fetch('admin/obtener-categorias').then(respuesta => {\r\n        if(!respuesta.ok)\r\n            throw new Error('Error en la solicitud');\r\n        return respuesta.json()\r\n    }).then(respuesta =>{\r\n        const Categorias = respuesta['Categorias'];\r\n        entradaCategoriasBusqueda.innerHTML = '<option>Selecciona una para buscar marcas</option>';\r\n        seccMarca_EntCategoria.innerHTML = '<option>No seleccionada</option>'\r\n        for(let i = 0; i < Categorias.length; i++){\r\n            const opcionesDeCategorias = `<option>${Categorias[i].Categoria}</option>`;\r\n            entradaCategoriasBusqueda.innerHTML += opcionesDeCategorias;\r\n            seccMarca_EntCategoria.innerHTML += opcionesDeCategorias;\r\n        }\r\n        \r\n    })\r\n}\r\nfunction Carrusel() {\r\n    const pista = document.querySelector(\".pista\");\r\n    const slides = document.querySelectorAll(\".slide\");\r\n    const next = document.getElementById(\"indiceSiguiente\");\r\n    const prev = document.getElementById(\"indiceAnterior\");\r\n    let indice = 0;\r\n    // Clonar el primer y último slide para el efecto infinito\r\n    const firstClone = slides[0].cloneNode(true);\r\n    const lastClone = slides[slides.length - 1].cloneNode(true);\r\n    for(let i=0; i<6;i++){\r\n      if(slides[i]){\r\n          const clone = slides[i].cloneNode(true);\r\n          pista.appendChild(clone);\r\n      }\r\n    }\r\n    pista.appendChild(firstClone);\r\n    pista.insertBefore(lastClone, slides[0]);\r\n    let totalSlides = pista.querySelectorAll(\".slide\").length;\r\n    console.log(totalSlides);\r\n    console.log(slides.length);\r\n    // Posicion inicial (después del clon)\r\n    pista.style.transform = `translateX(-${140}px)`; \r\n    indice = 1;\r\n\r\n    async function moverCarrusel() {\r\n        pista.style.transition = \"transform 0.3s ease-in-out\";\r\n        pista.style.transform = `translateX(-${indice * 140}px)`;\r\n    }\r\n\r\n  next.addEventListener(\"click\", async () => {\r\n    if (indice >= slides.length + 1) return;\r\n    indice++;\r\n    await moverCarrusel();\r\n  });\r\n\r\n  prev.addEventListener(\"click\", async () => {\r\n    if (indice <= 0) return;\r\n    indice--;\r\n    await moverCarrusel();\r\n  });\r\n\r\n  // Reset al llegar al clon (truco del loop)\r\n  pista.addEventListener(\"transitionend\", () => {\r\n    if (indice == slides.length+1) {\r\n      pista.style.transition = \"none\";\r\n      indice = 1;\r\n      pista.style.transform = `translateX(-${140}px)`;\r\n    }\r\n    if (indice == 0) {\r\n      pista.style.transition = \"none\";\r\n      indice = totalSlides - 7;\r\n      pista.style.transform = `translateX(-${indice * 140}px)`;\r\n    }\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://weboriginal/./publico/js/adminEditarMarcas.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./publico/js/adminEditarMarcas.js"]();
/******/ 	
/******/ })()
;