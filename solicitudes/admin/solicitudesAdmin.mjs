import { Conexion, CerrarConexion } from "../../modelos/conexionSaboresVinoteca.mjs";

async function Con_InsertarMarca(Marca) {
    const con = await Conexion();
    try{
        const comprobarExistencia = 'SELECT Marca FROM Marcas WHERE Marca = ?';
        const valor = [Marca]
        const marcas = await con.execute(comprobarExistencia,valor);
        if(marcas[0].length > 0)
            throw new Error('Esa marca ya existe');
        const insertarMarca = 'INSERT INTO Marcas (Marca) VALUES(?)';
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
        const insertarCategoria = 'INSERT INTO Categorias (Categoria, Imagen) VALUES( ?, ?);'
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
        console.log(categoria);
        const insertarProducto = 'INSERT INTO Productos (Producto, Imagen, Importado, IDCategoria, IDMarca, Precio) VALUES( ?, ?, ?, ?, ?, ?);'
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

async function Con_ObtenerMarcas() {
    const con = await Conexion();
    try{
        const obtenerMarcas = 'SELECT * FROM Marcas ORDER BY ID ASC;';
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
async function Con_ObtenerProductosConFiltros(categoria, marca, precioMin, precioMax, busqueda, importado) {
    const con = await Conexion();
    try{
        const productoBuscado = busqueda ? `%${busqueda}%` : null;
        const obtenerProductos = 'SELECT * FROM Productos WHERE (Producto LIKE ? OR ? IS NULL) AND (Importado = ? OR ? IS NULL) AND (IDCategoria = ? OR ? IS NULL) AND (IDMarca = ? OR ? IS NULL) AND (Precio >= ? OR ? IS NULL) AND (Precio <= ? OR ? IS NULL);';
        const valores = [
           productoBuscado, productoBuscado,
            importado, importado,
            categoria, categoria,
            marca, marca,
            precioMin, precioMin,
            precioMax, precioMax
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

async function Con_ObtenerCategorias() {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT * FROM Categorias ORDER BY ID ASC;';
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
async function Con_ObtenerIDDeCategoria(_categoria) {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT ID FROM Categorias WHERE Categoria = ?;';
        const valor = [_categoria];
        const categoria = await con.execute(obtenerCategorias,valor);
        if(categoria[0].length == 0)
            return {estado: false, mensaje: 'No se encontro ninguna categoria'};
        return {estado: true, mensaje: 'exitoso', Categoria: categoria[0][0]};
    }catch(error){
        console.error(error)
        return {estado: false, mensaje: `${error}`};
    }finally{
        await CerrarConexion(con);
    }
}
async function Con_ObtenerIDDeMarca(_marca) {
    const con = await Conexion();
    try{
        const obtenerCategorias = 'SELECT ID FROM Marcas WHERE Marca = ?;';
        const valor = [_marca];
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
export {
    Con_InsertarMarca, Con_ObtenerMarcas, Con_InsertarCategoria ,
    Con_ObtenerCategorias, Con_InsertarProducto, Con_ObtenerIDDeCategoria,
    Con_ObtenerIDDeMarca, Con_ObtenerProductosConFiltros
}