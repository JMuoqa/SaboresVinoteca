document.addEventListener('DOMContentLoaded', function(){
    MostrarGaleriaDeImagenesParaCategoria();
    ActualizarListaMarcas();
    ActualizarListaCategorias();
    MostrarGaleriaDeImagenesParaProducto();
    EventosChangeDeEntradas();
    CargarMarca();
    CargarCategoria();
    CargarProducto();
    CargarOtro();
});
function CargarOtro(){
    const botonCargarProductos = document.getElementById('botonCargarProductos');
    botonCargarProductos.addEventListener('click', function(){
        window.location.href = `${URLMadre}/cargar-productos-categorias#tituloSeccionProducto`
    });
    const botonCargarCategoria = document.getElementById('botonCargarCategoria');
    botonCargarCategoria.addEventListener('click', function(){
        window.location.href = `${URLMadre}/cargar-productos-categorias#tituloSeccionCategoria`
    });
    const botonCargarMarca = document.getElementById('botonCargarMarca');
    botonCargarMarca.addEventListener('click', function(){
        window.location.href = `${URLMadre}/cargar-productos-categorias#tituloSeccionMarca`
    });
}
function MostrarGaleriaDeImagenesParaCategoria(){
    const entrada = document.getElementById('entradaDeImagenes')
    const elementoImagen = document.getElementById('imagenVistaPrevia')
    let imagenSeleccionada = null;
    entrada.addEventListener('change', async function(event){ // Es asincrono por que llama a heic2any
        try {
            const archivo = event.target.files[0]; //No existe event.target.file, siempre devuelve un array
            let archivoFinal = null;
            if(!archivo)
                throw new Error ('No se selecciono ningun archivo');
            if(archivo && archivo.type === 'image/heic' || archivo.name.toLowerCase().endsWith('.heic')){
                    const blobConvertido = await heic2any({ //HEIC2ANY sirve para convertir heic2any a jpg
                        blob: archivo,
                        toType: "image/jpeg",
                        quality: 0.9
                    });
                    // Crear objeto File para que tenga type y name correctos
                    const archivoConvertido = new File([blobConvertido], file.name.replace(/\.heic$/i, '.jpg'), { type: "image/jpeg" });
                    archivoFinal = archivoConvertido;
            }else{
                archivoFinal = archivo
            }
            if(archivoFinal != null && archivoFinal.type.startsWith('image/')){
                const lector = new FileReader();
                lector.onload = function(e){ /*
                    reader.onload = function(e){}; esto le dice como va a ser la funcion 'onload',
                    que se ejecutara cada ves que termine de leer un archivo*/
                    imagenSeleccionada = e.target.result;
                    mostrarImagen();
                };
                lector.readAsDataURL(archivo);
            }
            else{
                elementoImagen.src='';
            }
        } catch (error) {
            console.error(error);
        }
    });
    function mostrarImagen(){
        if(imagenSeleccionada === null) return;
        elementoImagen.src = imagenSeleccionada;
        elementoImagen.style.display = 'block';
    }
}
function MostrarGaleriaDeImagenesParaProducto(){
    const entrada = document.getElementById('entradaDeImagenesProducto')
    const elementoImagen = document.getElementById('imagenVistaPreviaProducto')
    let imagenSeleccionada = null;
    
    entrada.addEventListener('change', async function(event){ // Es asincrono por que llama a heic2any
        try{
            const archivo = event.target.files[0]; //No existe event.target.file, siempre devuelve un array
            let archivoFinal = null;
            if(!archivo)
                throw new Error ('No se selecciono ningun archivo');
            if(archivo && archivo.type === 'image/heic' || archivo.name.toLowerCase().endsWith('.heic')){
                const blobConvertido = await heic2any({ //HEIC2ANY sirve para convertir heic2any a jpg
                    blob: archivo,
                    toType: "image/jpeg",
                    quality: 0.9
                });
                // Crear objeto File para que tenga type y name correctos
                const archivoConvertido = new File([blobConvertido], file.name.replace(/\.heic$/i, '.jpg'), { type: "image/jpeg" });
                archivoFinal = archivoConvertido;
            }else{
                archivoFinal = archivo
            }
            if(archivoFinal != null && archivoFinal.type.startsWith('image/')){
                const lector = new FileReader();
                lector.onload = function(e){ /*
                    reader.onload = function(e){}; esto le dice como va a ser la funcion 'onload',
                    que se ejecutara cada ves que termine de leer un archivo*/
                    imagenSeleccionada = e.target.result;
                    mostrarImagen();
                };
                lector.readAsDataURL(archivo);
            }
            else{
                throw new Error ('No se selecciono ningun archivo')
            }
        }catch (error){
            console.error(error);
            elementoImagen.src = '';
        }
    });
    function mostrarImagen(){
        if(imagenSeleccionada === null) return;
        elementoImagen.src = imagenSeleccionada;
        elementoImagen.style.display = 'block';
    }
}
function EventosChangeDeEntradas(){
    const nombreProducto = document.getElementById('nombreProducto');
    const etiquetaNombreProducto = document.getElementById('etiquetaNombreProducto');
    nombreProducto.addEventListener('input', function(){
        if(nombreProducto.value.trim() === '')
            etiquetaNombreProducto.innerText = 'Nombre';
        else
            etiquetaNombreProducto.innerText = nombreProducto.value.trim();
    });
    const entradaMarca = document.getElementById('entradaMarca');
    const etiquetaMarcaProducto = document.getElementById('etiquetaMarcaProducto');
    entradaMarca.addEventListener('change', function(){
        if(entradaMarca.value.trim() === '' || entradaMarca.value.trim() === 'No seleccionada' || entradaMarca.value.trim() === 'No hay' || entradaMarca.value.trim() === 'Selecciona una categoria para buscar marcas')
            etiquetaMarcaProducto.innerText = '';
        else
            etiquetaMarcaProducto.innerText = entradaMarca.value.trim();
    })
    const precioProducto = document.getElementById('precioProducto');
    const etiquetaPrecioProducto = document.getElementById('etiquetaPrecioProducto');
    precioProducto.addEventListener('input', function(){
        if(precioProducto.value.trim() === '')
            etiquetaPrecioProducto.innerText = '';
        else
            etiquetaPrecioProducto.innerText = ConseguirFormatoDelPrecioOriginal(precioProducto.value.trim());
    });
}
function CargarMarca(){
    const formulario = document.getElementById('seccionCargarMarcas');
    let estadoConsulta = true;
    formulario.addEventListener('submit', async function(event){
        event.preventDefault();
        if(estadoConsulta){
            estadoConsulta = false;
            AnimacionAviso(true, 2)
            const formData = new FormData(this);
            const datos = {};
            formData.forEach((value, key)=>{
                datos[key] = value;
            });
            fetch('admin/guardar-marca', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            }).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(async respuesta => {
                await VaciarSeccionMarca();
                await ActualizarListaMarcas();
                AnimacionAviso(false, 2)
                if(!respuesta){
                    throw new Error('Error en la solicitud');
                }
                if(respuesta['estado'] == 'muyMalo'){
                    throw new Error(respuesta['mensaje']);
                }
                if(respuesta['estado'] == 'malo'){
                    const p = document.getElementById('mensajeDeAlertaMarca');
                    p.style = 'color: #d7596d;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                    estadoConsulta = true;
                }else{
                    const p = document.getElementById('mensajeDeAlertaMarca');
                    p.style = 'color: #2ea356;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                    estadoConsulta = true;
                }
            }).catch(error=>{
                console.error(error);
                estadoConsulta = true;
                AnimacionAviso(false, 2)
                window.location.href = `${URLMadre}/error?mensaje=${error}`;
            })
        }
    });
}
function CargarCategoria(){
    const formulario = document.getElementById('seccionCargaCategorias');
    let estadoConsulta = true;
    formulario.addEventListener('submit', async function(event){
        event.preventDefault();
        if(estadoConsulta){
            AnimacionAviso(true, 1)
            const formData = new FormData(this);
            fetch('admin/guardar-categoria',{
                method:'POST',
                body: formData
            }).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(async respuesta => {
                await VaciarSeccionCategoria();
                await ActualizarListaCategorias();
                AnimacionAviso(false, 1)
                if(!respuesta){
                    throw new Error('Error en la solicitud');
                }
                if(respuesta['estado'] == 'muyMalo'){
                    throw new Error(respuesta['mensaje']);
                }
                if(respuesta['estado'] == 'malo'){
                    const p = document.getElementById('mensajeDeAlertaCategoria');
                    p.style = 'color: #d7596d;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                }else{
                    const p = document.getElementById('mensajeDeAlertaCategoria');
                    p.style = 'color: #2ea356;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                }
            }).catch(error=>{
                console.error(error);
                AnimacionAviso(false, 1)
                window.location.href = `${URLMadre}/error?mensaje=${error}`;
            });
        }
    }); 
}
function CargarProducto() {
    const formulario = document.getElementById('seccionCargaProductos');
    let estadoConsulta = true;
    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        if(estadoConsulta){
            estadoConsulta = false;
            AnimacionAviso(true, 0)
            const formData = new FormData(this);
            fetch('admin/guardar-producto', {
                method: 'POST',
                body: formData,
            }).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(async respuesta => {
                await VaciarSeccionProductos();
                AnimacionAviso(false, 0)
                if(!respuesta){
                    throw new Error('Error en la solicitud');
                }
                if(respuesta['estado'] == 'muyMalo'){
                    throw new Error(respuesta['mensaje']);
                }
                if(respuesta['estado'] == 'malo'){
                    const p = document.getElementById('mensajeDeAlertaProductos');
                    p.style = 'color: #d7596d;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                    estadoConsulta = true;
                }else{
                    const p = document.getElementById('mensajeDeAlertaProductos');
                    p.style = 'color: #2ea356;';
                    p.innerText = respuesta['mensaje'];
                    setTimeout(function(){
                        p.innerText = '';
                    },5000);
                    estadoConsulta = true;
                }
            }).catch(error=>{
                console.error(error);
                estadoConsulta = true;
                AnimacionAviso(false, 0)
                window.location.href = `${URLMadre}/error?mensaje=${error}`;
            })
        }
    });
}
function VaciarSeccionCategoria(){
    const nombreCategoria = document.getElementById('nombreCategoria');
    const entradaArchivos = document.getElementById('entradaDeImagenes')
    const elementoImagen = document.getElementById('imagenVistaPrevia')
    entradaArchivos.value = null;
    nombreCategoria.value = '';
    elementoImagen.src = '';
}
function AnimacionAviso(estado, pos){
  const index = parseInt(pos, 10); 
  const animacionDeCarga = document.querySelectorAll('.contenedor-espiral');
  if(estado){
    animacionDeCarga[index].style.display = 'flex';
  }else{
    animacionDeCarga[index].style.display = 'none';
  }
}
function VaciarSeccionMarca(){
    const entrada = document.getElementById('entradaCargarMarca')
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria');
    entrada.value = '';
    seccMarca_EntCategoria.selectedIndex = 0;
}
function VaciarSeccionProductos() {
    const nombreProducto = document.getElementById('nombreProducto');
    const entradaDeImagenesProducto = document.getElementById('entradaDeImagenesProducto');
    const imagenVistaPreviaProducto = document.getElementById('imagenVistaPreviaProducto');
    const entradaImportado = document.getElementById('entradaImportado');
    const entradaCategoriaProducto = document.getElementById('entradaCategoriaProducto');
    const entradaMarca = document.getElementById('entradaMarca');
    const precioProducto = document.getElementById('precioProducto');
    const etiquetaNombreProducto = document.getElementById('etiquetaNombreProducto');
    const etiquetaMarcaProducto = document.getElementById('etiquetaMarcaProducto');
    const etiquetaPrecioProducto = document.getElementById('etiquetaPrecioProducto');
    etiquetaNombreProducto.innerText = 'Nombre';
    etiquetaMarcaProducto.innerText = '';
    etiquetaPrecioProducto.innerText = '';
    nombreProducto.value = '';
    precioProducto.value = '';
    entradaDeImagenesProducto.value = null;
    imagenVistaPreviaProducto.src = '';
    entradaImportado.checked = false;
    entradaCategoriaProducto.selectedIndex = 0;
    entradaMarca.selectedIndex = 0;
}
function ActualizarListaMarcas() {
    const entradaCategoriaProducto = document.getElementById('entradaCategoriaProducto');
    entradaCategoriaProducto.addEventListener('change', function(){
        const entradaMarca = document.getElementById('entradaMarca')
        const categoria = entradaCategoriaProducto.value;
        if(categoria != 'No seleccionada'){
            fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(({Marcas}) =>{
                entradaMarca.innerHTML = '<option>No seleccionada</option>';
                for(let i = 0; i < Marcas.length; i++){
                    let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
                    entradaMarca.innerHTML += opcionesDeMarcas;
                }

            })
        }else{
            entradaMarca.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
        }
    });
}
function ActualizarListaCategorias() {
    const entradaCategoriaProducto = document.getElementById('entradaCategoriaProducto')
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria');
    fetch('admin/obtener-categorias').then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(respuesta =>{
        const Categorias = respuesta['Categorias'];
        entradaCategoriaProducto.innerHTML = '<option>No seleccionada</option>';
        seccMarca_EntCategoria.innerHTML = '<option>No seleccionada</option>';
        for(let i = 0; i < Categorias.length; i++){
            let opcionesDeCategorias = `<option>${Categorias[i].Categoria}</option>`;
            entradaCategoriaProducto.innerHTML += opcionesDeCategorias;
            seccMarca_EntCategoria.innerHTML += opcionesDeCategorias;
        }
        
    })
}
function ConseguirFormatoDelPrecioOriginal(precio){
    let precioFinal = precio;
    const arregloDeNumeros = precioFinal.toString().split('');
    const arregloAux = [];
    for(let i = arregloDeNumeros.length-1; i>=0; i--){ 
        let largoDelArreglo = arregloDeNumeros.length-1;
        let controlador = largoDelArreglo - i;
        if(controlador%3==0 && i != arregloDeNumeros.length-1){
            arregloAux.push('.');
            arregloAux.push(arregloDeNumeros[i]);
        }else{
            arregloAux.push(arregloDeNumeros[i]);
        }
    }
    arregloAux.push('$');
    let cadenaDeTexto = '';
    for(let i = arregloAux.length-1; i>=0; i--){
        cadenaDeTexto += arregloAux[i];
    }
    cadenaDeTexto += ',00';
    return cadenaDeTexto;
}