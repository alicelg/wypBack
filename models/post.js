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
        db.query('INSERT INTO posts(title, main_image, category, keywords, text, summary, date, user_id, type) values(?,?,?,?,?,?,?,?,1)', [title, main_image, category, keywords, text, summary, new Date(), userId, type = 1], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

/* añado post favoritos del usuario */
const insertFavorite = (pUserId, pPostId) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO user_post (user_id, post_id) VALUES (?,?)', [pUserId, pPostId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

/* los post favoritos de usuario */
const getPostByUser = (pUserId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_post INNER JOIN posts ON user_post.post_id = posts.id WHERE user_post.user_id = ?', [pUserId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

/* elimino el post de mis favoritos */
const deleteFavorite = (pUserId, pPostId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user_post WHERE user_id = ? AND post_id = ?', [pUserId, pPostId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

/* Crear un comentario */
const createComment = (pUserId, pText, pPostId) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO comments(user_id, text, post_id) VALUES(?,?,?)', [pUserId, pText, pPostId], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

// Obtener comentarios por postId
const getCommentsByPostId = (pPostId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT json_object('id',comments.id ,'text', comments.text,'user',(SELECT json_object('id',id,'nickname',nickname, 'photo',photo) FROM users WHERE id = comments.user_id)) FROM comments WHERE comments.post_id = ?", [pPostId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

module.exports = {
    getAllPosts, getPostById, getPostByTitleType, getPostsByCategory, createPost, insertFavorite, getPostByUser, deleteFavorite, createComment, getCommentsByPostId
}