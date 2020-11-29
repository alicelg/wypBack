/* Creación de todas las acciones sobre la tabla de  usuarios  */

/* GET */

/* Función para obtener todos los usuarios */
/* users.delete = 0 es porque el usuario se puede borrar pero aun así queda guardado en nuestra BBDD*/
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE users.delete = 0', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

/* POST */

/* Creación de un usuario nuevo / registro */
const create = ({ nickname, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users(nickname, email, password) values(?,?,?)', [nickname, email, password], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

module.exports = {
    getAll, create
}