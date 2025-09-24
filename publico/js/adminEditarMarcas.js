document.addEventListener('DOMContentLoaded', function(){
    EditarOtros();
    ActualizarListaCategorias();
    Carrusel()
});
function EditarOtros(){
    const botonEditarProductos = document.getElementById('botonEditarProductos');
    botonEditarProductos.addEventListener('click', function(){
        window.location.href = `${URLMadre}/editar-productos`;
    });
    const botonEditarCategorias = document.getElementById('botonEditarCategorias');
    botonEditarCategorias.addEventListener('click', function(){
      window.location.href = `${URLMadre}/editar-categorias`;
    });
}
async function ActualizarListaCategorias() {
    const entradaCategoriasBusqueda = document.getElementById('entradaCategoriasBusqueda')
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria')
    fetch('admin/obtener-categorias').then(respuesta => {
        if(!respuesta.ok)
            throw new Error('Error en la solicitud');
        return respuesta.json()
    }).then(respuesta =>{
        const Categorias = respuesta['Categorias'];
        entradaCategoriasBusqueda.innerHTML = '<option>Selecciona una para buscar marcas</option>';
        seccMarca_EntCategoria.innerHTML = '<option>No seleccionada</option>'
        for(let i = 0; i < Categorias.length; i++){
            const opcionesDeCategorias = `<option>${Categorias[i].Categoria}</option>`;
            entradaCategoriasBusqueda.innerHTML += opcionesDeCategorias;
            seccMarca_EntCategoria.innerHTML += opcionesDeCategorias;
        }
        
    })
}
function Carrusel() {
    const pista = document.querySelector(".pista");
    const slides = document.querySelectorAll(".slide");
    const next = document.getElementById("indiceSiguiente");
    const prev = document.getElementById("indiceAnterior");
    let indice = 0;
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    for(let i=0; i<6;i++){
      if(slides[i]){
          const clone = slides[i].cloneNode(true);
          pista.appendChild(clone);
      }
    }
    pista.appendChild(firstClone);
    pista.insertBefore(lastClone, slides[0]);
    let totalSlides = pista.querySelectorAll(".slide").length;
    // Posicion inicial (después del clon)
    pista.style.transform = `translateX(-${140}px)`; 
    indice = 1;
    async function moverCarrusel() {
        pista.style.transition = "transform 0.3s ease-in-out";
        pista.style.transform = `translateX(-${indice * 140}px)`;
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
        pista.style.transform = `translateX(-${140}px)`;
      }
      if (indice == 0) {
        pista.style.transition = "none";
        indice = totalSlides - 7;
        pista.style.transform = `translateX(-${indice * 140}px)`;
      }
    });
}
