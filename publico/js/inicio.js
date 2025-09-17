document.addEventListener('DOMContentLoaded', function(){
    CargarSlider();
    CargarSliderImportados();
});
function CargarSlider(){
    const slider = document.getElementById('slider'); 
    noUiSlider.create(slider, {
      start: [2500, 8700000],  // valores iniciales
      connect: true,
      range: {
        'min': 0,
        'max': 300000
      }
    });
    const min = document.getElementById('min');
    const max = document.getElementById('max');
    slider.noUiSlider.on('update', function(values){
      min.textContent = Math.round(values[0]);
      max.textContent = Math.round(values[1]);
    });
};
function CargarSliderImportados(){
    const slider = document.getElementById('slider-import'); 
    noUiSlider.create(slider, {
      start: [2500, 8700000],  // valores iniciales
      connect: true,
      range: {
        'min': 0,
        'max': 300000
      }
    });
    const min = document.getElementById('min-import');
    const max = document.getElementById('max-import');
    slider.noUiSlider.on('update', function(values){
      min.textContent = Math.round(values[0]);
      max.textContent = Math.round(values[1]);
    });
};