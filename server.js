
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
var session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;


let obrisano = false;
let k = false;
let tok = "CIwNZNlR4XbisJF39I8yWnWX9wX4WFoz";


app.get("/", (req, res) => {
    let m = req.session.m;
    k = false;
    
    res.render('home', {m: m, k: k, naslov:"nezaštićeno"})
})
app.post("/",(req, res) => {
   
   let data = req.body.poruka;
   req.session.m = data
     res.redirect("/");
 })
 app.get("/safe", (req, res) => {
    k = true
    let m_safe = req.session.m_safe;
    res.render('home', {m: m_safe, k: k, naslov: "zaštićeno"})
})
app.post("/safe",(req, res) => {
    let data = req.body.poruka;
    req.session.m_safe = data
      res.redirect("/safe");
  })

  app.get("/csrf_attack", (req, res) => {
    let m_csrf = req.session.m_csrf;
    k = false
    if(obrisano){
      m_csrf =""
    }
    let ext = false;
    if(externalUrl){
       ext = true
    }
    res.render('csrf', {m_csrf: m_csrf,k: k, naslov: "nezaštićeno", obrisano: obrisano, ext: ext})
})

 
app.post("/csrf_attack",(req, res) => {
  if(tok == req.body.csrftoken){
    console.log("SAFEEE")
  }else{
    console.log("not safe")
  }
  let data = req.body.poruka_csrf;
  req.session.m_csrf = data
  obrisano = false
    res.redirect("/csrf_attack");
})

app.get("/csrf_attack/safe", (req, res) => {
  let m_csrf_safe = req.session.m_csrf_safe;
  k = true

  let ext = false;
    if(externalUrl){
       ext = true
    }
 
  res.render('csrf', {m_csrf: m_csrf_safe,k: k, naslov: "zaštićeno",ext: ext})
})
app.post("/csrf_attack/safe",(req, res) => {
  if(tok == req.body.csrftoken){
    console.log("tu samm")
    let data = req.body.poruka_csrf;
    req.session.m_csrf_safe = data
    res.redirect("/csrf_attack/safe");
  }else{
    console.log("not safeeeeeeeee")
    res.redirect("/csrf_attack/safe");
  }
  
  
})





//DELETE


app.get("/delete", (req, res) => {
    k = false;
    obrisano = true
    res.redirect("/csrf_attack");
   
}); 


if (externalUrl) {
  const hostname = 'localhost';
  app.listen(port, hostname, () => {
  console.log(`Server running on ${externalUrl}`);
  });
  }else {
    app.listen(3000, () => {
      console.log('Server listening on : 3000')
    })
    }
