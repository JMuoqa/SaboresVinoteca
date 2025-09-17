document.addEventListener('DOMContentLoaded', async function(){
    await MostrarGaleriaDeImagenesParaCategoria();
    await MostrarGaleriaDeImagenesParaProducto();
    EventosChangeDeEntradas();
});
async function MostrarGaleriaDeImagenesParaCategoria(){
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
async function MostrarGaleriaDeImagenesParaProducto(){
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
        if(entradaMarca.value.trim() === '' || entradaMarca.value.trim() === 'Ninguno')
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