/* Funciones para recuperar todos los conceptos */

/* GET */

/* recuperar todos los conceptos */
const getAllConcepts = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM concepts', (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

const getConceptsByTitle = (pTitles) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM concepts WHERE concepts.title IN (?)', [pTitles], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

const getConceptsByPage = (pPagina) => {
    const pagina = parseInt(pPagina) * 5;

    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM concepts LIMIT 5 OFFSET ?', [pagina], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });

    });
}


const insertFavorite = (favorite) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    const idUsuario = user.id;
    const confavorite = favorite;
    console.log(confavorite);

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO favorite_concepts (fk_user, fk_concept) VALUES (?,?)', [idUsuario, confavorite], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

module.exports = {
    getAllConcepts, getConceptsByTitle, getConceptsByPage, insertFavorite
}