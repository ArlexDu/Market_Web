var express  = require('express')
var port = process.env.PORT || 3000
var path = require('path')
var app =express()
var bodyParser=require('body-parser')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
require('./config/router')(app)
app.listen(port)
console.log('NFCWeb start on port:'+port)

