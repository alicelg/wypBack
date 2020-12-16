/* Funciones sobre el post   */

/* GET */

/* recuperar todos los conceptos */
const getAllPosts = (pType) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts where type = ?', [pType], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
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
        const query = db.query("SELECT * FROM posts WHERE posts.title LIKE ? AND posts.type = ? AND posts.delete= 0", ['%' + pTitle + '%', pType], (error, rows) => {
            if (error) { console.log(error); reject(error) };
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};

/* recupero un post por id para poderlo visualizar en detalle en front*/
const getPostsByCategory = (pCategory, pType) => {
    return new Promise((resolve, reject) => {
        if (pCategory == 'todos') {
            db.query('SELECT * FROM posts where type = ?', [pType], (error, rows) => {
                if (error) reject(error);
                if (rows.length === 0) resolve(null);
                resolve(rows);
            });
        } else {
            db.query('SELECT * FROM posts WHERE category = ? AND type = ?', [pCategory, pType], (error, rows) => {
                if (error) reject(error);
                if (rows.length === 0) resolve(null);
                resolve(rows);
            });
        }
    });
};

/* crear un post*/
const createPost = (userId, { title, main_image, category, keywords, text, summary, type }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO posts(title, main_image, category, keywords, text, summary, date, user_id, type) values(?,?,?,?,?,?,?,?,?)', [title, main_image, category, keywords, text, summary, new Date(), userId, type], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

module.exports = {
    getAllPosts, getPostById, getPostByTitleType, getPostsByCategory, createPost
}