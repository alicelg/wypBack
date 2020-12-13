/* Funciones sobre el post   */

/* GET */


// recupero las preguntas del test

const getQuestionsByTest = (pTest) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM questions WHERE test_id = ?', [pTest], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};

const setAnswers = (pAnswersArray) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO user_answers (question_id, answer_id, user_id ) VALUES ?", [pAnswersArray], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


module.exports = {
    getQuestionsByTest, setAnswers
}