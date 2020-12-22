const router = require('express').Router();
const { getAllPostsByType, getPostById, getPostsByCategory, insertFavorite, deleteFavorite, createPost, createComment, getCommentsByPostId, deletePostById, getPostCreatedByUser, updatePostById } = require('../models/post');
const { getToken } = require('./middlewares');
const jwt = require('jsonwebtoken');

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
            res.json({
                mensaje: 'New post',
                post: newPost
            });
        } else {
            res.json({ error: 'No se agrego post' });
        }

    } catch (error) {
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