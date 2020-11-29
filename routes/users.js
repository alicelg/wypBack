const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getAll, create, getByEmail } = require('../models/user');


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
});


/* POST LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    /* verificación del email */
    const user = await getByEmail(email);
    if (!user) {
      return res.json({ error: 'Error en el email y/o contraseña' });
    }
    /* verificación de la contraseña */
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.json({ error: 'Error en el email y/o contraseña' });
    }
    /* email y contraseña CORRECTOS*/
    res.json({
      success: 'Entra el usuario 🐷'
    })

  } catch (error) {
    res.json({ error: error.message })
  }

})

module.exports = router;
