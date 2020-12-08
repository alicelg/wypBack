const router = require('express').Router();
const { getAllConcepts } = require('../models/concept');

/* GetAllConcepts  */
router.get('/', async (req, res) => {
    try {
        const rows = await getAllConcepts();
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});





module.exports = router;