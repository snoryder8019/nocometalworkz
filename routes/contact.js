const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    await Submission.create({
      name, phone, email, service, message,
      ip: req.ip
    });
    res.redirect('/?submitted=1#contact');
  } catch (err) {
    console.error('Submission error:', err);
    res.redirect('/?error=1#contact');
  }
});

module.exports = router;
