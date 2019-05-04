exports.isAdmin = function (req, res, next){
  if(req.session.type){
    next()
  }else{
    res.redirect('/login')
  }
}
