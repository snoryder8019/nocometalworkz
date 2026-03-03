exports.requireAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) return next();
  if (req.isAuthenticated()) return res.status(403).render('error', { message: 'Access denied.', error: {} });
  res.redirect('/auth/google');
};
