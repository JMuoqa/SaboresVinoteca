document.addEventListener('DOMContentLoaded', function(){
    Inicio();
    Importados();
});

function Inicio(){
    const botonIrInicio = document.getElementById('botonIrInicio');
    botonIrInicio.addEventListener('click', function(){
        window.location.href = `${URLMadre}/`;
    });
}
function Importados(){
    const botonIrImportados = document.getElementById('botonIrImportados');
    botonIrImportados.addEventListener('click', function(){
        window.location.href = `${URLMadre}/#importados`;
    });
}