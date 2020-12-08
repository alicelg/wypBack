const router = require('express').Router();
const { getAllPosts, getPostById } = require('../models/post');

/* GetAllPosts  visualizo todos los posts*/
router.get('/', async (req, res) => {
    try {
        const rows = await getAllPosts();
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});

/* recupero por id un post para ver el detalle */

router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    getPostById(postId)
        .then(post => {
            res.json(post);
        })
        .catch(error => {
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        });
})


module.exports = router;