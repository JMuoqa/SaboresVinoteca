document.addEventListener('DOMContentLoaded', function(event){
    AInstagram();
});

function AInstagram(){
    const logoPrincipal = document.getElementById('logoPrincipal');
    logoPrincipal.addEventListener('click', function(){
        window.open('https://www.instagram.com/vinoteca.sabores.arg/', '_blank')
    });
}