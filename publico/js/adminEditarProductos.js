document.addEventListener('DOMContentLoaded', function(){
  AEditarOtros();
  ActualizarProductos();
  ActualizarListaCategorias();
  ActualizarListaMarcas();
  BotonBuscarYEventoDelFormulario();
  EventosChangeDeEntradas();
  GuardarInformacionPrincipal();
  GuardarInformacionCategorica();
  GuardarImagen();
  MostrarGaleriaDeImagenesParaCategoria();
  CambiarPaginas();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function AEditarOtros(){
  const botonEditarCategoria = document.getElementById('botonEditarCategoria');
  botonEditarCategoria.addEventListener('click', function(){
    window.location.href = `${URLMadre}/editar-categorias`;
  });
  const botonEditarMarca = document.getElementById('botonEditarMarca');
  botonEditarMarca.addEventListener('click', function(){
    window.location.href = `${URLMadre}/editar-marcas`;
  });
}
function MostrarGaleriaDeImagenesParaCategoria(){
    const entrada = document.getElementById('entradaDeImagenesProducto')
    const elementoImagen = document.getElementById('imagenVistaPreviaProducto')
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
function ActualizarProductos() {
    const contenedorProductos = document.getElementById('contenedorProductos');
    AnimacionAviso(true, 0)
    fetch('admin/obtener-productos?limite=14')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
      AnimacionAviso(false, 0)
      if(respuesta['Productos']){
        const Productos = respuesta['Productos'];
        const Marcas = respuesta['Marcas'];
        contenedorProductos.innerHTML = '';
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
          contenedorProductos.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto contenedor-info-producto-funcional" data-id="${Productos[i].ID}">
                <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                <div class="contenedor-informacion-productos">
                  <p class="texto-info-producto nombre-del-producto"><strong>${Productos[i].Producto}</strong></p>
                  <p class="texto-info-producto marca-del-producto"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                  <p class="texto-info-producto precio-del-producto"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                </div>
              </article>`;
            contenedorProductos.appendChild(articulo)
            // Forzar “reflow” antes de añadir la clase de animación
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
      AgregarFuncionesProductos();
    }).catch( error => {
        console.error(error);
        AnimacionAviso(false, 0)
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
}
function BotonBuscarYEventoDelFormulario() {
  const formularioFiltro = document.getElementById('formularioFiltro');
  formularioFiltro.addEventListener('submit', function(event){
    event.preventDefault();
    const contenedorProductos = document.getElementById('contenedorProductos');
    const datosDelFormulario = new FormData(this);
    const datos = {};
    datosDelFormulario.forEach((value, key)=>{
      datos[key] = value;
    })
    const numeroDePagina = document.getElementById('numeroDePagina');
    const url = new URL(window.location);
    const parametros = new URLSearchParams(url.search);
    parametros.set("busqueda", datos['busqueda']);
    parametros.set("marca", datos['marca']);
    parametros.set("categoria", datos['categoria']);
    parametros.set("limite", 14);
    parametros.set("pagina", 1);
    url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
    url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
    fetch(url.toString())
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
      if(respuesta['Productos']){
        const Productos = respuesta['Productos'];
        const Marcas = respuesta['Marcas'];
        contenedorProductos.innerHTML = '';
        numeroDePagina.innerText = 1;
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
          contenedorProductos.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto contenedor-info-producto-funcional" data-id="${Productos[i].ID}">
                <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                <div class="contenedor-informacion-productos">
                  <p class="texto-info-producto nombre-del-producto"><strong>${Productos[i].Producto}</strong></p>
                  <p class="texto-info-producto marca-del-producto"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                  <p class="texto-info-producto precio-del-producto"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                </div>
              </article>`;
            contenedorProductos.appendChild(articulo)
            // Forzar “reflow” antes de añadir la clase de animación
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
      AgregarFuncionesProductos();
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  })
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
function AgregarFuncionesProductos(){
  const productos = document.querySelectorAll('.contenedor-info-producto-funcional');
  productos.forEach((producto)=>{
    producto.addEventListener('click', function(){
      window.location.href = '#ver-edicion'
      AnimacionAviso(true, 1);
      const ID = producto.dataset.id;
      const url = new URL(window.location);
      const parametros = new URLSearchParams(url.search);
      parametros.set("ID", ID);
      url.pathname  = 'admin/obtener-producto-por-ID';
      url.search = parametros.toString();
      fetch(url.toString())
      .then(respuesta => {
        if(!respuesta.ok)
          throw new Error('Error en la solicitud');
        return respuesta.json();
      }).then(({estado, Producto, Marcas, Categorias, mensaje})=>{
        if(estado && Producto){
          CargarFormulario(Producto, Marcas, Categorias);
        }
        else{
          if(mensaje)
            throw new Error(mensaje);
          throw new Error('Hay un error, contactate con el desarrollador');
        }
      }).catch( error =>{
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
      })
    });
  });
}
async function CargarFormulario(producto, Marcas, Categorias){
  const numeroProducto = document.getElementById('numeroProducto');
  const nombreProducto = document.getElementById('nombreProducto');
  const entradaNombre = document.getElementById('entradaNombre');
  const entradaPrecio = document.getElementById('entradaPrecio');
  const editarEntradaCategoria = document.getElementById('editarEntradaCategoria');
  const editarEntradaMarcas = document.getElementById('editarEntradaMarcas');
  const imagenVistaPreviaProducto = document.getElementById('imagenVistaPreviaProducto');
  const entradasOcultas = document.querySelectorAll('.entrada-oculta-id-seleccionado');
  numeroProducto.innerText = producto[0].ID;
  nombreProducto.innerText = producto[0].Producto;
  entradaNombre.value = producto[0].Producto;
  entradaPrecio.value = parseInt(producto[0].Precio);
  const marcaSeleccionada = Marcas[producto[0].IDMarca-1].Marca;
  const categoriaSeleccionada = Categorias[producto[0].IDCategoria-1].Categoria;
  for(let i = 0; i < editarEntradaCategoria.options.length; i++ ){
    if(categoriaSeleccionada == editarEntradaCategoria.options[i].value){
      editarEntradaCategoria.selectedIndex = i;
    }
  }
  await ActualizarMarcasSinEventos();
  for(let i = 0; i < editarEntradaMarcas.options.length; i++){
    if(marcaSeleccionada == editarEntradaMarcas.options[i].value){
      editarEntradaMarcas.selectedIndex = i;
    }
  }
  for(let i = 0; i < entradasOcultas.length; i++){
    entradasOcultas[i].value = producto[0].ID;
  }
  imagenVistaPreviaProducto.src = `${URLMadre}/Imagenes/${producto[0].Imagen}`
  entradaPrecio.dispatchEvent(new Event('input'));
  entradaNombre.dispatchEvent(new Event('input'));
  editarEntradaMarcas.dispatchEvent(new Event('change'));
  AnimacionAviso(false, 1);
}
function EventosChangeDeEntradas(){
    const nombreProducto = document.getElementById('entradaNombre');
    const etiquetaNombreProducto = document.getElementById('editarEtiquetaNombreProducto');
    nombreProducto.addEventListener('input', function(){
        if(nombreProducto.value.trim() === '')
            etiquetaNombreProducto.innerText = 'Nombre';
        else
            etiquetaNombreProducto.innerText = nombreProducto.value.trim();
    });
    const entradaMarca = document.getElementById('editarEntradaMarcas');
    const etiquetaMarcaProducto = document.getElementById('editarEtiquetaMarcaProducto');
    entradaMarca.addEventListener('change', function(){
        if(entradaMarca.value.trim() === '' || entradaMarca.value.trim() === 'No seleccionado' || entradaMarca.value.trim() === 'No hay')
            etiquetaMarcaProducto.innerText = '';
        else
            etiquetaMarcaProducto.innerText = entradaMarca.value.trim();
    })
    const precioProducto = document.getElementById('entradaPrecio');
    const etiquetaPrecioProducto = document.getElementById('editarEtiquetaPrecioProducto');
    precioProducto.addEventListener('input', function(){
        if(precioProducto.value.trim() === '')
            etiquetaPrecioProducto.innerText = '';
        else
            etiquetaPrecioProducto.innerText = ConseguirFormatoDelPrecioOriginal(precioProducto.value.trim());
    });
}
async function ActualizarListaCategorias() {
    const entradaCategorias = document.getElementById('entradaCategorias')
    const editarEntradaCategoria = document.getElementById('editarEntradaCategoria')
    fetch('admin/obtener-categorias').then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(respuesta =>{
        const Categorias = respuesta['Categorias'];
        entradaCategorias.innerHTML = '<option>Sin filtro</option>';
        editarEntradaCategoria.innerHTML = '<option>No seleccionada</option>'
        for(let i = 0; i < Categorias.length; i++){
            let opcionesDeCategorias = `<option>${Categorias[i].Categoria}</option>`;
            let opcionesDeCategoriasColor = `<option class="texto-naranja-edicion">${Categorias[i].Categoria}</option>`;
            entradaCategorias.innerHTML += opcionesDeCategorias;
            editarEntradaCategoria.innerHTML += opcionesDeCategoriasColor;
        }
        
    })
}
async function ActualizarMarcasSinEventos() {
  try{
    const editarEntradaCategoria = document.getElementById('editarEntradaCategoria');
    const editarEntradaMarcas = document.getElementById('editarEntradaMarcas')
    const categoria = editarEntradaCategoria.value;
    const respuesta = await fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`);
    if(!respuesta.ok)
      throw new Error('Error en la solicitud');
    const { Marcas } = await respuesta.json();
    editarEntradaMarcas.innerHTML = '<option>No seleccionado</option>';
    for(let i = 0; i < Marcas.length; i++){
        let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
        editarEntradaMarcas.innerHTML += opcionesDeMarcas;
    }
    return;
  }catch (error){
    console.error(error);
    window.location.href = `${URLMadre}/error?mensaje=${error}`;
    return;
  }
}
function ActualizarListaMarcas() {
    const entradaCategorias = document.getElementById('entradaCategorias');
    
    entradaCategorias.addEventListener('change', function(){
        const entradaMarcas = document.getElementById('entradaMarcas')
        const categoria = entradaCategorias.value;
        if(categoria != 'No seleccionada'){
            fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(({Marcas}) =>{
                entradaMarcas.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
                for(let i = 0; i < Marcas.length; i++){
                    let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
                    entradaMarcas.innerHTML += opcionesDeMarcas;
                }

            })
        }else{
            entradaMarcas.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
        }
    });
    const editarEntradaCategoria = document.getElementById('editarEntradaCategoria');
    editarEntradaCategoria.addEventListener('change', function(){
        const editarEntradaMarcas = document.getElementById('editarEntradaMarcas')
        const categoria = editarEntradaCategoria.value;
        if(categoria != 'No seleccionada'){
            fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(({Marcas}) =>{
                editarEntradaMarcas.innerHTML = '<option>No seleccionado</option>';
                for(let i = 0; i < Marcas.length; i++){
                    let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
                    editarEntradaMarcas.innerHTML += opcionesDeMarcas;
                }

            })
        }else{
            editarEntradaMarcas.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
        }
    });
}
function GuardarInformacionPrincipal(){
  const formularioDatosPrincipales = document.getElementById('formularioDatosPrincipales');
  const formularioFiltro = document.getElementById('formularioFiltro');
  formularioDatosPrincipales.addEventListener('submit', function(event){
    event.preventDefault();
    AnimacionAviso(true, 2)
    const datosDelFormulario = new FormData(this);
    const datos = {};
    datosDelFormulario.forEach((valor, campo)=>{
      datos[campo] = valor;
    });
    fetch('admin/cambiar-datos-principales',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    }).then(respuesta => {
      if(!respuesta.ok)
        throw new Error('Error en la solicitud')
      return respuesta.json();
    }).then(({estado, mensaje})=>{
      AnimacionAviso(false, 2)
      const p = document.getElementById('textoEdicionPrincipal');
      if(estado == 'exitoso')
        p.style = 'color: #2ea356;';
      else
        p.style = 'color: #d7596d;';
      p.innerText = mensaje;
      setTimeout(function(){
          p.innerText = '';
      },5000);
      formularioFiltro.dispatchEvent(new Event('submit'));
    }).catch( error => {
      console.error(error);
      AnimacionAviso(false, 2)
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  });
}
function GuardarInformacionCategorica(){
  const formularioFiltro = document.getElementById('formularioFiltro');
  const formularioDatosCategoricos = document.getElementById('formularioDatosCategoricos');
  formularioDatosCategoricos.addEventListener('submit', function(event){
    event.preventDefault();
    AnimacionAviso(true, 3)
    const datosDelFormulario = new FormData(this);
    const datos = {};
    datosDelFormulario.forEach((valor, campo)=>{
      datos[campo] = valor;
    });
    fetch('admin/cambiar-datos-categoricos',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    }).then(respuesta => {
      if(!respuesta.ok)
        throw new Error('Error en la solicitud')
      return respuesta.json();
    }).then(({estado, mensaje})=>{
      AnimacionAviso(false, 3)
      const p = document.getElementById('textoEdicionCategorica');
      if(estado == 'exitoso')
        p.style = 'color: #2ea356;';
      else
        p.style = 'color: #d7596d;';
      p.innerText = mensaje;
      setTimeout(function(){
          p.innerText = '';
      },5000);
      formularioFiltro.dispatchEvent(new Event('submit'));
    }).catch( error => {
      console.error(error);
      AnimacionAviso(false, 3)
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  });
}
function GuardarImagen(){
  const formularioFiltro = document.getElementById('formularioFiltro');
  const formularioDatoImagen = document.getElementById('formularioDatoImagen');
  formularioDatoImagen.addEventListener('submit', function(event){
    event.preventDefault();
    AnimacionAviso(true, 4)
    const datosDelFormulario = new FormData(this);
    fetch('admin/cambiar-imagen-producto',{
      method: 'POST',
      body: datosDelFormulario
    }).then(respuesta => {
      if(!respuesta.ok)
        throw new Error('Error en la solicitud')
      return respuesta.json();
    }).then(({estado, mensaje})=>{
      AnimacionAviso(false, 4)
      const p = document.getElementById('textoEditarImagen');
      if(estado == 'exitoso')
        p.style = 'color: #2ea356;';
      else
        p.style = 'color: #d7596d;';
      p.innerText = mensaje;
      setTimeout(function(){
          p.innerText = '';
      },5000);
      formularioFiltro.dispatchEvent(new Event('submit'));
    }).catch( error => {
      console.error(error);
      AnimacionAviso(false, 4)
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  });
}
function ConseguirFormatoDelPrecioOriginal(precio){
    let precioFinal = Math.round(precio);
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
function FetchCambiarPagina(nPagina, url, etiqueta, contenedor, avisoPaginaLimite, animacion){
  fetch(url)
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async respuesta => {
    AnimacionAviso(false, animacion);
    if(respuesta['Productos']){
      const Productos = respuesta['Productos'];
      const Marcas = respuesta['Marcas'];
      if(Productos.length == 0){
        avisoPaginaLimite.style = 'color: #d7596d;';
        avisoPaginaLimite.innerText = 'No hay más páginas disponibles. Presiona el botón "Buscar" si actualizaste alguno de los filtros.';
        setTimeout(function(){
          paginaLimite.innerText = '';
        },5000);
      }
      else{
        etiqueta.innerText = nPagina;
        contenedor.innerHTML = '';
        for(let i = 0; i < Productos.length; i++){
          const articulo = document.createElement('article');
          articulo.innerHTML = `
            <article class="contenedor-info-producto contenedor-info-producto-funcional" data-id="${Productos[i].ID}">
              <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
              <div class="contenedor-informacion-productos">
                <p class="texto-info-producto nombre-del-producto"><strong>${Productos[i].Producto}</strong></p>
                <p class="texto-info-producto marca-del-producto"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                <p class="texto-info-producto precio-del-producto"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
              </div>
            </article>`;
          contenedor.appendChild(articulo)
          // Forzar “reflow” antes de añadir la clase de animación
          articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
          articulo.classList.add('animar-contenedor-info-producto');
          await Esperar(50);
        }
      }
    }else{
        throw new Error('Hubo un error en la cosulta')
    }
    AgregarFuncionesProductos();
  }).catch( error => {
      console.error(error);
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
  });
}
function CambiarPaginas(){
  const indiceSiguiente = document.getElementById('indiceSiguiente');
  indiceSiguiente.addEventListener('click', function(){
    AnimacionAviso(true, 0);
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    const numeroSiguiente = numeroDePagina + 1;
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroSiguiente;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');
    const paginaLimite = document.getElementById('paginaLimite');
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 0);
    const aUrl = new URL(window.location);
    aUrl.hash = 'formularioFiltro'
    window.location.href = aUrl.toString();
  });
  const indiceAnterior = document.getElementById('indiceAnterior');
  indiceAnterior.addEventListener('click', function(){
    AnimacionAviso(true, 0);
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    let numeroAnterior = numeroDePagina - 1;
    if(numeroAnterior <= 0)
      numeroAnterior 
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroAnterior;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');
    const paginaLimite = document.getElementById('paginaLimite');
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 0);
    const aUrl = new URL(window.location);
    aUrl.hash = 'formularioFiltro'
    window.location.href = aUrl.toString();
  });
}
function ObtenerURLConParametros(){
  const entradaCategoriaProductos = document.getElementById('entradaCategorias').value;
  const entradaMarcaProductos = document.getElementById('entradaMarcas').value;
  const entradaValorBusqueda = document.getElementById('entradaValorBusqueda').value;
  const numeroDePagina = document.getElementById('entradaPagina').value;
  const url = new URL(window.location);
  const parametros = new URLSearchParams(url.search);
  parametros.set("busqueda", entradaValorBusqueda);
  parametros.set("marca", entradaMarcaProductos);
  parametros.set("categoria", entradaCategoriaProductos);
  parametros.set("pagina", numeroDePagina);
  parametros.set("limite", 14);
  
  url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
  url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
  return url;
}