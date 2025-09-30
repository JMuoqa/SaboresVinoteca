document.addEventListener('DOMContentLoaded', function(){
    ActualizarSeccionCategorias();
    ObtenerProductoPorID();
    CambiarPaginas();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function ActualizarSeccionCategorias() {
  const contenedorDeLasCategorias = document.getElementById('contenedorDeLasCategorias');
  AnimacionAviso(true, 2);
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
        articulo.offsetWidth;
        articulo.classList.add('animar-contenedor-info-producto');
        await Esperar(50);
      }
      AnimacionAviso(false, 2);
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
function ObtenerProductoPorID(){
    const entradaValorID = document.getElementById('entradaValorID')
    AnimacionAviso(true, 0)
    AnimacionAviso(true, 1)
    const url = new URL(window.location);
    const parametros = new URLSearchParams(url.search);
    parametros.set("ID", entradaValorID.value);
    url.pathname  = 'admin/obtener-producto-por-ID';
    url.search = parametros.toString();
    fetch(url.toString())
    .then(respuesta => {
      if(!respuesta.ok)
        throw new Error('Error en la solicitud');
      return respuesta.json();
    }).then(({estado, Producto, Marcas, Categorias, mensaje})=>{
        for(let i = 0; i<Categorias.length; i++){
            if(Producto[0].IDCategoria == Categorias[i].ID){
                ActualizarProductos(Categorias[i].ID);
                break;
            }
        }
      if(estado && Producto){
        CargarProducto(Producto, Marcas, Categorias);
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
}
function CargarProducto(Producto, Marcas, Categorias){
    const tituloProducto = document.getElementById('tituloProducto');
    const imagenProducto = document.getElementById('imagenProducto');
    const categoriaProducto = document.getElementById('categoriaProducto');
    const marcaProducto = document.getElementById('marcaProducto');
    const precioProducto = document.getElementById('precioProducto');
    const entradaValorIDCategoria = document.getElementById('entradaValorIDCategoria');
    AnimacionAviso(false, 0)
    tituloProducto.innerText = Producto[0].Producto;
    imagenProducto.src = `${URLMadre}/Imagenes/${Producto[0].Imagen}`;
    for(let i = 0; i < Categorias.length; i++){
        if(Categorias[i].ID == Producto[0].IDCategoria){
            categoriaProducto.innerHTML = `<strong>Categoria: </strong>${Categorias[i].Categoria}`;
            entradaValorIDCategoria.value = Categorias[i].ID;
            break;
        }
    }
    for(let i = 0; i < Marcas.length; i++){
        if(Marcas[i].ID == Producto[0].IDMarca){
            marcaProducto.innerHTML = `<strong>Marca: </strong>${Marcas[i].Marca}`;
            break;
        }
    }
    const precio = ConseguirFormatoDelPrecioOriginal(Producto[0].Precio);
    if(precio < 1){
      precioProducto.innerHTML = `<strong>Precio: </strong>Sin especificar`;
    }else{
      precioProducto.innerHTML = `<strong>Precio: </strong>${precio}`;
    }
}
function ConseguirFormatoDelPrecioOriginal(precio){
    let precioFinal = Math.round(precio);
    if(precioFinal<1)
      return 0;
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
function ActualizarProductos(valorIDCategoria){
    const contenedorProductos = document.getElementById('contenedorProductos');
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
        AnimacionAviso(false, 1)
        if(Productos.length == 0){
          let html = '<p class="texto-centrado"><strong>No se encontraron productos</strong></p>';
          contenedorProductos.innerHTML = html;
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
                  <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                  <div class="contenedor-informacion-productos">
                    <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                    <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                  </div>
                </div>`;
            }else{
              articulo.innerHTML = `
                <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                  <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
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
        }
        VerProducto('todos');
      }else{
        throw new Error('Hubo un error en la cosulta')
      }
    }).catch( error => {
        AnimacionAviso(false, 1)
        console.error(error);
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
}
function FetchCambiarPagina(nPagina, url, etiqueta, contenedor, avisoPaginaLimite, animacion){
  fetch(url)
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async respuesta => {
    console.log(animacion)
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
                  <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
                  <div class="contenedor-informacion-productos">
                    <p class="texto-info-producto nombre-del-producto punto-suspensivos"><strong>${Productos[i].Producto}</strong></p>
                    <p class="texto-info-producto marca-del-producto punto-suspensivos"><strong>Marca:</strong>${marcaDelProducto}</p>
                  </div>
                </div>`;
            }else{
              articulo.innerHTML = `
                <div class="contenedor-info-producto ver-producto-todos" data-id="${Productos[i].ID}">
                  <img class="imagen-del-producto" src="${URLMadre}/Imagenes/${Productos[i].Imagen}" loading="lazy" alt="Imagen de ${Productos[i].Producto}">
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
  const indiceSiguiente = document.getElementById('indiceSiguiente');
  indiceSiguiente.addEventListener('click', function(){
    AnimacionAviso(true, 1);
    const etiquetaNumeroDePagina = document.getElementById('numeroDePagina');
    const numeroDePagina = Number(etiquetaNumeroDePagina.innerText);
    const numeroSiguiente = numeroDePagina + 1;
    const entradaNumeroDePagina = document.getElementById('entradaPagina');
    entradaNumeroDePagina.value = numeroSiguiente;
    const url = ObtenerURLConParametros();
    const contenedor = document.getElementById('contenedorProductos');
    const paginaLimite = document.getElementById('paginaLimite');
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 1);
    const aUrl = new URL(window.location);
    aUrl.hash = 'seccionProductos'
    window.location.href = aUrl.toString();
  });
  const indiceAnterior = document.getElementById('indiceAnterior');
  indiceAnterior.addEventListener('click', function(){
    AnimacionAviso(true, 1);
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
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 1);
    const aUrl = new URL(window.location);
    aUrl.hash = 'seccionProductos'
    window.location.href = aUrl.toString();
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
function ObtenerURLConParametros(){
  const numeroDePagina = document.getElementById('entradaPagina').value;
  const entradaValorIDCategoria = document.getElementById('entradaValorIDCategoria').value;
  const url = new URL(window.location);
  const parametros = new URLSearchParams(url.search);
  parametros.set("categoria", entradaValorIDCategoria);
  parametros.set("pagina", numeroDePagina);
  parametros.set('limite', 12)
  url.pathname  = 'admin/obtener-productos';// A la ruta raiz le añadis donde hacer al consulta
  url.search = parametros.toString();// Añadis los parametros convirtiendolos a texto
  return url;
}