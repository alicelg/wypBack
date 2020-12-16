const router = require('express').Router();
const { getQuestionsByTest, getTimesRepeated, setAnswers, getQuestionsAnswers, setResult, getResult } = require('../models/test');
const jwt = require('jsonwebtoken');


/* getQuestionsByTest  */
router.get('/:testId/questions', async (req, res) => {
    const testId = req.params.testId;
    try {
        const rows = await getQuestionsByTest(testId);
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});

/* setAnswers  */
router.post('/answers', async (req, res) => {
    const answersArray = req.body.answersArray;
    const testId = req.body.testId;
    const initDate = req.body.initDate;

    // extraemos el usuario del token
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);


    // obtenemos el numero de veces que el usuario ha realizado el test
    let timesRepeated;
    try {
        timesRepeated = await getTimesRepeated(testId, user.id);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }

    // si es la primera vez le asignamos 1
    if (timesRepeated == null) {
        timesRepeated = 1;
    } else {
        timesRepeated = timesRepeated.times_repeated + 1
    }

    // generamos el array a insertar en base de datos
    answersArray.map(answer => {
        answer.push(user.id, timesRepeated);
    })

    // seteamos las respuestas
    try {
        await setAnswers(answersArray);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }

    try {
        // obtenemos los ids de las preguntas respondidas
        const questionIdsArray = answersArray.map(answer => answer[1])

        // obtenemos las respuestas válidas guardadas en la BBDD
        const validAnswers = await getQuestionsAnswers(questionIdsArray)

        // calculamos el numero total de preguntas
        const totalAnswers = answersArray.length

        let rightAnswers = 0

        // recorremos el array de respuestas del usuario y comprobamos si coincide con la respuesta válida
        answersArray.map(answer => {
            if (validAnswers.find(validAnswer => validAnswer.id === answer[1]).answer_valid == answer[2]) {
                rightAnswers++
            }
        })

        // calculamos el resultado porcentual
        const percentResult = rightAnswers / totalAnswers * 100

        // insertamos el resultado en la BBDD
        const insertResult = await setResult(testId, user.id, initDate, timesRepeated, rightAnswers, totalAnswers, percentResult)

        // obtenemos el resultado insertado
        const resultData = await getResult(insertResult.insertId)

        res.json(resultData);

    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }
});





module.exports = router;