const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { create, getByEmail, updateUserById, getUserById } = require('../models/user');
const { getConceptsByUser } = require('../models/concept');
const { getPostByUser, getPostCreatedByUser } = require('../models/post');
const { sendEmail } = require('../models/mail');



/* GETALL usuarios */
router.get('/', async (req, res) => {
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

    const mail = {
      to: req.body.email,
      subject: "Bienvenido a WatchYourPolitics",
      // text: pMail.text,
      html: "<figure class='image'><img src='https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png' srcset='https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_160 160w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_320 320w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_480 480w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_640 640w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_800 800w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_960 960w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_1120 1120w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_1280 1280w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_1440 1440w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/aa5b4fdb228752803722d8872912afe8c6046b2f5c8885a7.png/w_1587 1587w' sizes='100vw' width='640'></figure><small>Este mensaje va dirigido exclusivamente a la persona o entidad que se muestra como destinatario/s, y puede contener datos y/o informaci&oacute;n confidencial, sometida a secreto profesional o cuya divulgaci&oacute;n est&eacute; prohibida en virtud de la legislaci&oacute;n vigente. Toda divulgaci&oacute;n, reproducci&oacute;n u otra acci&oacute;n al respecto por parte de personas o entidades distintas al destinatario est&aacute; prohibida. Si ha recibido este mensaje por error, por favor, contacte con la persona que figura como remitente y proceda a su eliminaci&oacute;n. La transmisi&oacute;n por v&iacute;a electr&oacute;nica no permite garantizar la confidencialidad de los mensajes que se transmiten, ni su integridad o correcta recepci&oacute;n, por lo que no asumimos responsabilidad alguna por estas circunstancias. This message is intended only for the named person or company who is the only authorized recipient, and may include confidential data under professional secrecy, and its disclosure is prohibited by current legislation. Disclosure, copy or any other action in this message by a person or company different to the intended recipient is prohibited. If this message has reached you in error, please notify the sender and destroy it immediately. Electronic communications of data may not guarantee the message&rsquo;s confidentiality, neither their integrity nor correct receipt, so we do not take responsibility for any of those circumstances.</small>"
    };
    await sendEmail(mail);

    res.json(result);
  } catch (error) {
    if (error.errno == 1062) {
      if (error.sqlMessage.includes('email_delete_UNIQUE')) {
        return res.status(200).json({ error: "email" })
      } else if (error.sqlMessage.includes('nickname_UNIQUE')) {
        return res.status(200).json({ error: "nickname" })
      } else {
        return res.status(200).json({ error: process.env.RESPONSE_ALREADY_EXISTS })
      }
    } else {
      return res.status(200).json({ error: process.env.RESPONSE_ERROR_ON_SAVE })
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
