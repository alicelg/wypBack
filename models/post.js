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

/* recupero un post por id para poderlo visualizar en detalle en front*/
const getPostById = (pPostId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts WHERE id = ?', [pPostId], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows[0]);
        });
    });
};

module.exports = {
    getAllPosts, getPostById
}