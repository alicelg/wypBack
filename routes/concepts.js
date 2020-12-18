const router = require('express').Router();
const { getAllConcepts, getConceptsByTitle, getConceptsByPage, insertFavorite, deleteFavorite } = require('../models/concept');
const jwt = require('jsonwebtoken');


/* GetAllConcepts  */
router.get('/', async (req, res) => {
    try {
        const rows = await getAllConcepts();
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});


/* GetConceptsByPage  */
/* router.get('/page/:pPagina', async (req, res) => {
    const pPagina = req.params.pPagina;
    console.log(pPagina);
    try {
        const rows = await getConceptsByPage(pPagina);
        res.json(rows);
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
}); */

router.get('/page/:pPagina', (req, res) => {
    const pPagina = req.params.pPagina;

    getConceptsByPage(pPagina)
        .then(concepts => {
            res.json(concepts);
        })
    /* .catch(error => {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }); */
})

/* ruta para añadir  favoritos conceptos */
router.post('/favorite', (req, res) => {
    console.log(req.body);

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);


    insertFavorite(user.id, req.body.conceptId)
        .then(favorite => {
            res.json(favorite);
        }

        )
    /* .catch(error => {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    });
*/
})

/* ruta para eliminar favoritos conceptos */
router.delete('/favorite', (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);


    deleteFavorite(user.id, req.query.conceptId)
        .then(favorite => {
            res.json(favorite);
        })
})


module.exports = router;