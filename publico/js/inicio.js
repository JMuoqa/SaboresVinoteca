document.addEventListener('DOMContentLoaded', function(){
    ActualizarProductos();
    ActualizarProductosImportados();
    ActualizarListaCategorias();
    ActualizarListaMarcas();
    BotonBuscarYEventoDelFormulario();
    CambiarPaginas();
    BotonBuscarYEventoDelFormularioImportados();
    ActualizarSeccionCategorias();
    ObtenerTodosLosProductos();
    CambiarPaginasImport();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function ActualizarProductos() {
    const contenedorProductos = document.getElementById('contenedorProductos');
    fetch('admin/obtener-productos')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async ({Productos, Marcas}) => {
      if(Productos){
        contenedorProductos.innerHTML = '';
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
          contenedorProductos.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto">
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
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
}
function ActualizarProductosImportados() {
    const conteendorProductosImportados = document.getElementById('conteendorProductosImportados');
    fetch('admin/obtener-productos?importado=1')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
      if(respuesta['Productos']){
        const Productos = respuesta['Productos'];
        const Marcas = respuesta['Marcas'];
        conteendorProductosImportados.innerHTML = '';
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
          conteendorProductosImportados.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto">
                <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                <div class="contenedor-informacion-productos">
                  <p class="texto-info-producto nombre-del-producto"><strong>${Productos[i].Producto}</strong></p>
                  <p class="texto-info-producto marca-del-producto"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                  <p class="texto-info-producto precio-del-producto"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                </div>
              </article>`;
            conteendorProductosImportados.appendChild(articulo)
            // Forzar “reflow” antes de añadir la clase de animación
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
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
    if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){
      let html = '<p class="texto-centrado"><strong>No se encontraron categorias cargadas</strong></p>';
      contenedorProductos.innerHTML = html;
    }else{
      for(let i = 0; i < Categorias.length; i++){
      const articulo = document.createElement('article');
        articulo.innerHTML = `
        <article class="contenedor-categoria">
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
  })
}
function ActualizarListaCategorias() {
    const entradaCategorias = document.getElementById('entradaCategorias')
    const entradaCategoriasImport = document.getElementById('entradaCategoriasImport')
    fetch('admin/obtener-categorias').then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(respuesta =>{
        const Categorias = respuesta['Categorias'];
        entradaCategorias.innerHTML = '<option>Sin filtro</option>';
        entradaCategoriasImport.innerHTML = '<option>Sin filtro</option>';
        for(let i = 0; i < Categorias.length; i++){
            let opcionesDeCategorias = `<option>${Categorias[i].Categoria}</option>`;
            entradaCategorias.innerHTML += opcionesDeCategorias;
            entradaCategoriasImport.innerHTML += opcionesDeCategorias;
        }
        
    })
}
function ActualizarListaMarcas() {
    const entradaMarcas = document.getElementById('entradaMarcas')
    const entradaMarcasImport = document.getElementById('entradaMarcasImport')
    fetch('admin/obtener-marcas').then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(respuesta =>{
        const Marcas = respuesta['Marcas'];
        entradaMarcas.innerHTML = '<option>Sin filtro</option>';
        entradaMarcasImport.innerHTML = '<option>Sin filtro</option>';
        for(let i = 0; i < Marcas.length; i++){
            let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
            entradaMarcas.innerHTML += opcionesDeMarcas;
            entradaMarcasImport.innerHTML += opcionesDeMarcas;
        }
    });
}
function BotonBuscarYEventoDelFormulario() {
  const formularioFiltro = document.getElementById('formularioFiltro');
  formularioFiltro.addEventListener('submit', function(event){
    const contenedorProductos = document.getElementById('contenedorProductos');
    event.preventDefault();
    const datosDelFormulario = new FormData(this);
    const datos = {};
    datosDelFormulario.forEach((value, key)=>{
      datos[key] = value;
    })
    let precioMin = document.getElementById('min').innerText.replace('$','');
    let precioMax = document.getElementById('max').innerText.replace('$','');
    const numeroDePagina = document.getElementById('numeroDePagina');
    // // Obtenes la url actual
    const url = new URL(window.location);
    // Tomás los query params como objeto manejable
    const parametros = new URLSearchParams(url.search);
    // Cambiás los parámetros que quieras
    parametros.set("precioMin", precioMin);
    parametros.set("precioMax", precioMax);
    parametros.set("busqueda", datos['busqueda']);
    parametros.set("marca", datos['marca']);
    parametros.set("categoria", datos['categoria']);
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
              <article class="contenedor-info-producto">
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
      }
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  })
  const buscarProductos = document.getElementById('buscarProductos');
  buscarProductos.addEventListener('click', function(){
    const entradaValorBusqueda = document.getElementById('entradaValorBusqueda');
    const entracaOcultaBusqueda = document.getElementById('entracaOcultaBusqueda');
    entracaOcultaBusqueda.value = entradaValorBusqueda.value;
    const formularioFiltro = document.getElementById('formularioFiltro');
    formularioFiltro.dispatchEvent(new Event('submit'));
  });
}
function BotonBuscarYEventoDelFormularioImportados(){
  const formularioFiltroImport = document.getElementById('formularioFiltroImport');
  formularioFiltroImport.addEventListener('submit', function(event){
    event.preventDefault();
    const conteendorProductosImportados = document.getElementById('conteendorProductosImportados');
    const datosDelFormulario = new FormData(this);
    const datos = {};
    datosDelFormulario.forEach((value, key)=>{
      datos[key] = value;
    })
    let precioMin = document.getElementById('min-import').innerText.replace('$','');
    let precioMax = document.getElementById('max-import').innerText.replace('$','');
    const numeroDePagina = document.getElementById('numeroDePagina');
    const url = new URL(window.location);
    const parametros = new URLSearchParams(url.search);
    parametros.set("precioMin", precioMin);
    parametros.set("precioMax", precioMax);
    parametros.set("busqueda", datos['busqueda']);
    parametros.set("marca", datos['marca']);
    parametros.set("categoria", datos['categoria']);
    parametros.set("pagina", 1);
    parametros.set("importado", 1);
    url.pathname  = 'admin/obtener-productos';
    url.search = parametros.toString();
    fetch(url.toString())
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
      if(respuesta['Productos']){
        const Productos = respuesta['Productos'];
        const Marcas = respuesta['Marcas'];
        conteendorProductosImportados.innerHTML = '';
        numeroDePagina.innerText = 1;
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
          conteendorProductosImportados.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto">
                <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                <div class="contenedor-informacion-productos">
                  <p class="texto-info-producto nombre-del-producto"><strong>${Productos[i].Producto}</strong></p>
                  <p class="texto-info-producto marca-del-producto"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                  <p class="texto-info-producto precio-del-producto"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                </div>
              </article>`;
            conteendorProductosImportados.appendChild(articulo)
            // Forzar “reflow” antes de añadir la clase de animación
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
  })
  const buscarProductosImport = document.getElementById('buscarProductosImport');
  buscarProductosImport.addEventListener('click', function(){
    const entradaValorBusquedaImport = document.getElementById('entradaValorBusquedaImport');
    const entracaOcultaBusquedaImport = document.getElementById('entracaOcultaBusquedaImport');
    entracaOcultaBusquedaImport.value = entradaValorBusquedaImport.value;
    const formularioFiltroImport = document.getElementById('formularioFiltroImport');
    formularioFiltroImport.dispatchEvent(new Event('submit'));
  });
}
function ObtenerURLConParametros(){
  let precioMin = document.getElementById('min').innerText.replace('$','');
  let precioMax = document.getElementById('max').innerText.replace('$','');
  const entradaCategoriaProductos = document.getElementById('entradaCategorias').value;
  const entradaMarcaProductos = document.getElementById('entradaMarcas').value;
  const entradaValorBusqueda = document.getElementById('entradaValorBusqueda').value;
  const numeroDePagina = document.getElementById('entradaPagina').value;
  const url = new URL(window.location);
  const parametros = new URLSearchParams(url.search);
  parametros.set("precioMin", precioMin);
  parametros.set("precioMax", precioMax);
  parametros.set("busqueda", entradaValorBusqueda);
  parametros.set("marca", entradaMarcaProductos);
  parametros.set("categoria", entradaCategoriaProductos);
  parametros.set("pagina", numeroDePagina);
  
  url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
  url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
  return url;
}
function ObtenerURLConParametrosImport(){
  let precioMin = document.getElementById('min-import').innerText.replace('$','');
  let precioMax = document.getElementById('max-import').innerText.replace('$','');
  const entradaCategoriaProductos = document.getElementById('entradaCategoriasImport').value;
  const entradaMarcaProductos = document.getElementById('entradaMarcasImport').value;
  const entradaValorBusqueda = document.getElementById('entradaValorBusquedaImport').value;
  const numeroDePagina = document.getElementById('entradaPaginaImport').value;
  const url = new URL(window.location);
  const parametros = new URLSearchParams(url.search);
  parametros.set("precioMin", precioMin);
  parametros.set("precioMax", precioMax);
  parametros.set("busqueda", entradaValorBusqueda);
  parametros.set("marca", entradaMarcaProductos);
  parametros.set("categoria", entradaCategoriaProductos);
  parametros.set("pagina", numeroDePagina);
  parametros.set("importado", 1);
  url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
  url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
  return url;
}
function FetchCambiarPagina(nPagina, url, etiqueta, contenedor){
  fetch(url)
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async respuesta => {
    if(respuesta['Productos']){
      const Productos = respuesta['Productos'];
      const Marcas = respuesta['Marcas'];
      if(Productos.length == 0){
        const paginaLimite = document.getElementById('paginaLimiteImport');
        paginaLimite.style = 'color: #d7596d;';
        paginaLimite.innerText = 'No hay más páginas disponibles. Presiona el botón "Buscar" si actualizaste alguno de los filtros.';
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
            <article class="contenedor-info-producto">
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
  }).catch( error => {
      console.error(error);
      window.location.href = `${URLMadre}/error?mensaje=${error}`;
  });
}
function CambiarPaginas(){
  const indiceSiguiente = document.getElementById('indiceSiguiente');
  indiceSiguiente.addEventListener('click', function(){
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    const numeroSiguiente = numeroDePagina + 1;
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroSiguiente;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePagina, contenedor);
  });
  const indiceAnterior = document.getElementById('indiceAnterior');
  indiceAnterior.addEventListener('click', function(){
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    let numeroAnterior = numeroDePagina - 1;
    if(numeroAnterior <= 0)
      numeroAnterior 
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroAnterior;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');conteendorProductosImportados
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePagina, contenedor);
  });
}
function CambiarPaginasImport(){
  const indiceSiguienteImport = document.getElementById('indiceSiguienteImport');
  indiceSiguienteImport.addEventListener('click', function(){
    const etiquetaNumeroDePaginaImport = document.getElementById('numeroDePaginaImport');
    const numeroDePagina = Number(etiquetaNumeroDePaginaImport.innerText);
    const numeroSiguiente = numeroDePagina + 1;
    const entradaPaginaImport = document.getElementById('entradaPaginaImport');
    entradaPaginaImport.value = numeroSiguiente;
    const url = ObtenerURLConParametrosImport();
    const contenedor = document.getElementById('conteendorProductosImportados');
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePaginaImport, contenedor);
  });
  const indiceAnterior = document.getElementById('indiceAnteriorImport');
  indiceAnterior.addEventListener('click', function(){
    const etiquetaNumeroDePaginaImport = document.getElementById('numeroDePaginaImport');
    const numeroDePagina = Number(etiquetaNumeroDePaginaImport.innerText);
    let numeroAnterior = numeroDePagina - 1;
    if(numeroAnterior <= 0)
      numeroAnterior 
    const entradaPaginaImport = document.getElementById('entradaPaginaImport');
    entradaPaginaImport.value = numeroAnterior;
    const url = ObtenerURLConParametrosImport();
    const contenedor = document.getElementById('conteendorProductosImportados');
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePaginaImport, contenedor);
  });
}
async function CargarSlider(_Productos){
  let Productos = [..._Productos]
  let precioMin = 0;
  let precioMax = 0;
  for(let i = 0; i<Productos.length; i++){
    let nMin = i;
    for(j=i+1; j < Productos.length; j++){
      if(Number(Productos[j].Precio) < Number(Productos[nMin].Precio)){
      //if(Productos[j].Precio < Productos[nMin].Precio){
        nMin = j;
      }
    }
    let aux = Productos[i];
    Productos[i] = Productos[nMin];
    Productos[nMin] = aux;
  }
  precioMin = Math.round(Productos[0].Precio);
  precioMax = Math.round(Productos[Productos.length-1].Precio);
  const slider = document.getElementById('slider'); 
  noUiSlider.create(slider, {
    start: [2500, 8700000],  // valores iniciales
    connect: true,
    range: {
      'min': precioMin,
      'max': precioMax
    }
  });
  const min = document.getElementById('min');
  const max = document.getElementById('max');
  slider.noUiSlider.on('update', function(values){
    min.textContent = Math.round(values[0]);
    max.textContent = Math.round(values[1]);
  });
}
async function CargarSliderImportados(_Productos){
  let Productos = [..._Productos]
  let precioMin = 0;
  let precioMax = 0;
  for(let i = 0; i<Productos.length; i++){
    let nMin = i;
    for(j=i+1; j < Productos.length; j++){
      if(Number(Productos[j].Precio) < Number(Productos[nMin].Precio)){
      //if(Productos[j].Precio < Productos[nMin].Precio){
        nMin = j;
      }
    }
    let aux = Productos[i];
    Productos[i] = Productos[nMin];
    Productos[nMin] = aux;
  }
  precioMin = Math.round(Productos[0].Precio);
  precioMax = Math.round(Productos[Productos.length-1].Precio);
  const slider = document.getElementById('slider-import'); 
  noUiSlider.create(slider, {
    start: [2500, 8700000],  // valores iniciales
    connect: true,
    range: {
      'min': precioMin,
      'max': precioMax
    }
  });
  const min = document.getElementById('min-import');
  const max = document.getElementById('max-import');
  slider.noUiSlider.on('update', function(values){
    min.textContent = Math.round(values[0]);
    max.textContent = Math.round(values[1]);
  });
}
async function ObtenerTodosLosProductos(){
  fetch('admin/obtener-todos-productos')
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async ({Productos})=> {
      if(Productos && Productos.length > 0){
        CargarSlider(Productos);
        CargarSliderImportados(Productos);
      }
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
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