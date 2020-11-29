
/* Función para recuperar todos los POSTS DEL BLOG */
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM posts', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
};


module.exports = {
    getAll
}