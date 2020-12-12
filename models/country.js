/* Funciones sobre el post   */

/* GET */

// recupero un pais por codigo 
const getCountriesByCode = (pCodes) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM countries WHERE code IN (?)', [pCodes], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });

    });
};

// recupero un pais por nombre 
const getCountriesByname = (pName) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM countries WHERE name_es LIKE ? OR name_en LIKE ? OR official_name LIKE ?', ['%' + pName + '%', '%' + pName + '%', '%' + pName + '%'], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};

module.exports = {
    getCountriesByCode, getCountriesByname
}