document.addEventListener('DOMContentLoaded', function(){
    ActualizarProductos();
    CargarMarcas();
    ObtenerCategoriaPorID();
    ObtenerTodosLosProductos();
    ActualizarSeccionCategorias();
    BuscarProductos();
    CambiarPaginas();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function ObtenerCategoriaPorID(){
    const valorIDCategoria = document.getElementById('valorIDCategoria').value;
    fetch(`admin/obtener-categoria-por-ID?ID=${valorIDCategoria}`)
    .then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(({estado, Categoria})=>{
        if(estado == 'exitoso' && Categoria){
            const tituloCategoria = document.getElementById('tituloCategoria');
            tituloCategoria.innerText = `Categorias | ${Categoria[0].Categoria}`;
        }else{

        }
    }).catch(error=>{
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
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
async function ObtenerTodosLosProductos(){
  fetch('admin/obtener-todos-productos')
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async ({Productos})=> {
      if(Productos && Productos.length > 0){
        CargarSlider(Productos);
      }
    }).catch( error => {
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
}
async function Carrusel() {
    const pista = document.querySelector(".pista");
    const slides = document.querySelectorAll(".slide");
    const next = document.getElementById("indiceSiguiente");
    const prev = document.getElementById("indiceAnterior");
    let tamaño = slides.length;
    if(tamaño > 1){
        const px = 160;
        let indice = 0;    
        //Crear clones
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        let resta = 2;
        for(let i=0; i<6;i++){
          if(slides[i]){
              const clone = slides[i].cloneNode(true);
              pista.appendChild(clone);
              resta++;
          }
        }
        pista.appendChild(firstClone);
        pista.insertBefore(lastClone, slides[0]);
        let totalSlides = pista.querySelectorAll(".slide").length;
        // Posicion inicial (después del clon)
        pista.style.transform = `translateX(-${px}px)`; 
        indice = 1;
        async function moverCarrusel() {
            pista.style.transition = "transform 0.3s ease-in-out";
            pista.style.transform = `translateX(-${indice * px}px)`;
        }
        next.addEventListener("click", async () => {
          if (indice >= slides.length + 1) return;
          indice++;
          await moverCarrusel();
        });
        prev.addEventListener("click", async () => {
          if (indice <= 0) return;
          indice--;
          await moverCarrusel();
        });
        pista.addEventListener("transitionend", () => {
          if (indice == slides.length+1) {
            pista.style.transition = "none";
            indice = 1;
            pista.style.transform = `translateX(-${px}px)`;
          }
          if (indice == 0) {
            pista.style.transition = "none";
            indice = totalSlides - resta;
            pista.style.transform = `translateX(-${indice * px}px)`;
          }
        });
    }
    SeleccionarMarca();
}
function CargarMarcas(){
    const valorIDCategoria = document.getElementById('valorIDCategoria').value;
    fetch(`admin/obtener-marcas-por-categoria?IDC=${valorIDCategoria}`).then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(({Marcas}) =>{
        if(Marcas){
            contenedorSlider.innerHTML = '';
            const contenedorDeArticuloS = document.createElement('article');
            contenedorSlider.appendChild(contenedorDeArticuloS)
            contenedorDeArticuloS.offsetWidth; 
            contenedorDeArticuloS.classList.add('pista');
            for(let i = 0; i< Marcas.length; i++){
                const articulo = document.createElement('div');
                articulo.classList.add('slide');
                articulo.dataset.id = Marcas[i].ID;
                articulo.innerHTML += `<p class="p-funcionales" data-id="${Marcas[i].ID}">${Marcas[i].Marca}</p>`;
                contenedorDeArticuloS.appendChild(articulo)
                articulo.offsetWidth; 
                articulo.classList.add('animar-contenedor-info-producto');
            }
            Carrusel();
        }
    });
}
function ActualizarProductos(){
    AnimacionAviso(true, 0)
    const contenedorProductos = document.getElementById('contenedorProductos');
    const valorIDCategoria = document.getElementById('valorIDCategoria').value;
    const url = new URL(window.location);
    const parametros = new URLSearchParams(url.search);
    parametros.set("categoria", valorIDCategoria);
    parametros.set("limite", 12);
    parametros.set("pagina", 1);
    url.pathname  = 'admin/obtener-productos';
    url.search = parametros.toString();
    fetch(url.toString())
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async ({Productos, Marcas}) => {
      if(Productos){
        contenedorProductos.innerHTML = '';
        AnimacionAviso(false, 0)
        if(Productos.length == 0){
          let html = '<p class="texto-centrado"><strong>No se encontraron productos</strong></p>';
          contenedorProductos.innerHTML = html;
        }
        else{
          for(let i = 0; i < Productos.length; i++){
            const articulo = document.createElement('article');
            articulo.innerHTML = `
              <article class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                <div class="contenedor-informacion-productos">
                  <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                  <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                  <p class="texto-info-producto precio-del-producto punto-suspensivos"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                </div>
              </article>`;
            contenedorProductos.appendChild(articulo)
            articulo.offsetWidth;
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
        }
        VerProducto('todos');
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
    }).catch( error => {
        AnimacionAviso(false, 0)
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
function AnimacionAviso(estado, pos){
  const index = parseInt(pos, 10); 
  const animacionDeCarga = document.querySelectorAll('.contenedor-espiral');
  if(estado){
    animacionDeCarga[index].style.display = 'flex';
  }else{
    animacionDeCarga[index].style.display = 'none';
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
    if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){
      let html = '<p class="texto-centrado"><strong>No se encontraron categorias cargadas</strong></p>';
      contenedorProductos.innerHTML = html;
    }else{
      for(let i = 0; i < Categorias.length; i++){
      const articulo = document.createElement('article');
        articulo.innerHTML = `
        <article class="contenedor-categoria contenedor-categoria-funcional" data-id=${Categorias[i].ID}>
          <img class="imagen-categoria" src="${URLMadre}/Imagenes/${Categorias[i].Imagen}">
          <div class="filtro-categoria"></div>
          <h3 class="titulo-categoria">${Categorias[i].Categoria}</h3>
        </article> `;
        contenedorDeLasCategorias.appendChild(articulo);
        articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
        articulo.classList.add('animar-contenedor-info-producto');
        await Esperar(50);
      }
      AgregarFuncionesACategorias();
    }
  })
}
function AgregarFuncionesACategorias(){
  const categorias = document.querySelectorAll('.contenedor-categoria-funcional');
  for(let i = 0; i<categorias.length; i++){
    categorias[i].addEventListener('click', function(){
      window.location.href = `${URLMadre}/categoria-seleccionada?IDC=${categorias[i].dataset.id}#tituloCategoria`
    });
  }
}
function SeleccionarMarca(){
    const marcas = document.querySelectorAll('.p-funcionales');
    const formularioFiltro = document.getElementById('formularioFiltro');
    let marcaActual;
    for(let i = 0; i < marcas.length; i++){
        marcas[i].addEventListener('click',function(){
          const entracaOcultaMarca = document.getElementById('entracaOcultaMarca');
          if(marcaActual != marcas[i].dataset.id){
              marcaActual = marcas[i].dataset.id;
              entracaOcultaMarca.value = marcas[i].innerText;
              marcas[i].style = 'font-weight: 600;'
              for(let j = 0; j < marcas.length; j++){
                  if(j != i){
                      marcas[j].style = 'font-weight: 400;'
                  }
                  if(marcas[j].innerText == marcas[i].innerText){
                      marcas[j].style = 'font-weight: 600;'
                  }
              }
          }else{
              marcaActual = null;
              entracaOcultaMarca.value = '';
              marcas[i].style = 'font-weight: 400;'
              for(let j = 0; j < marcas.length; j++){
                  if(marcas[j].innerText == marcas[i].innerText){
                      marcas[j].style = 'font-weight: 400;'
                  }
              }
          }
          formularioFiltro.requestSubmit();
        });
    }
}
function BuscarProductos(){
  const formularioFiltro = document.getElementById('formularioFiltro');
  let estadoConsulta = true;
  const contenedorProductos = document.getElementById('contenedorProductos');
  formularioFiltro.addEventListener('submit', function(event){
    event.preventDefault();
    if(estadoConsulta){
      estadoConsulta = false;
      contenedorProductos.innerHTML = '';
      AnimacionAviso(true, 0)
      const datosDelFormulario = new FormData(this);
      const datos = {};
      datosDelFormulario.forEach((valor,campo)=>{
        datos[campo] = valor;
      });
      let precioMin = document.getElementById('min').innerText.replace('$','');
      let precioMax = document.getElementById('max').innerText.replace('$','');
      const numeroDePagina = document.getElementById('numeroDePagina');
      const url = new URL(window.location);
      const parametros = new URLSearchParams(url.search);
      parametros.set("precioMin", precioMin);
      parametros.set("precioMax", precioMax);
      parametros.set("busqueda", datos['busqueda']);
      parametros.set("marca", datos['marca']);
      parametros.set("limite", 12);
      parametros.set("categoria", datos['categoria']);
      parametros.set("pagina", 1);
      url.pathname  = 'admin/obtener-productos';
      url.search = parametros.toString();
      fetch(url.toString())
      .then(respuesta =>{
        if(!respuesta.ok)
          throw new Error('Error en la solicitud'); 
        return respuesta.json();    
      }).then(async ({Productos, Marcas}) => {
        if(Productos){
          AnimacionAviso(false, 0)
          numeroDePagina.innerText = 1;
          if(Productos.length == 0){
            let html = '<p class="texto-centrado"><strong>No se encontraron productos</strong></p>';
            contenedorProductos.innerHTML = html;
            estadoConsulta = true;
          }
          else{
            for(let i = 0; i < Productos.length; i++){
              const articulo = document.createElement('article');
              articulo.innerHTML = `
                <article class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                  <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                  <div class="contenedor-informacion-productos">
                    <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                    <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${Marcas[Productos[i].IDMarca-1].Marca}</p>
                    <p class="texto-info-producto precio-del-producto punto-suspensivos"><strong>Precio:</strong>${ConseguirFormatoDelPrecioOriginal(Productos[i].Precio)}</p>
                  </div>
                </article>`;
              contenedorProductos.appendChild(articulo)
              articulo.offsetWidth;
              articulo.classList.add('animar-contenedor-info-producto');
              await Esperar(50);
            }
            VerProducto('todos');
            estadoConsulta = true;
          }
        }else{
          throw new Error('Error en la solicitud')
        }
      }).catch( error => {
          AnimacionAviso(false, 0)
          console.error(error);
          estadoConsulta = true;
          window.location.href = `${URLMadre}/error?mensaje=${error}`;
      });
    }
  })
  const imagenLupa =document.getElementById('imagenLupa');
  imagenLupa.addEventListener('click', function(){
      formularioFiltro.requestSubmit();
  })
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
        const paginaLimite = document.getElementById('paginaLimite');
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
              <article class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
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
        VerProducto('todos');
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
  const indiceSiguiente = document.getElementById('indiceSiguientePagina');
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
  const indiceAnterior = document.getElementById('indiceAnteriorPagina');
  indiceAnterior.addEventListener('click', function(){
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    let numeroAnterior = numeroDePagina - 1;
    if(numeroAnterior <= 0)
      numeroAnterior 
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroAnterior;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePagina, contenedor);
  });
}
function ObtenerURLConParametros(){
  let precioMin = document.getElementById('min').innerText.replace('$','');
  let precioMax = document.getElementById('max').innerText.replace('$','');
  const entradaCategoriaProductos = document.getElementById('valorIDCategoria').value;;
  const entradaMarcaProductos = document.getElementById('entracaOcultaMarca').value;
  const entradaValorBusqueda = document.getElementById('entradaValorBusqueda').value;
  const numeroDePagina = document.getElementById('entradaPagina').value;
  const url = new URL(window.location);
  const parametros = new URLSearchParams(url.search);
  parametros.set("precioMin", precioMin);
  parametros.set("precioMax", precioMax);
  parametros.set("busqueda", entradaValorBusqueda);
  parametros.set("marca", entradaMarcaProductos);
  parametros.set("limite", 12);
  parametros.set("categoria", entradaCategoriaProductos);
  parametros.set("pagina", numeroDePagina);
  
  url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
  url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
  return url;
}
function VerProducto(clase){
  const contenedores = document.querySelectorAll(`.ver-producto-${clase}`);
  for(let i = 0; i < contenedores.length; i++){
    contenedores[i].addEventListener('click', function(){
        window.location.href = `${URLMadre}/ver-producto?IDP=${contenedores[i].dataset.id}`;
    });
  }
}