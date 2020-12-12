/* Funciones sobre el post   */

/* GET */

// recupero un pais por codigo 
const getCountriesByCode = (pCodes) => {
    return new Promise((resolve, reject) => {
        console.log(pCodes);

        db.query('SELECT * FROM countries where code in (?)', [pCodes], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });

        // if (pCategory == 'todos') {
        //     db.query('SELECT * FROM posts where type = ?', [pType], (error, rows) => {
        //         if (error) reject(error);
        //         if (rows.length === 0) resolve(null);
        //         resolve(rows);
        //     });
        // } else {
        //     db.query('SELECT * FROM posts WHERE category = ? AND type = ?', [pCategory, pType], (error, rows) => {
        //         if (error) reject(error);
        //         if (rows.length === 0) resolve(null);
        //         resolve(rows);
        //     });
        // }
    });
};

module.exports = {
    getCountriesByCode
}