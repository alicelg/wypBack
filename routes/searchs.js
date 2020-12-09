const router = require('express').Router();
const { getPostByTitleType } = require('../models/post');
const { getConceptsByTitle } = require('../models/concept');

const esES = require('../translate/es-ES.json')
const enGB = require('../translate/en-GB.json')



router.get('/', async (req, res) => {
  const query = req.query;

  try {
    let generalPostsRows;
    let hablandoPostsRows;
    let conceptsRows;

    if (query.blogs.includes('1')) {
      generalPostsRows = await getPostByTitleType(query.searchTerm, 1);
    }

    if (query.blogs.includes('2')) {
      hablandoPostsRows = await getPostByTitleType(query.searchTerm, 2);
    }

    if (query.concepts) {
      const translateKeys = getTranslateKey(query.searchTerm)
      if (translateKeys.length) {
        const translateKeysRefined = translateKeys.map(translateKey => 'CONCEPT.' + translateKey)
        conceptsRows = await getConceptsByTitle(translateKeysRefined);
      }
    }

    const response = {
      generalPosts: await generalPostsRows,
      hablandoPosts: await hablandoPostsRows,
      concepts: await conceptsRows
    }

    res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND });
  }
});

function getTranslateKey(term) {
  const esESResult= Object.keys(esES).filter(key => esES[key].includes(term));
  const enGBResult = Object.keys(enGB).filter(key => enGB[key].includes(term));
  
  return esESResult.concat(enGBResult);
}

module.exports = router;
