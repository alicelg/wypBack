const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { create, getByEmail, updateUserById, getUserById } = require('../models/user');
const { getConceptsByUser } = require('../models/concept');
const { getPostByUser, getPostCreatedByUser } = require('../models/post');


/* GETALL usuarios */
router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    const user = await getUserById(req.query.userId);
    res.json(user);
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
    current_work: user.current_work,
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
router.put('/update', async (req, res) => {
  console.log('hola');

  try {
    const result = await updateUserById(req.body);
    if (result.affectedRows === 1) {
      const newdata = await getByEmail(req.body.email);
      res.json({ user: newdata });
    } else {
      res.json({ error: 'Sin actualizar' });
    }

  } catch (error) {
    res.json({ error: error.message });
  }

})

/* conceptos favoritos */
router.get('/concepts', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.SECRET_KEY);

  try {
    const favorite_concepts = await getConceptsByUser(user.id);
    res.json({ concepts: favorite_concepts })

  } catch (error) {
    res.json({ error: error.message });
  }
});


/* post favoritos */
router.get('/posts', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.SECRET_KEY);

  try {
    const favorite_post = await getPostByUser(user.id);
    res.json({ posts: favorite_post })

  } catch (error) {
    res.json({ error: error.message });
  }
});

/* post creados */
router.get('/created/posts', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.SECRET_KEY);

  try {
    const postsCreated = await getPostCreatedByUser(user.id);
    res.json({ posts: postsCreated })

  } catch (error) {
    res.json({ error: error.message });
  }
});





module.exports = router;
