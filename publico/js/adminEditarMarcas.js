document.addEventListener('DOMContentLoaded', function(){
    EditarOtros();
    ActualizarListaCategorias();
    BuscarMarcas();
    GuardarMarca();
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
    if(slides.length > 6){
        const px = 160;
        let indice = 0;    
        //Crear clones
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
            indice = totalSlides - 7;
            pista.style.transform = `translateX(-${indice * px}px)`;
          }
        });
    }
}
function BuscarMarcas(){
    const buscarMarcas = document.getElementById('buscarMarcas');
    buscarMarcas.addEventListener('submit', function(event){
        event.preventDefault();
        const contenedorSlider = document.getElementById('contenedorSlider')
        const datosDelFormulario = new FormData(this);
        const datos = {};
        datosDelFormulario.forEach((valor, campo)=>{
            datos[campo] = valor;
        });
        const categoria = datos.categoria;
        if(categoria != 'Selecciona una para buscar marcas'){
            fetch(`admin/obtener-marcas-por-categoria?categoria=${categoria}`).then(respuesta => {
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
                        const articulo = document.createElement('article');
                        articulo.classList.add('slide');
                        articulo.dataset.id = Marcas[i].ID;
                        articulo.innerHTML += `<P>${Marcas[i].Marca}</P>`;
                        contenedorDeArticuloS.appendChild(articulo)
                        articulo.offsetWidth; 
                        articulo.classList.add('animar-contenedor-info-producto');
                    }
                    Carrusel();
                    EventosDeLasMarcas();
                }
            })
        }
    });
}
function EventosDeLasMarcas(){
    const items = document.querySelectorAll('.slide');
    for(let i = 0; i<items.length; i++){
        items[i].addEventListener('click', function(){
            const ID = Number(items[i].dataset.id);
            const url = new URL(window.location);
            const parametros = new URLSearchParams(url.search);
            parametros.set("ID", ID);
            url.pathname  = 'admin/obtener-marca-por-ID';
            url.search = parametros.toString();
            fetch(url.toString())
            .then(respuesta => {
                if(!respuesta.ok)
                    throw new Error('Error en la solicitud');
                return respuesta.json()
            }).then(({estado, Marca})=>{
                if(estado=='exitoso'){
                    CargarDatos(Marca);
                }
            }).catch( error => {
                console.error(error);
                window.location.href = `${URLMadre}/error?mensaje=${error}`;
            });
        });
    }
}
function CargarDatos(Marca){
    const entradaCargarMarca = document.getElementById('entradaCargarMarca');
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria');
    const entradaIDMarca = document.getElementById('entradaIDMarca');
    entradaCargarMarca.value = Marca[0].Marca;
    seccMarca_EntCategoria.selectedIndex = Marca[0].IDCategoria;
    entradaIDMarca.value = Marca[0].ID;
}
function GuardarMarca(){
    const formularioMarca = document.getElementById('formularioMarca');
    const buscarMarcas = document.getElementById('buscarMarcas');
    formularioMarca.addEventListener('submit', function(event){
        event.preventDefault();
        AnimacionAviso(true, 0)
        const datosDelFormulario = new FormData(this);
        const datos = {};
        datosDelFormulario.forEach((valor, campo)=>{
            datos[campo]=valor;
        });
        fetch('admin/cambiar-datos-de-marca',{
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
            AnimacionAviso(false, 0)
            const p = document.getElementById('textoEdicionMarca');
            if(estado == 'exitoso')
              p.style = 'color: #2ea356;';
            else
              p.style = 'color: #d7596d;';
            p.innerText = mensaje;
            setTimeout(function(){
                p.innerText = '';
            },5000);
            buscarMarcas.dispatchEvent(new Event('submit'));
        }).catch( error => {
            console.error(error);
            AnimacionAviso(false, 0)
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