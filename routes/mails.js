const router = require('express').Router();
const { sendEmail } = require('../models/mailCtrl');


router.post('/', async (req, res) => {
  try {
    const result = await sendEmail(req.body);
    res.json(result)

  } catch (error) {
    return res.status(400).json({ error: process.env.RESPONSE_EMAIL_SEND_FAILED });
  }
})

module.exports = router;
