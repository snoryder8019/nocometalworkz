const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAdmin } = require('../middleware/auth');
const PageView = require('../models/PageView');
const Submission = require('../models/Submission');

const CONTENT_PATH = path.join(__dirname, '../data/content.json');

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
}
function writeContent(data) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET /admin — dashboard
router.get('/', requireAdmin, async (req, res) => {
  try {
    const content = readContent();

    // Analytics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 29);
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(today.getDate() - 6);

    const [totalViews, todayViews, weekViews, totalSubmissions, unreadSubmissions, recentSubmissions, dailyViews] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ createdAt: { $gte: today } }),
      PageView.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Submission.countDocuments(),
      Submission.countDocuments({ read: false }),
      Submission.find().sort({ createdAt: -1 }).limit(10).lean(),
      PageView.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ])
    ]);

    // Fill in missing days for the chart
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = dailyViews.find(v => v._id === key);
      chartData.push({ date: key, count: found ? found.count : 0 });
    }

    res.render('admin/dashboard', {
      user: req.user,
      content,
      analytics: { totalViews, todayViews, weekViews, totalSubmissions, unreadSubmissions, chartData },
      recentSubmissions,
      flash: { success: req.flash('success'), error: req.flash('error') }
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Admin error', error: err });
  }
});

// POST /admin/update/company
router.post('/update/company', requireAdmin, (req, res) => {
  const content = readContent();
  const { company, tagline, phone, email, serviceArea } = req.body;
  Object.assign(content, { company, tagline, phone, email, serviceArea });
  writeContent(content);
  req.flash('success', 'Company info updated.');
  res.redirect('/admin#company');
});

// POST /admin/update/hero
router.post('/update/hero', requireAdmin, (req, res) => {
  const content = readContent();
  content.hero = {
    eyebrow: req.body.eyebrow,
    title: req.body.title,
    subtitle: req.body.subtitle,
    ctaPrimary: req.body.ctaPrimary,
    ctaSecondary: req.body.ctaSecondary,
    stat1Num: req.body.stat1Num, stat1Label: req.body.stat1Label,
    stat2Num: req.body.stat2Num, stat2Label: req.body.stat2Label,
    stat3Num: req.body.stat3Num, stat3Label: req.body.stat3Label,
  };
  writeContent(content);
  req.flash('success', 'Hero section updated.');
  res.redirect('/admin#hero');
});

// POST /admin/update/about
router.post('/update/about', requireAdmin, (req, res) => {
  const content = readContent();
  const credentials = (req.body.credentials || '')
    .split('\n').map(s => s.trim()).filter(Boolean);
  content.about = {
    eyebrow: req.body.eyebrow,
    title: req.body.title,
    body: req.body.body,
    credentials,
    yearsNum: req.body.yearsNum,
    yearsLabel: req.body.yearsLabel
  };
  writeContent(content);
  req.flash('success', 'About section updated.');
  res.redirect('/admin#about');
});

// POST /admin/update/services
router.post('/update/services', requireAdmin, (req, res) => {
  const content = readContent();
  const icons = [].concat(req.body.icon || []);
  const names = [].concat(req.body.name || []);
  const descs = [].concat(req.body.desc || []);
  content.services = icons.map((icon, i) => ({ icon, name: names[i], desc: descs[i] }));
  writeContent(content);
  req.flash('success', 'Services updated.');
  res.redirect('/admin#services');
});

// POST /admin/submissions/:id/read — mark submission as read
router.post('/submissions/:id/read', requireAdmin, async (req, res) => {
  await Submission.findByIdAndUpdate(req.params.id, { read: true });
  res.redirect('/admin#submissions');
});

// DELETE /admin/submissions/:id
router.post('/submissions/:id/delete', requireAdmin, async (req, res) => {
  await Submission.findByIdAndDelete(req.params.id);
  res.redirect('/admin#submissions');
});

module.exports = router;
