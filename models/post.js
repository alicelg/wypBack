/* Funciones sobre el post   */

/* GET */

/* recuperar todos los conceptos */
const getAllPostsByType = (pType) => {
    return new Promise((resolve, reject) => {
        // enganchamos los datos del usuario formateados como objeto
        db.query("SELECT json_object('id',posts.id,'main_image',posts.main_image,'title',posts.title,'keywords',posts.keywords,'category',posts.category, 'summary', posts.summary,'user',(SELECT json_object('id', id, 'nickname', nickname, 'photo', photo) FROM users WHERE id = posts.user_id))FROM posts WHERE posts.type = ? AND posts.delete = 0", [pType], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
}

/* recupero un post por id para poderlo visualizar en detalle en front*/
const getPostById = (pPostId) => {
    return new Promise((resolve, reject) => {
        // enganchamos los datos del usuario formateados como objeto
        db.query("SELECT json_object('id',posts.id,'main_image',posts.main_image,'title',posts.title,'keywords',posts.keywords,'category',posts.category, 'text', posts.text, 'user',(SELECT json_object('id', id, 'nickname', nickname, 'photo', photo) FROM users WHERE id = posts.user_id))FROM posts WHERE posts.id = ? AND posts.delete = 0", [pPostId], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows[0]);
        });
    });
};

// busqueda de post por nombre y blog
const getPostByTitleType = (pTitle, pType) => {
    return new Promise((resolve, reject) => {
        // enganchamos los datos del usuario formateados como objeto
        const query = db.query("SELECT json_object('id',posts.id,'main_image',posts.main_image,'title',posts.title,'keywords',posts.keywords,'category',posts.category, 'summary', posts.summary, 'user',(SELECT json_object('id', id, 'nickname', nickname, 'photo', photo) FROM users WHERE id = posts.user_id))FROM posts WHERE posts.title LIKE ? AND posts.type = ? AND posts.delete = 0", ['%' + pTitle + '%', pType], (error, rows) => {
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
            // enganchamos los datos del usuario formateados como objeto
            db.query("SELECT json_object('id',posts.id,'main_image',posts.main_image,'title',posts.title,'keywords',posts.keywords,'category',posts.category, 'summary', posts.summary, 'user',(SELECT json_object('id', id, 'nickname', nickname, 'photo', photo) FROM users WHERE id = posts.user_id))FROM posts WHERE posts.type = ? AND posts.delete = 0", [pType], (error, rows) => {
                if (error) reject(error);
                if (rows.length === 0) resolve(null);
                resolve(rows);
            });
        } else {
            // enganchamos los datos del usuario formateados como objeto
            db.query("SELECT json_object('id',posts.id,'main_image',posts.main_image,'title',posts.title,'keywords',posts.keywords,'category',posts.category, 'summary', posts.summary, 'user',(SELECT json_object('id', id, 'nickname', nickname, 'photo', photo) FROM users WHERE id = posts.user_id))FROM posts WHERE posts.category = ? AND posts.type = ? AND posts.delete = 0", [pCategory, pType], (error, rows) => {
                if (error) {
                    console.log(error);
                    reject(error)
                };
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
        db.query('SELECT * FROM user_post INNER JOIN posts ON user_post.post_id = posts.id WHERE user_post.user_id = ? AND posts.delete = 0', [pUserId], (error, rows) => {
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

/* elimino un post */
const deletePostById = (postId) => {
    return new Promise((resolve, result) => {
        db.query('UPDATE posts SET posts.delete = 1 WHERE id = ?', [postId], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

/* edito un post */
const updatePostById = ({ id, title, main_image, category, keywords, text, summary }) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE posts SET title = ?, main_image = ?, category = ?, keywords = ?, text = ?, summary = ? WHERE id = ?', [title, main_image, category, keywords, text, summary, id], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

// posts creador por el usuario
const getPostCreatedByUser = (pUserId) => {
    return new Promise((resolve, reject) => {
        // enganchamos los datos del usuario formateados como objeto
        db.query('SELECT id, title FROM wyp_database.posts WHERE user_id = ? AND posts.delete = 0', [pUserId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

module.exports = {
    getAllPostsByType, getPostById, getPostByTitleType, getPostsByCategory, createPost, insertFavorite, getPostByUser, deleteFavorite, createComment, getCommentsByPostId, deletePostById, updatePostById, getPostCreatedByUser
}