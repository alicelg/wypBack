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


const insertFavorite = (pUserId, pConceptId) => {
    console.log(pConceptId);

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO favorite_concepts (user_id, concept_id) VALUES (?,?)', [pUserId, pConceptId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}


const getConceptsByUser = (pUserId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM favorite_concepts INNER JOIN concepts ON favorite_concepts.concept_id = concepts.id WHERE favorite_concepts.user_id = ?', [pUserId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

const deleteFavorite = (pUserId, pConceptId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM favorite_concepts WHERE user_id = ? AND concept_id = ?', [pUserId, pConceptId], (error, rows) => {
            if (error) reject(error);
            resolve(rows)
        });
    });
}

module.exports = {
    getAllConcepts, getConceptsByTitle, getConceptsByPage, insertFavorite, getConceptsByUser, deleteFavorite
}