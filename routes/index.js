const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '../data/content.json');

router.get('/', (req, res) => {
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
  res.render('index', {
    title: `${content.company} | Welding & Fencing`,
    ...content
  });
});

module.exports = router;
