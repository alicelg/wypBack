const router = require('express').Router();
const { getQuestionsByTest, setAnswers } = require('../models/test');
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
router.post('/:testId/answers', async (req, res) => {
    const answersArray = req.body.answersArray;
    const token = req.headers.authorization.split(" ")[1];
    const testId = req.params.testId;


    const user = jwt.verify(token, process.env.SECRET_KEY);

    answersArray.map(answer => {
        answer.userId = user.id;
    })
    console.log(answersArray);
    

    try {
        const rows = await setAnswers( answersArray);
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});





module.exports = router;