const router = require('express').Router();
const { getQuestionsByTest, getTimesRepeated, setAnswers, getQuestionsEvaluation, setResult, getResult } = require('../models/test');
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
    const userAnswersArray = req.body.answersArray;
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
    userAnswersArray.map(answer => {
        answer.push(user.id, timesRepeated);
    })

    // seteamos las respuestas
    try {
        await setAnswers(userAnswersArray);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }

    try {
        // obtenemos los ids de las preguntas respondidas
        const questionIdsArray = userAnswersArray.map(answer => answer[1])

        // obtenemos las respuestas válidas guardadas en la BBDD
        const questionsEvaluationArray = await getQuestionsEvaluation(questionIdsArray)

        // calculamos el numero total de preguntas
        const totalAnswers = userAnswersArray.length

        // inicializamos los resultados
        let t1RightAnswers = 0;
        let t2Result = {
            FAS: 0,
            COM: 0,
            NEO: 0,
            SOC: 0,
            ANA: 0,
            total: totalAnswers,
        };

        switch (testId) {
            // lógica test1 (banderas)
            case '1':
                // recorremos las respuestas del usuario y comprobamos su evaluación
                userAnswersArray.map(answer => {
                    t1RightAnswers = t1RightAnswers + questionsEvaluationArray.find(modelAnswer => modelAnswer.question_id === answer[1] && modelAnswer.answer === answer[2]).test1
                })

                // calculamos el resultado porcentual
                const t1PercentResult = t1RightAnswers / totalAnswers * 100

                // insertamos el resultado en la BBDD
                const insertT1Result = await setResult(testId, user.id, initDate, timesRepeated, t1RightAnswers, totalAnswers, t1PercentResult, null)

                // obtenemos el resultado insertado
                const resultT1Data = await getResult(user.id, testId, timesRepeated)

                // devolvemos el resultado
                res.json(resultT1Data);
                break;

            // lógica test2 (orientación política)
            case '2':
                userAnswersArray.map(answer => {

                    switch (questionsEvaluationArray.find(modelAnswer => modelAnswer.question_id === answer[1] && modelAnswer.answer === answer[2]).test2) {
                        case 'FAS':
                            t2Result.FAS = t2Result.FAS + 1
                            break;

                        case 'COM':
                            t2Result.COM = t2Result.COM + 1
                            break;

                        case 'NEO':
                            t2Result.NEO = t2Result.NEO + 1
                            break;

                        case 'SOC':
                            t2Result.SOC = t2Result.SOC + 1
                            break;

                        case 'ANA':
                            t2Result.ANA = t2Result.ANA + 1
                            break;

                        default:
                            break;
                    }
                })

                console.log(t2Result);

                


                // insertamos el resultado en la BBDD
                const insertT2Result = await setResult(testId, user.id, initDate, timesRepeated, null, totalAnswers, null, JSON.stringify(t2Result)
                )

                // obtenemos el resultado insertado
                const resultT2Data = await getResult(user.id, testId, timesRepeated)

                // devolvemos el resultado
                res.json(resultT2Data);
                break;

            default:
                res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
                break;
        }

    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    }
});

router.get('/:testId/result', async (req, res) => {
    const testId = req.params.testId;
    const timesRepeated = req.query.timesRepeated;

    // extraemos el usuario del token
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    try {
        const result = await getResult(user.id, testId, timesRepeated)
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});






module.exports = router;