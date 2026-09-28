import { Conexion, CerrarConexion } from "../../modelos/conexionSaboresVinoteca.mjs";

async function Con_InsertarMarca(marca, IDCategoria) {
    const con = await Conexion();
    try{
        const comprobarExistencia = 'SELECT Marca FROM Marcas WHERE Marca = ? AND IDCategoria = ?';
        const valor = [marca, IDCategoria]
        const marcas = await con.execute(comprobarExistencia,valor);
        if(marcas[0].length > 0)
            throw new Error('Esa marca ya existe con esa categoria');
        const insertarMarca = 'INSERT INTO Marcas (Marca, IDCategoria, Mostrar) VALUES(?, ?, \'si\')';
        await con.query(insertarMarca, valor, (error, resultado)=>{
            if (error) {
                throw new Error('Error al cargar la marca: ', error)
            }
        });
        return { estado: true, mensaje: 'Se agrego correctamente' };
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `No se pudo agregar correctamente. \t ${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_InsertarCategoria(nombre, imagen) {
    const con = await Conexion();
    try{
        
        const comprobarExistencia = 'SELECT Categoria FROM Categorias WHERE Categoria = ?';
        const valorEx = [nombre]
        const categorias = await con.execute(comprobarExistencia,valorEx);
        if(categorias[0].length > 0)
            throw new Error('Esa categoria ya existe');
        const insertarCategoria = 'INSERT INTO Categorias (Categoria, Imagen, Mostrar) VALUES( ?, ?, \'si\');'
        const valores = [nombre, imagen];
        await con.query(insertarCategoria, valores, (error, resultado)=>{
            if (error) {
                throw new Error('Error al cargar la categoria: ', error)
            }
        });
        return { estado: true, mensaje: 'Se agrego correctamente' };
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `No se pudo agregar correctamente. \t ${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_InsertarProducto(nombre, categoria, marca, precio, esImportado, imagen) {
    const con = await Conexion();
    try{
        const insertarProducto = 'INSERT INTO Productos (Producto, Imagen, Importado, IDCategoria, IDMarca, Precio, Mostrar) VALUES( ?, ?, ?, ?, ?, ?, \'si\');'
        const valores = [nombre, imagen, esImportado, categoria, marca, precio];
        await con.query(insertarProducto, valores, (error, resultado)=>{
            if (error) {
                throw new Error('Error al cargar el producto: ', error)
            }
        });
        return { estado: true, mensaje: 'Se agrego correctamente' };
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `No se pudo agregar correctamente. \t ${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ComprobarProducto(nombre, idmarca, idcategoria) {
    const con = await Conexion();
    try{
        const comprobarProducto = 'SELECT Producto FROM Productos WHERE Producto = ? AND IDCategoria = ? AND IDMarca = ?;';
        const valores = [nombre, idcategoria, idmarca];
        const producto = await con.execute(comprobarProducto, valores);
        if(producto[0].length > 0)
            throw new Error('Ese producto ya existe');
        return {estado:true};
    } catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`};
    }finally {
        await CerrarConexion(con);
    }
}
async function Con_ObtenerMarcas() {
    const con = await Conexion();
    try{
        const obtenerMarcas = 'SELECT * FROM Marcas WHERE Mostrar = \'si\' ORDER BY ID ASC;';
        const marcas = await con.execute(obtenerMarcas);
        if(marcas[0].length == 0)
            return {estado: false, mensaje: 'No hay categorias cargadas'};
        return {estado: true, mensaje: 'exitoso', Marcas: marcas[0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerMarcasPorCategoria(categoria) {
    const con = await Conexion();
    try{
        const obtenerMarcas = 'SELECT * FROM Marcas WHERE IDCategoria = ? AND Mostrar = \'si\' ORDER BY ID ASC;';
        const valor = [categoria];
        const marcas = await con.execute(obtenerMarcas, valor);
        if(marcas[0].length == 0)
            return {estado: false, mensaje: 'No hay categorias cargadas'};
        return {estado: true, mensaje: 'exitoso', Marcas: marcas[0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerProductosConFiltros(categoria, marca, precioMin, precioMax, busqueda, importado, desde, limite) {
    const con = await Conexion();
    try{
        const _limite = limite; 
        const offset = desde ?? 0;    
        if (!Number.isInteger(limite) || !Number.isInteger(offset) || limite < 0 || offset < 0) {
            throw new Error("LIMIT y OFFSET deben ser enteros >= 0");
        }
        const productoBuscado = busqueda ? `%${busqueda}%` : null;
        const obtenerProductos = `SELECT * FROM Productos WHERE Mostrar = \'si\' AND (Producto LIKE ? OR ? IS NULL) AND (Importado = ? OR ? IS NULL) AND (IDCategoria = ? OR ? IS NULL) AND (IDMarca = ? OR ? IS NULL) AND (Precio >= ? OR ? IS NULL) AND (Precio <= ? OR ? IS NULL) LIMIT ${_limite} OFFSET ${offset};`;
        const valores = [
           productoBuscado, productoBuscado,
            importado, importado,
            categoria, categoria,
            marca, marca,
            precioMin, precioMin,
            precioMax, precioMax,
        ];
        const productos = await con.execute(obtenerProductos, valores);
        return { estado: true, mensaje: 'exitoso', Productos: productos[0]}
    }catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`, Productos:[]};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerTodosProductos() {
    const con = await Conexion();
    try{
        const obtenerProductos = `SELECT * FROM Productos WHERE Mostrar = \'si\';`;
        const productos = await con.execute(obtenerProductos);
        return { estado: true, mensaje: 'exitoso', Productos: productos[0]}
    }catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`, Productos:[]};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerProductoPorID(ID) {
    const con = await Conexion();
    try{
        const obtenerProductos = `SELECT * FROM Productos WHERE ID = ? AND Mostrar = \'si\';`;
        const valor = [ID];
        const productos = await con.execute(obtenerProductos, valor);
        return { estado: true, mensaje: 'exitoso', Productos: productos[0]}
    }catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`, Productos:[]};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerCategorias() {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT * FROM Categorias WHERE Mostrar = \'si\' ORDER BY ID ASC;';
        const categorias = await con.execute(obtenerCategorias);
        if(categorias[0].length == 0)
            return {estado: false, mensaje: 'No hay categorias cargadas'};
        return {estado: true, mensaje: 'exitoso', Categorias: categorias[0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerCategoriaPorID(ID) {
    const con = await Conexion();
    try{
        const obtenerCategoria = 'SELECT * FROM Categorias WHERE ID = ? AND Mostrar = \'si\';';
        const valor = [ID];
        const categoria = await con.execute(obtenerCategoria, valor);
        return { estado: true, mensaje: 'exitoso', Categoria: categoria[0]}
    }catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`, Categoria:[]};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerMarcaPorID(ID) {
    const con = await Conexion();
    try{
        const obtenerMarca = 'SELECT * FROM Marcas WHERE ID = ? AND Mostrar = \'si\'';
        const valor = [ID];
        const marca = await con.execute(obtenerMarca, valor);
        return { estado: true, mensaje: 'exitoso', Marca: marca[0]};
    }catch(error){
        console.error(error);
        return {estado: false, mensaje: `${error}`, Marca:[]};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerIDDeCategoria(_categoria) {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT ID FROM Categorias WHERE Categoria = ? AND Mostrar = \'si\';';
        const valor = [_categoria];
        let [categoria] = await con.execute(obtenerCategorias,valor);
        if(categoria.length == 0)
            return {estado: false, mensaje: 'No se encontro ninguna categoria'};
        return {estado: true, mensaje: 'exitoso', Categoria: categoria[0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerIDDeMarca(_marca, IDCategoria) {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT ID FROM Marcas WHERE Marca = ? AND IDCategoria = ? AND Mostrar = \'si\';';
        const valor = [_marca, IDCategoria];
        const marca = await con.execute(obtenerCategorias, valor);
        if(marca[0].length == 0)
            return {estado: false, mensaje: 'No se encontro ninguna marca'};
        return {estado: true, mensaje: 'exitoso', Marca: marca[0][0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarDatosPrincipales(nombre, precio, ID) {
    const con = await Conexion();
    try{
        const cambiarDatos = 'UPDATE Productos SET Producto = ?, Precio = ? WHERE ID = ?;';
        const valores = [nombre, precio, ID];
        const res = await con.execute(cambiarDatos, valores);
        if(res[0].affectedRows > 0)
            return {estado: true, mensaje: 'Se guardo con exito'};
        return {estado: false, mensaje: `No se puedo guardar la información`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarDatosCategoricos(categoria, marca, ID) {
    const con = await Conexion();
    try{
        const cambiarDatos = 'UPDATE Productos SET IDCategoria = ?, IDMarca = ? WHERE ID = ?';
        const valores = [categoria, marca, ID];
        const res = await con.execute(cambiarDatos, valores);
        if(res[0].affectedRows > 0)
            return {estado: true, mensaje: 'Se guardo con exito'};
        return {estado: false, mensaje: `No se puedo guardar la información`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarImagenDelProducto(imagen, ID) {
    const con = await Conexion();
    try{
        const cambiarDatos = 'UPDATE Productos SET Imagen = ? WHERE ID = ?';
        const valores = [imagen, ID];
        const res = await con.execute(cambiarDatos, valores);
        if(res[0].affectedRows > 0)
            return {estado: true, mensaje: 'Se guardo con exito'};
        return {estado: false, mensaje: `No se puedo guardar la información`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CabmiarDatosDeUnaCategoria(imagen, categoria, ID) {
    const con = await Conexion();
    try{
        let cambiarDatos;
        let valores;
        if(imagen){
            cambiarDatos = 'UPDATE Categorias SET Imagen = ?, Categoria = ? WHERE ID = ?;';
            valores = [imagen, categoria, ID];
        }
        else{
            cambiarDatos = 'UPDATE Categorias SET Categoria = ? WHERE ID = ?;';
            valores = [categoria, ID];
        }
        const res = await con.execute(cambiarDatos, valores);
        if(res[0].affectedRows > 0)
            return {estado: true, mensaje: 'Se guardo con exito'};
        return {estado: false, mensaje: `No se puedo guardar la información`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarDatosDeUnaMarca(marca, IDCategoria, ID) {
    const con = await Conexion();
    try{
        const cambiarDatos = 'UPDATE Marcas SET Marca = ?, IDCategoria = ? WHERE ID = ?';
        const valores = [marca, IDCategoria, ID];
        const res = await con.execute(cambiarDatos, valores);
        if(res[0].affectedRows > 0)
            return {estado: true, mensaje: 'Se guardo con exito'};
        return {estado: false, mensaje: `No se puedo guardar la información`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarVisibilidadDelProducto(ID) {
    const con = await Conexion();
    try{
        const dejarDeVer = 'UPDATE Productos SET Mostrar = \'no\' WHERE ID = ?;';
        const valor = [ID]
        const res = await con.execute(dejarDeVer, valor);
        if(res[0].affectedRows >0)
            return {estado: true, mensaje: 'Se dejara de mostrar este producto'};
        return {estado: false, mensaje: `No se pudo cambiar la visibilidad del producto`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarVisibilidadDelProductoPorCategoria(cat, con) {
    const dejarDeVer = 'UPDATE Productos SET Mostrar = \'no\' WHERE IDCategoria = ?;';
    const valor = [cat]
    const res = await con.execute(dejarDeVer, valor);
    if(res[0].affectedRows >0)
        return {estado: true, mensaje: 'Se dejara de mostrar este producto'};
    return {estado: false, mensaje: `No se pudo cambiar la visibilidad del producto`};
}
async function Con_CambiarVisibilidadDeMarcaPorCategoria(cat, con) {
    const dejarDeVer = 'UPDATE Marcas SET Mostrar = \'no\' WHERE IDCategoria = ?;';
    const valor = [cat]
    const res = await con.execute(dejarDeVer, valor);
    if(res[0].affectedRows >0)
        return {estado: true, mensaje: 'Se dejara de mostrar marca'};
    return {estado: false, mensaje: `No se pudo cambiar la visibilidad de la marca`};
}
async function Con_CambiarVisibilidadDeCategoria(ID) {
    const con = await Conexion();
    try{
        const dejarDeVer = 'UPDATE Categorias SET Mostrar = \'no\' WHERE ID = ?;';
        const valor = [ID]
        const res = await con.execute(dejarDeVer, valor);
        await Con_CambiarVisibilidadDelProductoPorCategoria(ID, con);
        await Con_CambiarVisibilidadDeMarcaPorCategoria(ID, con);
        if(res[0].affectedRows >0)
            return {estado: true, mensaje: 'Se dejara de mostrar esta categoria'};
        return {estado: false, mensaje: `No se pudo cambiar la visibilidad del producto`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_CambiarVisibilidadDelProductoPorMarca(marca, con) {
    console.log(marca);
    const dejarDeVer = 'UPDATE Productos SET Mostrar = \'no\' WHERE IDMarca = ?;';
    const valor = [marca]
    const res = await con.execute(dejarDeVer, valor);
    console.log(res)
    if(res[0].affectedRows >0)
        return {estado: true, mensaje: 'Se dejara de mostrar este producto'};
    return {estado: false, mensaje: `No se pudo cambiar la visibilidad del producto`};
}
async function Con_CambiarVisibilidadDeMarca(ID) {
    const con = await Conexion();
    try{
        const dejarDeVer = 'UPDATE Marcas SET Mostrar = \'no\' WHERE ID = ?;';
        const valor = [ID]
        const res = await con.execute(dejarDeVer, valor);
        await Con_CambiarVisibilidadDelProductoPorMarca(ID, con);
        if(res[0].affectedRows >0)
            return {estado: true, mensaje: 'Se dejara de mostrar esta marca'};
        return {estado: false, mensaje: `No se pudo cambiar la visibilidad de la marca`};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
export {
    Con_InsertarMarca, Con_ObtenerMarcas, Con_InsertarCategoria ,
    Con_ObtenerCategorias, Con_InsertarProducto, Con_ObtenerIDDeCategoria,
    Con_ObtenerIDDeMarca, Con_ObtenerProductosConFiltros, Con_ObtenerTodosProductos,
    Con_ObtenerProductoPorID, Con_ObtenerMarcasPorCategoria, Con_CambiarDatosPrincipales,
    Con_CambiarDatosCategoricos, Con_CambiarImagenDelProducto, Con_ObtenerCategoriaPorID,
    Con_CabmiarDatosDeUnaCategoria, Con_ObtenerMarcaPorID, Con_CambiarDatosDeUnaMarca,
    Con_ComprobarProducto, Con_CambiarVisibilidadDelProducto, Con_CambiarVisibilidadDeCategoria,
    Con_CambiarVisibilidadDeMarca
}