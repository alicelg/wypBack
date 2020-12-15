const router = require('express').Router();
const { getAllConcepts, getConceptsByTitle, getConceptsByPage, insertFavorite } = require('../models/concept');

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

/* ruta para favoritos conceptos */
router.post('/favorite', (req, res) => {
    console.log(req.body);

    insertFavorite(req.body.idconcepto)
        .then(favorite => {
            res.json(favorite);
        }

        )
    /* .catch(error => {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    });
*/
})


module.exports = router;