const router = require('express').Router();
const { getAllPosts, getPostById } = require('../models/post');

/* GetAllPosts  visualizo todos los posts*/
router.get('/', async (req, res) => {
    try {
        const rows = await getAllPosts();
        res.json(rows);
    } catch (error) {
        res.json({ error: error.message })
    }
});

/* recupero por id un post para ver el detalle */

router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    getPostById(postId)
        .then(post => {
            res.json(post);
        })
        .catch(error => console.log(error));
})


module.exports = router;