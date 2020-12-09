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
    console.log(pTitles);
    return new Promise((resolve, reject) => {
        db.query('SELECT id,title FROM concepts WHERE concepts.title IN (?)', [pTitles], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

module.exports = {
    getAllConcepts, getConceptsByTitle
}