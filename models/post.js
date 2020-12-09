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

// busqueda de post por nombre y blog
const getPostByTitleType = (pTitle, pType) => {
    return new Promise((resolve, reject) => {
        const query = db.query('SELECT id,title FROM posts WHERE posts.title = ? AND posts.type = ? AND posts.delete= 0', [pTitle, pType], (error, rows) => {
            if (error) { console.log(error); reject(error) };
            if (rows.length === 0) resolve(null);
            resolve(rows[0]);
        });
        console.log(query.sql)
    });
};

module.exports = {
    getAllPosts, getPostById, getPostByTitleType
}