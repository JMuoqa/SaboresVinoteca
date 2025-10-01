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
    FormulariosComplementarios();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function ActualizarProductos() {
    const contenedorProductos = document.getElementById('contenedorProductos');
    AnimacionAviso(true, 1);
    fetch('admin/obtener-productos')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async ({Productos, Marcas}) => {
      AnimacionAviso(false, 1);
      if(Productos){
        contenedorProductos.innerHTML = '';
        if(Productos.length == 0){
          let html = '<p><strong>No se encontraron productos</strong></p>';
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
        AnimacionAviso(false, 1);
        //window.location.href = `${URLMadre}/error?mensaje=${error}`;
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
function ActualizarProductosImportados() {
    const conteendorProductosImportados = document.getElementById('conteendorProductosImportados');
    AnimacionAviso(true, 2);
    fetch('admin/obtener-productos?importado=1')
    .then(respuesta =>{
      if(!respuesta.ok)
        throw new Error('Error en la solicitud'); 
      return respuesta.json();    
    }).then(async respuesta => {
      AnimacionAviso(false, 2);
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
            conteendorProductosImportados.appendChild(articulo)
            // Forzar “reflow” antes de añadir la clase de animación
            articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
            articulo.classList.add('animar-contenedor-info-producto');
            await Esperar(50);
          }
          VerProducto('importados');
        }
      }else{
          let html = '<p><strong>No se encontraron productos</strong></p>';
          conteendorProductosImportados.innerHTML = html;
      }
    }).catch( error => {
        console.error(error);
        AnimacionAviso(false, 2);
        //window.location.href = `${URLMadre}/error?mensaje=${error}`;
    });
}
function ActualizarSeccionCategorias() {
  const contenedorDeLasCategorias = document.getElementById('contenedorDeLasCategorias');
  AnimacionAviso(true, 0);
  fetch('admin/obtener-categorias')
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async respuesta => {
    const Categorias = respuesta['Categorias'];
    AnimacionAviso(false, 0);
    if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){
      let html = '<p class="texto-centrado"><strong>No se encontraron categorias cargadas</strong></p>';
      contenedorDeLasCategorias.innerHTML = html;
    }else{
      for(let i = 0; i < Categorias.length; i++){
        const articulo = document.createElement('article');
        articulo.innerHTML = `
        <article class="contenedor-categoria contenedor-categoria-funcional" loading="lazy" alt="Imagen de ${Categorias[i].Categoria}" data-id=${Categorias[i].ID}>
          <div class="contenedor-categorias-hidden">
            <img class="imagen-categoria" src="${URLMadre}/Imagenes/${Categorias[i].Imagen}">
          </div>
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
  const entradaCategorias = document.getElementById('entradaCategorias')
  entradaCategorias.addEventListener('change', function(){
    const entradaMarcas = document.getElementById('entradaMarcas')
    const categoria = entradaCategorias.value;
    if(categoria != 'Sin filtro'){
      fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
      }).then(({Marcas}) =>{
        entradaMarcas.innerHTML = '<option>Sin filtro</option>';
        for(let i = 0; i < Marcas.length; i++){
          let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
          entradaMarcas.innerHTML += opcionesDeMarcas;
        }
      });
    }else{
      entradaMarcas.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
    }
  });
  const entradaCategoriasImport = document.getElementById('entradaCategoriasImport');
  entradaCategoriasImport.addEventListener('change', function(){
    const categoria = entradaCategoriasImport.value;
    const entradaMarcasImport = document.getElementById('entradaMarcasImport')  
    if(categoria != 'Sin filtro'){
      fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
      }).then(({Marcas}) =>{
        entradaMarcasImport.innerHTML = '<option>Sin filtro</option>';
        for(let i = 0; i < Marcas.length; i++){
          let opcionesDeMarcas = `<option>${Marcas[i].Marca}</option>`;
          entradaMarcasImport.innerHTML += opcionesDeMarcas;
        }
      });
    }else{
      entradaMarcasImport.innerHTML = '<option>Selecciona una categoria para buscar marcas</option>';
    }
  });
}
function BotonBuscarYEventoDelFormulario() {
  const formularioFiltro = document.getElementById('formularioFiltro');
  let estadoConsulta = true;
  formularioFiltro.addEventListener('submit', function(event){
    event.preventDefault();
    if(estadoConsulta){
      estadoConsulta = false;
      const contenedorProductos = document.getElementById('contenedorProductos');
      AnimacionAviso(true, 1);
      contenedorProductos.innerHTML = '';
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
        AnimacionAviso(false, 1);
        if(respuesta['Productos']){
          const Productos = respuesta['Productos'];
          const Marcas = respuesta['Marcas'];
          numeroDePagina.innerText = 1;
          if(Productos.length == 0){
            let html = '<p><strong>No se encontraron productos</strong></p>';
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
              // Forzar “reflow” antes de añadir la clase de animación
              articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
              articulo.classList.add('animar-contenedor-info-producto');
              await Esperar(50);
            }
            estadoConsulta = true;
            VerProducto('todos');
          }
        }else{
            let html = '<p><strong>No se encontraron productos</strong></p>';
            contenedorProductos.innerHTML = html;
            estadoConsulta = true;
        }
      }).catch( error => {
          AnimacionAviso(false, 1);
          estadoConsulta = true;
          console.error(error);
          window.location.href = `${URLMadre}/error?mensaje=${error}`;
      });
    }
  })
  const buscarProductos = document.getElementById('buscarProductos');
  buscarProductos.addEventListener('click', function(){
    const entradaValorBusqueda = document.getElementById('entradaValorBusqueda');
    const entracaOcultaBusqueda = document.getElementById('entracaOcultaBusqueda');
    entracaOcultaBusqueda.value = entradaValorBusqueda.value;
    formularioFiltro.requestSubmit();
  });
  const imagenLupa1 = document.getElementById('imagenLupa1')
  imagenLupa1.addEventListener('click', function(){
    const entradaValorBusqueda = document.getElementById('entradaValorBusqueda');
    const entracaOcultaBusqueda = document.getElementById('entracaOcultaBusqueda');
    entracaOcultaBusqueda.value = entradaValorBusqueda.value;
    formularioFiltro.requestSubmit();
  })
}
function BotonBuscarYEventoDelFormularioImportados(){
  const formularioFiltroImport = document.getElementById('formularioFiltroImport');
  let estadoConsulta = true;
  formularioFiltroImport.addEventListener('submit', function(event){
    event.preventDefault();
    if(estadoConsulta){
      estadoConsulta = false;
      const conteendorProductosImportados = document.getElementById('conteendorProductosImportados');
      AnimacionAviso(true, 2);
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
      console.log(url.toString())
      fetch(url.toString())
      .then(respuesta =>{
        if(!respuesta.ok)
          throw new Error('Error en la solicitud'); 
        return respuesta.json();    
      }).then(async respuesta => {
        AnimacionAviso(false, 2);
        if(respuesta['Productos']){
          const Productos = respuesta['Productos'];
          const Marcas = respuesta['Marcas'];
          conteendorProductosImportados.innerHTML = '';
          numeroDePagina.innerText = 1;
          if(Productos.length == 0){
            let html = '<p><strong>No se encontraron productos</strong></p>';
            conteendorProductosImportados.innerHTML = html;
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
              conteendorProductosImportados.appendChild(articulo)
              // Forzar “reflow” antes de añadir la clase de animación
              articulo.offsetWidth; // esto hace que el navegador registre el elemento recién insertado
              articulo.classList.add('animar-contenedor-info-producto');
              await Esperar(50);
            }
            VerProducto('importados');
            estadoConsulta = true;
          }
        }else{
            let html = '<p><strong>No se encontraron productos</strong></p>';
            contenedorProductos.innerHTML = html;
            estadoConsulta = true;
        }
      }).catch( error => {
          console.error(error);
          estadoConsulta = true;
          AnimacionAviso(false, 2);
          window.location.href = `${URLMadre}/error?mensaje=${error}`;
      });
    }
  })
  const buscarProductosImport = document.getElementById('buscarProductosImport');
  buscarProductosImport.addEventListener('click', function(){
    const entradaValorBusquedaImport = document.getElementById('entradaValorBusquedaImport');
    const entracaOcultaBusquedaImport = document.getElementById('entracaOcultaBusquedaImport');
    entracaOcultaBusquedaImport.value = entradaValorBusquedaImport.value;
    const formularioFiltroImport = document.getElementById('formularioFiltroImport');
    formularioFiltroImport.requestSubmit();
  });
  const imagenLupa2 = document.getElementById('imagenLupa2')
  imagenLupa2.addEventListener('click', function(){
    const entradaValorBusquedaImport = document.getElementById('entradaValorBusquedaImport');
    const entracaOcultaBusquedaImport = document.getElementById('entracaOcultaBusquedaImport');
    entracaOcultaBusquedaImport.value = entradaValorBusquedaImport.value;
    formularioFiltroImport.requestSubmit();
  })
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
function FetchCambiarPagina(nPagina, url, etiqueta, contenedor, avisoPaginaLimite, animacion, clase){
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
        VerProducto(clase)
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
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 1, 'todos');
    const aUrl = new URL(window.location);
    aUrl.hash = 'formComplemetario'
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
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePagina, contenedor, paginaLimite, 1, 'todos');
    const aUrl = new URL(window.location);
    aUrl.hash = 'formComplemetario'
    window.location.href = aUrl.toString();
  });
}
function CambiarPaginasImport(){
  const indiceSiguienteImport = document.getElementById('indiceSiguienteImport');
  indiceSiguienteImport.addEventListener('click', function(){
    AnimacionAviso(true, 2);
    const etiquetaNumeroDePaginaImport = document.getElementById('numeroDePaginaImport');
    const numeroDePagina = Number(etiquetaNumeroDePaginaImport.innerText);
    const numeroSiguiente = numeroDePagina + 1;
    const entradaPaginaImport = document.getElementById('entradaPaginaImport');
    entradaPaginaImport.value = numeroSiguiente;
    const url = ObtenerURLConParametrosImport();
    const contenedor = document.getElementById('conteendorProductosImportados');
    const paginaLimite = document.getElementById('paginaLimiteImport');
    FetchCambiarPagina(numeroSiguiente, url, etiquetaNumeroDePaginaImport, contenedor, paginaLimite, 2, 'importados');
    const aUrl = new URL(window.location);
    aUrl.hash = 'formComplemetarioImport'
    window.location.href = aUrl.toString();
  });
  const indiceAnterior = document.getElementById('indiceAnteriorImport');
  indiceAnterior.addEventListener('click', function(){
    AnimacionAviso(true, 2);
    const etiquetaNumeroDePaginaImport = document.getElementById('numeroDePaginaImport');
    const numeroDePagina = Number(etiquetaNumeroDePaginaImport.innerText);
    let numeroAnterior = numeroDePagina - 1;
    if(numeroAnterior <= 0)
      numeroAnterior 
    const entradaPaginaImport = document.getElementById('entradaPaginaImport');
    entradaPaginaImport.value = numeroAnterior;
    const url = ObtenerURLConParametrosImport();
    const contenedor = document.getElementById('conteendorProductosImportados');
    const paginaLimite = document.getElementById('paginaLimiteImport');
    FetchCambiarPagina(numeroAnterior, url, etiquetaNumeroDePaginaImport, contenedor, paginaLimite, 2, 'importados');
    const aUrl = new URL(window.location);
    aUrl.hash = 'formComplemetarioImport'
    window.location.href = aUrl.toString();
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
    start: [precioMin, precioMax],  // valores iniciales
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
    if(precioFinal < 1)
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
function FormulariosComplementarios(){
  const formComplemetario = document.getElementById('formComplemetario');
  formComplemetario.addEventListener('submit', function(event){
    event.preventDefault();
    const entradaValorBusqueda = document.getElementById('entradaValorBusqueda');
    const entracaOcultaBusqueda = document.getElementById('entracaOcultaBusqueda');
    entracaOcultaBusqueda.value = entradaValorBusqueda.value;
    const formularioFiltro = document.getElementById('formularioFiltro');
    formularioFiltro.dispatchEvent(new Event('submit'));
  })
  
  const formComplemetarioImport = document.getElementById('formComplemetarioImport');
  formComplemetarioImport.addEventListener('submit', function(event){
    event.preventDefault();
    const entradaValorBusquedaImport = document.getElementById('entradaValorBusquedaImport');
    const entracaOcultaBusquedaImport = document.getElementById('entracaOcultaBusquedaImport');
    entracaOcultaBusquedaImport.value = entradaValorBusquedaImport.value;
    const formularioFiltroImport = document.getElementById('formularioFiltroImport');
    formularioFiltroImport.dispatchEvent(new Event('submit'));
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