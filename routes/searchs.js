const router = require('express').Router();
const { getPostByTitleType } = require('../models/post');
const { getConceptsByTitle } = require('../models/concept');
const { getCountriesByname } = require('../models/country')

const esES = require('../translate/es-ES.json')
const enGB = require('../translate/en-GB.json')



router.get('/', async (req, res) => {
  const query = req.query;

  try {
    let generalPostsRows;
    let hablandoPostsRows;
    let conceptsRows;
    let countriesRows;

    if (query.blogs.includes('1')) {
      generalPostsRows = await getPostByTitleType(query.searchTerm.toLowerCase(), 1);
    }

    if (query.blogs.includes('2')) {
      hablandoPostsRows = await getPostByTitleType(query.searchTerm.toLowerCase(), 2);
    }

    if (query.concepts != 'false') {
      const translateKeys = getTranslateKey(query.searchTerm)
      if (translateKeys.length) {
        const translateKeysRefined = translateKeys.map(translateKey => 'CONCEPT.' + translateKey)
        conceptsRows = await getConceptsByTitle(translateKeysRefined);
      }
    }

    if (query.countries != 'false') {
      countriesRows = await getCountriesByname(query.searchTerm.toLowerCase());
    }

    const response = {
      generalPosts: await generalPostsRows,
      hablandoPosts: await hablandoPostsRows,
      concepts: await conceptsRows,
      countries: await countriesRows
    }

    res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND });
  }
});

function getTranslateKey(term) {
  const esESResult = Object.keys(esES).filter(key => esES[key].toLowerCase().includes(term.toLowerCase()));
  const enGBResult = Object.keys(enGB).filter(key => enGB[key].toLowerCase().includes(term.toLowerCase()));

  return esESResult.concat(enGBResult);
}

module.exports = router;
