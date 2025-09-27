document.addEventListener('DOMContentLoaded', function(){
    Registrarse();
});

function Registrarse(){
    const formularioAut = document.getElementById('formularioAut');
    formularioAut.addEventListener('submit', function(event){
        event.preventDefault();
        const datosDelFormulario = new FormData(this);
        const datos = {};
        datosDelFormulario.forEach((valor, campo)=>{
            datos[campo] = valor;
        })
        fetch('aut/cargar-usuario',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }).then(respuesta =>{
            if(!respuesta.ok)
                throw new Error('Error en la solicitud');
            return respuesta.json();
        }).then(({estado, mensaje})=>{
            if(estado == 'exitoso'){
                window.location.href = `${URLMadre}/exito?mensaje=${mensaje}`;
            }else{
                const p = document.getElementById('mensajeAlerta');
                p.style = 'color: #d7596d;';
                p.innerText = mensaje;
                setTimeout(function(){
                    p.innerText = '';
                },5000);
            }
        }).catch( error => {
            console.error(error);
            window.location.href = `${URLMadre}/error?mensaje=${error}`;
        });
    })
}