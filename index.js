const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const expressValidator = require('express-validator')
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users'])
const ObjectId = mongojs.ObjectId;

const app = express();

//Set view Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

//Body Parser middleware Documentation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Set Static Path to inpute our jquery, css, html pages
app.use(express.static(path.join(__dirname, 'public')));

//Global variable
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
})
//Express Validator Middle middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));

//End of Validator

app.get('/', (req, res) => {
  db.users.find((err, docs) =>{
    // docs is an array of all the documents in mycollection
    //console.log(docs);
    res.render("index", {
      title: "myCustomers",
      users: docs,
    });
  })
});

app.post('/users/add', (req, res) => {
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();

  let errors = req.validationErrors();

  if (errors){
    db.users.find((err, docs) =>{
      // docs is an array of all the documents in mycollection
      //console.log(docs);
      res.render("index", {
        title: "myCustomers",
        errors: errors,
        users: docs
      })
    })
  }else{
    let newUser = {
      name: req.body.name,
      email: req.body.email
    }
    db.users.insert(newUser, (err, result)=>{
      if (err){
        console.log(err);
      }
      res.render('new', {
        name : req.body.name
      })
    })
  }
});

app.delete('/:id', (req, res)=>{
  db.users.remove({_id: ObjectId(req.params.id)}, (err, result)=>{
    if (err){
      console.log(err);
    }
    res.redirect('/');
  })
})

app.get('/users/update/:id', (req, res)=>{
  alert("jjjs")
  res.render('update')
  //db.users.update({})
})


app.listen(3000, () => {
  console.log('Server started on Port 3000...');
})
