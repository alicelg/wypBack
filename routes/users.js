const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAll, create, getByEmail } = require('../models/user');


/* GETALL usuarios */
router.get('/', async (req, res) => {
  try {
    const rows = await getAll();
    res.json(rows);
  } catch (error) {
    return res.status(400).json({ error:  process.env.RESPONSE_NOT_FOUND});
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
    return res.status(400).json({ error:  process.env.RESPONSE_ERROR_ON_SAVE});
  }
});


/* POST LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    /* verificación del email */
    const user = await getByEmail(email);
    if (!user) {
      return res.status(400).json({ error:  process.env.RESPONSE_UNAUTHORIZED});
    }
    /* verificación de la contraseña */
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ error: process.env.RESPONSE_UNAUTHORIZED });
    }
    /* email y contraseña CORRECTOS*/
    res.json({ token: createJwtToken(user) })

  } catch (error) {
    return res.status(400).json({ error:  process.env.RESPONSE_UNAUTHORIZED});
  }

})

function createJwtToken(user) {
  const obj = {
    userId: user.id,
    email: user.email,
    userRole: user.role
  }

  return jwt.sign(obj, process.env.SECRET_KEY, {expiresIn: '48h'});
}

module.exports = router;
