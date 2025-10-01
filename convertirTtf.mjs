/* */
import fs from 'fs';
import path from 'path';
import ttf2woff2 from "ttf2woff2";

// 📂 Carpeta donde tenés tus fuentes TTF
const carpetaFuentes = path.resolve("./publico/fuentes");

// Lee todos los archivos de la carpeta
fs.readdirSync(carpetaFuentes).forEach(archivo => {
    console.log('Archivo: '+archivo);
  if (!archivo.endsWith(".woff2")) {
    const rutaTTF = path.join(carpetaFuentes, archivo);
    console.log('Ruta: '+ rutaTTF)
    const bufferTTF = fs.readFileSync(rutaTTF);
    //console.log('BufferTTF: '+ bufferTTF)

    // Convierte a .woff2
    const bufferWOFF2 = ttf2woff2(bufferTTF);
    //console.log('BufferWOFF2: '+ bufferWOFF2)

    // Nuevo nombre con extensión .woff2
    const nombreWOFF2 = archivo.replace(".ttf", ".woff2");
    const rutaWOFF2 = path.join(carpetaFuentes, nombreWOFF2);

    // Guarda el archivo convertido
    fs.writeFileSync(rutaWOFF2, bufferWOFF2);

    console.log(`✅ Convertido: ${archivo} → ${nombreWOFF2}`);
  }
});
console.log('Terminado');
/* */