document.addEventListener('DOMContentLoaded', function(){
    CargarConfiguracionVisual();
    AInstagram();
    AbrirMenus();
    CerrarMenus();
    AgregarLinksCategorias();
    MenuPrincipalAdaptable();
    LinkImportados();
});
async function Esperar(milisegundos) {
  return new Promise(resolver => setTimeout(resolver,milisegundos))
}
function AInstagram(){
    const logoPrincipal = document.getElementById('logoPrincipal');
    logoPrincipal.addEventListener('click', function(){
        window.open('https://www.instagram.com/vinoteca.sabores.arg/', '_blank')
    });
}
function AbrirMenus(){
    //Para que abrir el dialog
    const abrirMenuProductos = document.getElementById('abrirMenuProductos');
    abrirMenuProductos.addEventListener('click', async function(){
        const dialogoPrincipal = document.getElementById('menuDesPrincipal');
        if(dialogoPrincipal.dataset.abierto == 'si'){
          const cerrarMenuPrincipal = document.getElementById('cerrarMenuPrincipal');
          cerrarMenuPrincipal.dispatchEvent(new Event('click'));
          await Esperar(300);
        }
        const dialogo = document.getElementById('menuProductos');
        const menu = document.getElementById('menuHijoProductos');
        menu.classList.remove("oculto");
        dialogo.show();
        void menu.offsetWidth;
        menu.classList.add("activo");
    });
    const iconoMenuPrincipal = document.getElementById('iconoMenuPrincipal');
    iconoMenuPrincipal.addEventListener('click', function(){
        const dialogo = document.getElementById('menuDesPrincipal');
        dialogo.dataset.abierto = 'si';
        const menu = document.getElementById('menuHijoPrincipal');
        menu.classList.remove("oculto");
        dialogo.show();
        void menu.offsetWidth;
        menu.classList.add("activo");
    });
}
function CerrarMenus(){
    const cerrar = document.getElementById('cerrarMenuProductos');
    cerrar.addEventListener('click', function(){
        const dialogo = document.getElementById('menuProductos');
        //cerrarMenu
        const menu = document.getElementById("menuHijoProductos");
        menu.classList.remove("activo");
        // Esperamos a que termine la animación antes de ocultar
        setTimeout(() => {
            menu.classList.add("oculto");
            dialogo.close()
        }, 300); // debe coincidir con el tiempo de `transition`
    });
    const cerrarMenuPrincipal = document.getElementById('cerrarMenuPrincipal');
    cerrarMenuPrincipal.addEventListener('click', function(){
        const dialogo = document.getElementById('menuDesPrincipal');
        dialogo.dataset.abierto = 'no';
        const menu = document.getElementById("menuHijoPrincipal");
        menu.classList.remove("activo");
        setTimeout(() => {
            menu.classList.add("oculto");
            dialogo.close()
        }, 300);
    });
}

function AgregarLinksCategorias(){
  const listaSecundarioCategorias = document.getElementById('listaSecundarioCategorias');
  fetch('admin/obtener-categorias')
  .then(respuesta =>{
    if(!respuesta.ok)
      throw new Error('Error en la solicitud'); 
    return respuesta.json();    
  }).then(async respuesta => {
    const Categorias = respuesta['Categorias'];
    if(Categorias.length == 0 || Categorias[0].Categoria == 'No hay'){
      let html = '<p class="texto-centrado"><strong>No se encontraron categorias cargadas</strong></p>';
      listaSecundarioCategorias.innerHTML = html;
    }else{
        for(let i = 0; i < Categorias.length; i++){
          const li = document.createElement('li');
          li.addEventListener('click', function(){
            window.location.href = `${URLMadre}/categoria-seleccionada?IDC=${Categorias[i].ID}#tituloCategoria`;
          })
          li.classList.add('items-generales');
          li.classList.add('items-secudarios-categorias');
          li.dataset.id = Categorias[i].ID;
          li.innerHTML = `<a class="links-generales links-secundarios-categorias" href="${URLMadre}/categoria-seleccionada?IDC=${Categorias[i].ID}#tituloCategoria">${Categorias[i].Categoria}</a>`;
          listaSecundarioCategorias.appendChild(li);
          li.offsetWidth;
        }
    }
  })
}
function MenuPrincipalAdaptable(){
    window.addEventListener('resize', function () {
        CargarConfiguracionVisual();
    });
}
function CargarConfiguracionVisual(){
    const listaDelNavegador = document.getElementById('listaNav');
    const itemsAdmin = document.querySelectorAll('.items-principales-admin');
    const listaResponsivaAdmin = document.getElementById('listaResponsivaAdmin');
    const listaAdminOriginal = document.getElementById('listaAdmin');
    listaResponsivaAdmin.style.display = 'flex';
    listaDelNavegador.style.display = 'none';
    const ancho = window.innerWidth;
    const contenedorMenu = document.getElementById('contenedorMenu');
    const padreDeListaNavegador = document.getElementById('navegadorPrincipal');
    const tituloMarca = this.document.getElementById('tituloMarca');
    if (ancho <= 1280) {
        if (listaDelNavegador.parentElement !== contenedorMenu) {
            contenedorMenu.appendChild(listaDelNavegador);
            itemsAdmin.forEach(item =>{
              listaResponsivaAdmin.appendChild(item);
            })
        }
        listaDelNavegador.style.display = 'flex';
    } else {
        if (listaDelNavegador.parentElement !== padreDeListaNavegador) {
            padreDeListaNavegador.insertBefore(listaDelNavegador, tituloMarca);
            itemsAdmin.forEach((item, i )=>{
              const icono = document.getElementById(`iconoSeparador${i+1}`);
              listaAdminOriginal.insertBefore(item, icono);
            })
        }
        listaDelNavegador.style.display = 'flex';
    }
}
function LinkImportados(){
  const linkImportados = document.getElementById('linkImportados');
  linkImportados.addEventListener('click', function(){
  const cerrarMenuPrincipal = document.getElementById('cerrarMenuPrincipal');
  const dialogo = document.getElementById('menuDesPrincipal');
    if(dialogo.dataset.abierto == 'si'){
      cerrarMenuPrincipal.dispatchEvent(new Event('click'));
    }
  })
}