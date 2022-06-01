function isAuthenticated(req, res) {
  if (req.isAuthenticated()) return true
  else return false
}

exports.isAuthenticated
