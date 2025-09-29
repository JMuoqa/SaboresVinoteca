import express from 'express'
import controladoresAut from '../controladores/controladoresAut.mjs';
const enrutador = express.Router();
enrutador.post('/cargar-usuario', controladoresAut.Registrarse);
enrutador.post('/iniciar', controladoresAut.IniciarSession);
enrutador.post('/salir', controladoresAut.SalirDeLaSession);
export default enrutador;