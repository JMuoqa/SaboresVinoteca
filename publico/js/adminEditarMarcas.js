document.addEventListener('DOMContentLoaded', function(){
    EditarOtros();
    ActualizarListaCategorias();
    BuscarMarcas();
    GuardarMarca();
    ActivarBoton();
    EliminarDato();
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
function BuscarMarcas(){
    const buscarMarcas = document.getElementById('buscarMarcas');
    let estadoConsulta = true;
    buscarMarcas.addEventListener('submit', function(event){
        event.preventDefault();
        if(estadoConsulta){
            AnimacionAviso(true, 0);
            estadoConsulta = false;
            const seccionMostrarMarcas = document.getElementById('seccionMostrarMarcas')
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
                        AnimacionAviso(false, 0);
                        seccionMostrarMarcas.innerHTML = '';
                        for(let i = 0; i< Marcas.length; i++){
                            seccionMostrarMarcas.innerHTML += `<p class="p-funcionales" data-id="${Marcas[i].ID}">${Marcas[i].Marca}</p>`;
                        }
                        estadoConsulta = true;
                        SeleccionarMarca();
                    }
                })
            }
            AnimacionAviso(false, 0);
            estadoConsulta = true;
        }
    });
}
function SeleccionarMarca(){
    const marcas = document.querySelectorAll('.p-funcionales');
    let estadoConsulta = true;
    let marcaActual;
    for(let i = 0; i < marcas.length; i++){
        marcas[i].addEventListener('click',function(){
          if(estadoConsulta){
            estadoConsulta = false;
            if(marcaActual != marcas[i].dataset.id){
                marcaActual = marcas[i].dataset.id;
                marcas[i].style = 'font-weight: 600;'
                for(let j = 0; j < marcas.length; j++){
                  console.log(j)
                  if(j != i)
                    marcas[j].style = 'font-weight: 400;'
                }
                BusquedaDeLasMarcas(marcas[i]);
            }else{
                marcaActual = null;
                marcas[i].style = 'font-weight: 400;'
                VaciarFormularios();
            }
            estadoConsulta = true;
          }
        });
    }
}
function BusquedaDeLasMarcas(marca){
  const ID = Number(marca.dataset.id);
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
}
function CargarDatos(Marca){
    const entradaCargarMarca = document.getElementById('entradaCargarMarca');
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria');
    const entradaIDMarca = document.getElementById('entradaIDMarca');
    const entradaOcultaIDEliminar = document.getElementById('entradaOcultaIDEliminar');
    entradaCargarMarca.value = Marca[0].Marca;
    seccMarca_EntCategoria.selectedIndex = Marca[0].IDCategoria;
    entradaIDMarca.value = Marca[0].ID;
    entradaOcultaIDEliminar.value = Marca[0].ID;
    
}
function GuardarMarca(){
    const formularioMarca = document.getElementById('formularioMarca');
    let estadoConsulta = true;
    const buscarMarcas = document.getElementById('buscarMarcas');
    formularioMarca.addEventListener('submit', function(event){
        event.preventDefault();
        if(estadoConsulta){
            estadoConsulta = false;
            AnimacionAviso(true, 2)
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
                AnimacionAviso(false, 2)
                const p = document.getElementById('textoEdicionMarca');
                if(estado == 'exitoso')
                  p.style = 'color: #2ea356;';
                else
                  p.style = 'color: #d7596d;';
                p.innerText = mensaje;
                setTimeout(function(){
                    p.innerText = '';
                },5000);
                estadoConsulta = true;
                buscarMarcas.requestSubmit();
            }).catch( error => {
                console.error(error);
                estadoConsulta = true;
                AnimacionAviso(false, 2)
                window.location.href = `${URLMadre}/error?mensaje=${error}`;
            });
        }
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
function ActivarBoton(){
  const entradaSeguridad = document.getElementById('entradaSeguridad');
  entradaSeguridad.checked = false;
  const botonEliminar = document.getElementById('botonEliminar');
  botonEliminar.classList.add('boton-desactivado');
  botonEliminar.disabled = true;
  entradaSeguridad.addEventListener('change', function(){
    if(entradaSeguridad.checked){
      botonEliminar.classList.remove('boton-desactivado')
      botonEliminar.disabled = false;
    }else{
      botonEliminar.classList.add('boton-desactivado');
      botonEliminar.disabled = true;
    }
  });
}
function EliminarDato(){
  const formularioEliminarMarca = document.getElementById('formularioEliminarMarca');
  let estadoConsulta = true;
  const buscarMarcas = document.getElementById('buscarMarcas');
  formularioEliminarMarca.addEventListener('submit', function(event){
    event.preventDefault();
    const entradaSeguridad = document.getElementById('entradaSeguridad');
    if(estadoConsulta){
      AnimacionAviso(true, 1)
      const datosDelFormulario = new FormData(this);
      const datos = {};
      datosDelFormulario.forEach((valor, campo)=>{
        datos[campo] = valor;
      });
      fetch('admin/eliminar-marca', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      }).then(respuesta => {
        if(!respuesta.ok)
          throw new Error('Error en la solicitud')
        return respuesta.json();
      }).then(({estado, mensaje})=>{
        AnimacionAviso(false, 1)
        const p = document.getElementById('textoEditarVisibilidad');
        if(estado == 'exitoso')
          p.style = 'color: #2ea356;';
        else
          p.style = 'color: #d7596d;';
        p.innerText = mensaje;
        setTimeout(function(){
            p.innerText = '';
        },5000);
        estadoConsulta = true;
        buscarMarcas.requestSubmit();
        entradaSeguridad.checked = false;
        entradaSeguridad.dispatchEvent(new Event('change'));
        VaciarFormularios();
      }).catch( error => {
        console.error(error);
        estadoConsulta = true;
        AnimacionAviso(false, 1)
        window.location.href = `${URLMadre}/error?mensaje=${error}`;
      });
    }
  })
}
function VaciarFormularios(){
    const entradaCargarMarca = document.getElementById('entradaCargarMarca');
    const seccMarca_EntCategoria = document.getElementById('seccMarca_EntCategoria');
    const entradaIDMarca = document.getElementById('entradaIDMarca');
    const entradaOcultaIDEliminar = document.getElementById('entradaOcultaIDEliminar');
    entradaCargarMarca.value = '';
    seccMarca_EntCategoria.selectedIndex = '';
    entradaIDMarca.value = '';
    entradaOcultaIDEliminar.value = '';
}