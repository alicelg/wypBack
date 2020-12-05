/* Funciones de las acciones sobre la tabla de comentarios  */

/* GET */

/* recuperar todos los conceptos */
const getAllConcepts = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM concepts', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}


module.exports = {
    getAllConcepts
}