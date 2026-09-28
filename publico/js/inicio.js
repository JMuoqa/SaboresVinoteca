document.addEventListener('DOMContentLoaded', function(){
    ActualizarSeccionCategorias();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
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
function AnimacionAviso(estado, pos){
    const index = parseInt(pos, 10); 
    const animacionDeCarga = document.querySelectorAll('.contenedor-espiral');
    if(estado){
        animacionDeCarga[index].style.display = 'flex';
    }else{
        animacionDeCarga[index].style.display = 'none';
    }
}