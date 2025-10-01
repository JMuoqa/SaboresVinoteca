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

/***/ "./publico/js/registrarse.js":
/*!***********************************!*\
  !*** ./publico/js/registrarse.js ***!
  \***********************************/
/***/ (() => {

eval("{document.addEventListener('DOMContentLoaded', function(){\r\n    Registrarse();\r\n});\r\n\r\nfunction Registrarse(){\r\n    const formularioAut = document.getElementById('formularioAut');\r\n    formularioAut.addEventListener('submit', function(event){\r\n        event.preventDefault();\r\n        const datosDelFormulario = new FormData(this);\r\n        const datos = {};\r\n        datosDelFormulario.forEach((valor, campo)=>{\r\n            datos[campo] = valor;\r\n        })\r\n        fetch('aut/cargar-usuario',{\r\n            method: 'POST',\r\n            headers: {\r\n                'Content-Type': 'application/json'\r\n            },\r\n            body: JSON.stringify(datos)\r\n        }).then(respuesta =>{\r\n            if(!respuesta.ok)\r\n                throw new Error('Error en la solicitud');\r\n            return respuesta.json();\r\n        }).then(({estado, mensaje})=>{\r\n            if(estado == 'exitoso'){\r\n                window.location.href = `${URLMadre}/exito?mensaje=${mensaje}`;\r\n            }else{\r\n                const p = document.getElementById('mensajeAlerta');\r\n                p.style = 'color: #d7596d;';\r\n                p.innerText = mensaje;\r\n                setTimeout(function(){\r\n                    p.innerText = '';\r\n                },5000);\r\n            }\r\n        }).catch( error => {\r\n            console.error(error);\r\n            window.location.href = `${URLMadre}/error?mensaje=${error}`;\r\n        });\r\n    })\r\n}\n\n//# sourceURL=webpack://weboriginal/./publico/js/registrarse.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./publico/js/registrarse.js"]();
/******/ 	
/******/ })()
;