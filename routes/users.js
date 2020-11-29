const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getAll, create } = require('../models/user');


/* GETALL usuarios */
router.get('/', async (req, res) => {
  try {
    const rows = await getAll();
    res.json(rows);
  } catch (error) {
    res.json({ error: error.message })
  }

});

/* POST CREATE */
/* en un hash nunca sabremos la contraseña encambio en un encriptado si se puede desencriptar */
router.post('/create', async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await create(req.body);
    res.json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
})

module.exports = router;
