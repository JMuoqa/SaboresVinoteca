document.addEventListener('DOMContentLoaded', function(){
    EditarOtros();
    ActualizarSeccionCategorias();
    MostrarGaleriaDeImagenesParaCategoria();
    GuardarCategoria();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
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
function GuardarCategoria(){
    const seccionCargaCategorias = document.getElementById('seccionCargaCategorias');
    seccionCargaCategorias.addEventListener('submit', function(event){
        event.preventDefault();
        AnimacionAviso(true, 0)
        const datosDelFormulario = new FormData(this);
        fetch('admin/cambiar-datos-de-categoria', {
            method: 'POST',
            body: datosDelFormulario
        }).then(respuesta => {
            if(!respuesta.ok)
                throw new Error('Error en la solicitud'); 
            return respuesta.json();  
        }).then(({estado, mensaje})=>{
            AnimacionAviso(false, 0)
            const p = document.getElementById('textoEdicion');
            if(estado == 'exitoso')
                p.style = 'color: #2ea356;';
            else
                p.style = 'color: #d7596d;';
            p.innerText = mensaje;
            setTimeout(function(){
                p.innerText = '';
            },5000);
            ActualizarSeccionCategorias();
        }).catch( error =>{
            console.error(error);
            AnimacionAviso(false, 0)
            window.location.href = `${URLMadre}/error?mensaje=${error}`;
        })
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
                lector.onload = function(e){ 
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
function ActualizarSeccionCategorias() {
    const contenedorDeLasCategorias = document.getElementById('contenedorDeLasCategorias');
    fetch('admin/obtener-categorias')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
        const Categorias = respuesta['Categorias'];
        contenedorDeLasCategorias.innerHTML = '';
        if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){
          let html = '<p class="texto-centrado"><strong>No se encontraron categorias cargadas</strong></p>';
          contenedorDeLasCategorias.innerHTML = html;
        }else{
          for(let i = 0; i < Categorias.length; i++){
          const articulo = document.createElement('article');
            articulo.innerHTML = `
            <article class="contenedor-categoria contenedor-categoria-funcional" data-id="${Categorias[i].ID}">
              <img class="imagen-categoria" src="${URLMadre}/Imagenes/${Categorias[i].Imagen}">
              <div class="filtro-categoria"></div>
              <h3 class="titulo-categoria">${Categorias[i].Categoria}</h3>
            </article> `;
            contenedorDeLasCategorias.appendChild(articulo);
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
        AgregarFuncionesACategorias();
    }).catch( error =>{
      console.error(error);
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
    })
}
function AgregarFuncionesACategorias(){
    const articulos = document.querySelectorAll('.contenedor-categoria-funcional')
    for(let i = 0; i< articulos.length; i++){
        articulos[i].addEventListener('click', function(){
            const ID = articulos[i].dataset.id;
            const url = new URL(window.location);
            const parametros = new URLSearchParams(url.search);
            parametros.set("ID", ID);
            url.pathname  = 'admin/obtener-categoria-por-ID';
            url.search = parametros.toString();
            fetch(url.toString())
            .then(respuesta =>{
                if(!respuesta.ok)
                  throw new Error('Error en la solicitud'); 
                return respuesta.json();  
            }).then(({estado, Categoria})=>{
                if(estado=='exitoso'){
                    CargarDatos(Categoria);
                }
            })
        });
    }
}
function CargarDatos(Categoria){
    const nombreCategoria = document.getElementById('nombreCategoria');
    const imagenVistaPrevia = document.getElementById('imagenVistaPrevia');
    const entradaOcultaID = document.getElementById('entradaOcultaID');
    nombreCategoria.value = Categoria[0].Categoria;
    entradaOcultaID.value = Categoria[0].ID;
    imagenVistaPrevia.src = `${URLMadre}/Imagenes/${Categoria[0].Imagen}`;
}
function EditarOtros(){
    const botonEditarProductos = document.getElementById('botonEditarProductos');
    botonEditarProductos.addEventListener('click', function(){
        window.location.href = `${URLMadre}/editar-productos`;
    });
    const botonEditarMarca = document.getElementById('botonEditarMarca');
    botonEditarMarca.addEventListener('click', function(){
      window.location.href = `${URLMadre}/editar-marcas`;
    });
}