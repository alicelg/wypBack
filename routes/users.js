const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAll, create, getByEmail, updateById } = require('../models/user');


/* GETALL usuarios */
router.get('/', async (req, res) => {
  try {
    const rows = await getAll();
    res.json(rows);
  } catch (error) {
    return res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND });
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
    console.log(error.code, error.errno);

    if (error.errno == 1062) {
      return res.status(400).json({ error: process.env.RESPONSE_ALREADY_EXISTS })
    } else {
      return res.status(400).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
    };
  }
});


/* POST LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    /* verificación del email */
    const user = await getByEmail(email);
    if (!user) {
      return res.status(400).json({ error: process.env.RESPONSE_UNAUTHORIZED });
    }
    /* verificación de la contraseña */
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ error: process.env.RESPONSE_UNAUTHORIZED });
    }
    /* email y contraseña CORRECTOS*/
    res.json({ token: createJwtToken(user) })

  } catch (error) {
    return res.status(400).json({ error: process.env.RESPONSE_UNAUTHORIZED });
  }
})

function createJwtToken(user) {

  const obj = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    studies: user.studies,
    currentWork: user.current_work,
    photo: user.photo,
    nickname: user.nickname,
    registerDate: user.date,
    userRole: user.role,
    linkedin: user.linkedin,
    country: user.country

  }

  return jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: '48h' });
}

/* editar los datos del usuario */

router.post('/update', async (req, res) => {
  console.log(req.body);

  /* ejecuto el update sobre la base de datos */
  const result = await updateById(req.body.email, req.body)
  console.log(result);

  /* redirijo al cliente editado  */
  res.json(result);
})

module.exports = router;
