const router = require('express').Router();
const { getAllPosts } = require('../models/post');

/* GetAllPosts  */
router.get('/', async (req, res) => {
    try {
        const rows = await getAllPosts();
        res.json(rows);
    } catch (error) {
        res.json({ error: error.message })
    }
});


module.exports = router;