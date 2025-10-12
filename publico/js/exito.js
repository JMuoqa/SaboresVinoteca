document.addEventListener('DOMContentLoaded', function(){
    Inicio();
    Contacto();
});

function Inicio(){
    const botonIrInicio = document.getElementById('botonIrInicio');
    botonIrInicio.addEventListener('click', function(){
        window.location.href = `${URLMadre}/`;
    });
}
function Contacto(){
    const botonIrContacto = document.getElementById('botonIrContacto');
    botonIrContacto.addEventListener('click', function(){
        window.location.href = `${URLMadre}/contacto`;
    });
}