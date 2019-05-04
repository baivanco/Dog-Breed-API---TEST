const express = require('express');
const app = express();
const path = require('path')
const fetch = require('node-fetch');
const myParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/DBConnection", {
  useNewUrlParser: true
});

const auth = require('./helpers/auth')
const admin = require('./helpers/admin')

const port = 3000;

app.set('view engine', 'ejs');
app.use(session({
  secret: "breed"
}))
app.use(myParser.urlencoded({
  extended: true
}))
app.listen(port, () => {
  console.log("Runing Server On Port : " + port);
})
app.use('/static', express.static('public'))

var User = require('./models/users')

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))

})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'))

})

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let type = "user"
  User.findOne({
    email: email,
    password: password,
    type: "admin"
  }, function (err, result) {
    if (err) {
      throw err
    } else if (result !== null) {
      req.session.type = type;
      res.redirect('/admin')
    } else {
      User.findOne({
        email: email,
        password: password
      }, function (err, result) {
        if (err) {
          throw err
        } else if (result !== null) {
          req.session.email = email;
          res.redirect('/mybreed')
        } else {
          res.sendFile(path.join(__dirname, '/login_err.html'))
        }
      })
    }
  })
})

app.get('/mybreed', auth.isLogged, (req, res) => {
  fetch("https://dog.ceo/api/breed/malinois/images/random/3")
    .then(res => res.json())
    .then(json => {

      res.render("mybreed", {
        dogs: json
      })

    })
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/register.html'))
})

app.post('/register', (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let type = "user"
  User.findOne({
    email: email
  }, function (err, result) {
    if (err) {
      throw err
    } else {
      if (result !== null) {
        res.sendFile(path.join(__dirname, '/register_err.html'))
      } else {
        var newUser = new User({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password,
          type: "user"
        })
        newUser.save(function (err, result) {
          if (err) {
            throw err
          } else {
            res.redirect('/loginNew')
          }
        })
      }
    }
  })
})

app.get('/admin', admin.isAdmin, (reg, res) => {
  res.render("admin")
})
app.get('/users', admin.isAdmin, (req, res) => {
  User.find(function (err, result) {
    if (err) {
      throw err
    } else {
      res.render('users', {
        users: result
      })
    }
  })
})


app.get('/loginNew', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginNew.html'))
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.sendFile(path.join(__dirname, '/logout.html'))
    }
  })
})