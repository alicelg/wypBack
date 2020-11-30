
/* Función para recuperar todos los POSTS DEL BLOG */
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
};

/* Función para crear un POST para el BLOG */
const create = ({ title, main_image, category, keywords, date, text, user_id }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO posts(title, main_image, category, keywords, date, text, user_id) values (?,?,?,?,?,?,?)', [title, main_image, category, keywords, date, text, user_id], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

/* Función para recuperar todos los COMENTARIOS de los POSTS del BLOG */
const getAllComments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM comments', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
};

/* Función crear un COMENTARIO para un POST del Blog */
const createComment = ({ title, text, user_id, post_id }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO comments(title, text, user_id, post_id) values (?,?,?,?)', [title, text, user_id, post_id], (error, result) => {
            if (error) reject(error);
            resolve(result)
        });
    });
};



module.exports = {
    getAll, create, getAllComments, createComment
}