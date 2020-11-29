
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


module.exports = {
    getAll, create
}