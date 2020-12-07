/* Funciones sobre el post   */

/* GET */

/* recuperar todos los conceptos */
const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}


module.exports = {
    getAllPosts
}