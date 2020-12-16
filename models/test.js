/* Funciones sobre el test   */


// recupero las preguntas del test
const getQuestionsByTest = (pTestId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM questions WHERE test_id = ? ORDER BY RAND() LIMIT 10', [pTestId], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


const getTimesRepeated = (pTestId, pUserId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT times_repeated FROM test_results WHERE test_id = ? AND user_id = ?', [pTestId, pUserId], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows[0]);
        });
    });
};


const setAnswers = (pAnswersArray) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO user_answers (test_id, question_id, answer_id, user_id, times_repeated ) VALUES ?", [pAnswersArray], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


const getUserAnswers = (pTestId, pUserId, pTimesRepeated) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_answers WHERE test_id = ? AND user_id = ? AND times_repeated = ?', [pTestId, pUserId, pTimesRepeated], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


const getQuestionsAnswers = (pQuestionIdsArray) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, answer_valid FROM questions WHERE id IN (?)', [pQuestionIdsArray], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


const setResult = (pTestId, pUserId, pInitDate, pTimesRepeated, pRightAnswers, pTotalAnswers, pPercentResult) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO test_results (test_id, user_id, init_date, times_repeated, right_answers, total_answers, percent_result ) VALUES (?,?,?,?,?,?,?)", [pTestId, pUserId, pInitDate, pTimesRepeated, pRightAnswers, pTotalAnswers, pPercentResult], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows);
        });
    });
};


const getResult = (pResultId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM test_results WHERE id = ? ", [pResultId], (error, rows) => {
            if (error) reject(error);
            if (rows.length === 0) resolve(null);
            resolve(rows[0]);
        });
    });
};


module.exports = {
    getQuestionsByTest, getTimesRepeated, setAnswers, getUserAnswers, getQuestionsAnswers, setResult, getResult
}