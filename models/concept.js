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

module.exports = {
    getAllConcepts, getConceptsByTitle, getConceptsByPage
}