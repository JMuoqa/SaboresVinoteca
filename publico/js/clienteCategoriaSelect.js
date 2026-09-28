document.addEventListener('DOMContentLoaded', function(){
    CargarMarcas();
    ObtenerCategoriaPorID();
    ActualizarSeccionCategorias();
    BuscarProductos();
    CambiarPaginas();
    ObtenerTodosLosProductos();
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
    start: [precioMin, precioMax],  // valores iniciales
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
function CargarMarcas(){
    const valorIDCategoria = document.getElementById('valorIDCategoria').value;
    fetch(`admin/obtener-marcas-por-categoria?IDC=${valorIDCategoria}`).then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(({Marcas}) =>{
        if(Marcas){
            const seccionMostrarMarcas = document.getElementById('seccionMostrarMarcas')
            seccionMostrarMarcas.innerHTML = '';
            for(let i = 0; i< Marcas.length; i++){
                seccionMostrarMarcas.innerHTML += `<p class="p-funcionales" data-id="${Marcas[i].ID}">${Marcas[i].Marca}</p>`;
            }
            SeleccionarMarca();
        }
    });
}
function ConseguirFormatoDelPrecioOriginal(precio){
    let precioFinal = Math.round(precio);
    if(precioFinal<1)
      return 0
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
          <img class="imagen-categoria" src="https://saboresvinoteca.com/Imagenes/${Categorias[i].Imagen}" loading="lazy" alt="${Categorias[i].Categoria}">
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
    let estadoConsulta = true;
    let marcaActual;
    for(let i = 0; i < marcas.length; i++){
        marcas[i].addEventListener('click',function(){
          if(estadoConsulta){
            estadoConsulta = false;
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
                entracaOcultaMarca.value = 'Ninguna';
                marcas[i].style = 'font-weight: 400;'
                for(let j = 0; j < marcas.length; j++){
                    if(marcas[j].innerText == marcas[i].innerText){
                        marcas[j].style = 'font-weight: 400;'
                    }
                }
            }
            estadoConsulta = true;
            formularioFiltro.requestSubmit();
            const url = new URL(window.location);
            url.hash = 'seccion-productos';
            window.location.href = url.toString();
          }
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
              let marcaDelProducto ;
              for(let j = 0; j<Marcas.length; j++){
                if(Marcas[j].ID == Productos[i].IDMarca){
                  marcaDelProducto = Marcas[j].Marca;
                  break;
                }
              }
              const precio = ConseguirFormatoDelPrecioOriginal(Productos[i].Precio);
              const articulo = document.createElement('article');
              if(precio < 1){
                articulo.innerHTML = `
                  <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                    <img class="imagen-del-producto" src="https://saboresvinoteca.com/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="${Productos[i].Producto}">
                    <div class="contenedor-informacion-productos">
                      <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                      <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                    </div>
                  </div>`;
              }else{
                articulo.innerHTML = `
                  <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                    <img class="imagen-del-producto" src="https://saboresvinoteca.com/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="${Productos[i].Producto}">
                    <div class="contenedor-informacion-productos">
                      <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                      <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                      <p class="texto-info-producto precio-del-producto punto-suspensivos"><strong>Precio:</strong>${precio}</p>
                    </div>
                  </div>`;
              }
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
              let marcaDelProducto ;
              for(let j = 0; j<Marcas.length; j++){
                if(Marcas[j].ID == Productos[i].IDMarca){
                  marcaDelProducto = Marcas[j].Marca;
                  break;
                }
              }
              const precio = ConseguirFormatoDelPrecioOriginal(Productos[i].Precio);
              const articulo = document.createElement('article');
              if(precio < 1){
                articulo.innerHTML = `
                  <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                    <img class="imagen-del-producto" src="https://saboresvinoteca.com/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="${Productos[i].Producto}">
                    <div class="contenedor-informacion-productos">
                      <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                      <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                    </div>
                  </div>`;
              }else{
                articulo.innerHTML = `
                  <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                    <img class="imagen-del-producto" src="https://saboresvinoteca.com/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="${Productos[i].Producto}">
                    <div class="contenedor-informacion-productos">
                      <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                      <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                      <p class="texto-info-producto precio-del-producto punto-suspensivos"><strong>Precio:</strong>${precio}</p>
                    </div>
                  </div>`;
              }
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
function VerProducto(clase){
  const contenedores = document.querySelectorAll(`.ver-producto-${clase}`);
  for(let i = 0; i < contenedores.length; i++){
    contenedores[i].addEventListener('click', function(){
        window.location.href = `${URLMadre}/ver-producto?IDP=${contenedores[i].dataset.id}`;
    });
  }
}