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
    const usersAnswersArray = req.body.answersArray;
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
    usersAnswersArray.map(answer => {
        answer.push(user.id, timesRepeated);
    })

    // seteamos las respuestas
    try {
        await setAnswers(usersAnswersArray);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }

    try {
        // obtenemos los ids de las preguntas respondidas
        const questionIdsArray = usersAnswersArray.map(answer => answer[1])

        // obtenemos las respuestas válidas guardadas en la BBDD
        const modelAnswers = await getQuestionsAnswers(questionIdsArray)

        // calculamos el numero total de preguntas
        const totalAnswers = usersAnswersArray.length

        let t1RightAnswers = 0;
        let t2Result = {
            FAS: 0,
            COM: 0,
            NEO: 0,
            CAP: 0,
            ANA: 0
        };


        switch (testId) {
            // lógica test1 (banderas)
            case 1:
                usersAnswersArray.map(answer => {
                    t1RightAnswers = t1RightAnswers + modelAnswers.find(modelAnswer => modelAnswer.id === answer[1]).test_1
                })

                // calculamos el resultado porcentual
                const percentResult = t1RightAnswers / totalAnswers * 100

                // insertamos el resultado en la BBDD
                const insertResult = await setResult(testId, user.id, initDate, timesRepeated, rightAnswers, totalAnswers, percentResult)

                // obtenemos el resultado insertado
                const resultData = await getResult(insertResult.insertId)

                res.json(resultData);
                break;

            // lógica test2 (orientación política)
            case 2:
                usersAnswersArray.map(answer => {

                    switch (modelAnswers.find(modelAnswer => modelAnswer.id === answer[1]).test_2) {
                        case 'FAS':
                            t2Result.FAS = t2Result.FAS + 1
                            break;

                        case 'COM':
                            t2Result.COM = t2Result.COM + 1
                            break;

                        case 'NEO':
                            t2Result.NEO = t2Result.NEO + 1
                            break;

                        case 'CAP':
                            t2Result.CAP = t2Result.CAP + 1
                            break;

                        case 'ANA':
                            t2Result.ANA = t2Result.ANA + 1
                            break;

                        default:
                            break;
                    }
                })
                break;

            default:
                break;
        }
        // // recorremos el array de respuestas del usuario y comprobamos si coincide con la respuesta válida
        // usersAnswersArray.map(answer => {
        //     if (modelAnswers.find(modelAnswer => modelAnswer.id === answer[1]).answer_valid == answer[2]) {
        //         rightAnswers++
        //     }
        // })








    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }
});





module.exports = router;