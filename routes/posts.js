const router = require('express').Router();
const { getAllPostsByType, getPostById, getPostsByCategory, insertFavorite, deleteFavorite, createPost, createComment, getCommentsByPostId, deletePostById, getPostCreatedByUser, updatePostById } = require('../models/post');
const { getToken } = require('./middlewares');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../models/mail');

/* getAllPostsByType  visualizo todos los posts*/
router.get('/', async (req, res) => {
    const type = req.query.type;
    try {
        getAllPostsByType(type).then(posts => {
            // editamos el objeto de la respuesta
            const postsArray = [];
            posts.map(post => Object.keys(post).map(value => {
                postsArray.push(JSON.parse(post[value]))
            }));

            res.json(postsArray);
        })
    } catch (error) {
        res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
    }
});

/* recupero por id un post para ver el detalle */
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    getPostById(postId).then(post => {
        if (post != null) {
            // editamos el objeto de la respuesta
            Object.keys(post).map(value => {
                post = JSON.parse(post[value])
            });

            getCommentsByPostId(postId).then(comments => {
                const commentsArray = [];
                comments.map(comment => Object.keys(comment).map(value => {
                    commentsArray.push(JSON.parse(comment[value]))
                }));

                post.comments = commentsArray;
                res.json(post);
            })
        } else {
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        }
    })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        });
})

/* recuperación de posts por categoría */
router.get('/category/:type/:category', (req, res) => {
    const category = req.params.category;
    const type = req.params.type;

    getPostsByCategory(category, type)
        .then(posts => {
            // editamos el objeto de la respuesta
            const postsArray = [];
            if (posts) {
                posts.map(post => Object.keys(post).map(value => {
                    postsArray.push(JSON.parse(post[value]))
                }));
            }
            res.json(postsArray);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        });
})


/* creo un post  */
router.post('/new', getToken, async (req, res) => {

    try {
        const result = await createPost(req.user.id, req.body);
        if (result.affectedRows === 1) {
            const newPost = await getPostById(result.insertId);

            const mail = {
                to: req.user.email,
                subject: "Gracias por tu publicación en WatchYourPolitics",
                // text: pMail.text,
                html: "<figure class='image'><img src='https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png' srcset='https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_160 160w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_320 320w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_480 480w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_640 640w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_800 800w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_960 960w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_1120 1120w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_1280 1280w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_1440 1440w, https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/43a98e35aec42c7e4818ab17994cb39953eab66052e67c97.png/w_1587 1587w' sizes='100vw' width='640'></figure><small>Este mensaje va dirigido exclusivamente a la persona o entidad que se muestra como destinatario/s, y puede contener datos y/o informaci&oacute;n confidencial, sometida a secreto profesional o cuya divulgaci&oacute;n est&eacute; prohibida en virtud de la legislaci&oacute;n vigente. Toda divulgaci&oacute;n, reproducci&oacute;n u otra acci&oacute;n al respecto por parte de personas o entidades distintas al destinatario est&aacute; prohibida. Si ha recibido este mensaje por error, por favor, contacte con la persona que figura como remitente y proceda a su eliminaci&oacute;n. La transmisi&oacute;n por v&iacute;a electr&oacute;nica no permite garantizar la confidencialidad de los mensajes que se transmiten, ni su integridad o correcta recepci&oacute;n, por lo que no asumimos responsabilidad alguna por estas circunstancias. This message is intended only for the named person or company who is the only authorized recipient, and may include confidential data under professional secrecy, and its disclosure is prohibited by current legislation. Disclosure, copy or any other action in this message by a person or company different to the intended recipient is prohibited. If this message has reached you in error, please notify the sender and destroy it immediately. Electronic communications of data may not guarantee the message&rsquo;s confidentiality, neither their integrity nor correct receipt, so we do not take responsibility for any of those circumstances.</small>"
            };

            await sendEmail(mail);
            res.json({
                mensaje: 'New post',
                post: newPost
            });
        } else {
            res.json({ error: 'No se agrego post' });
        }

    } catch (error) {
        console.log(error);
        res.json({ error: error.message });

    }
});

/* ruta para favoritos post */
router.post('/favorite', (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    insertFavorite(user.id, req.body.postId)
        .then(favorite => {
            res.json(favorite);
        })
        .catch(error => {
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        });
})


/* ruta para eliminar de favoritos los posts */
router.delete('/nofav', (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    deleteFavorite(user.id, req.query.postId)
        .then(favorite => {
            res.json(favorite);
        }).catch(error => {
            res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND })
        });
})


/* creo un comentario de un post  */
router.post('/comment', getToken, async (req, res) => {
    try {
        const result = await createComment(req.user.id, req.body.text, req.body.postId);

        if (result.affectedRows === 1) {
            res.json(result);
        } else {
            res.json({ error: 'No se agrego su comment' });
        }

    } catch (error) {
        res.json({ error: error.message });
    }
});


/* ruta para eliminar los post  */
router.delete('/:postId', async (req, res) => {
    // const token = req.headers.authorization.split(" ")[1];
    // const user = jwt.verify(token, process.env.SECRET_KEY);

    try {
        const result = await deletePostById(req.params.postId);
        if (result.affectedRows === 1) {
            res.json({ mensaje: 'Se ha eliminado su post' });
        } else {

            res.json({ error: 'Ha ocurrido un error en el eliminado' })
            console.log(error);
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

/* edito el post  */
router.put('/edit', async (req, res) => {
    try {
        const result = await updatePostById(req.body);
        if (result.affectedRows === 1) {
            res.json({ result });
        } else {
            res.json({ error: 'No se ha podido editar' });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

// visualizo los post creador por el usuario
router.get('/created', async (req, res) => {
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