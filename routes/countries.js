const router = require('express').Router();

const { getCountriesByCode } = require('../models/country');

/* GET paises por código */
router.get('/', async (req, res) => {
  const query = req.query;

  try {
    const rows = await getCountriesByCode(query.code);
    res.json(rows);
  } catch (error) {
    return res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND });
  }
});





module.exports = router;
