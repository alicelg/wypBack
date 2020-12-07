const router = require('express').Router();
const { getAllConcepts } = require('../models/concept');

/* GetAllConcepts  */
router.get('/', async (req, res) => {
    try {
        const rows = await getAllConcepts();
        res.json(rows);
    } catch (error) {
        res.json({ error: error.message })
    }
});





module.exports = router;