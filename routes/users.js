const router = require('express').Router();
const { getAll } = require('../models/user');


/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const rows = await getAll();
    res.json(rows);
  } catch (error) {
    res.json({ error: error.message })
  }


});

module.exports = router;
