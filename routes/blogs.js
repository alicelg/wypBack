const router = require('express').Router();
const { getAll, create, getAllComments } = require('../models/blog');


/* recupero todos los POSTS DEL BLOG */
router.get('/', async (req, res) => {
    try {
        const rows = await getAll();
        res.json(rows);

    } catch (error) {
        res.json({ error: error.message })
    }
});

/* creación de post para el blog */
router.post('/create', async (req, res) => {
    try {
        const result = await create(req.body);

        if (result.affectedRows === 1) {
            res.json({
                mensaje: 'Se agrego correctamente el ejercicio',
            });
        }
    } catch (error) {
        res.json({ error: error.message })
    }
});

/* recupero los comentarios realizados en los posts */
router.get('/comments', async (req, res) => {
    try {
        const rows = await getAllComments();
        res.json(rows);
    } catch (error) {
        res.json({ error: error.message })
    }
});

module.exports = router;
