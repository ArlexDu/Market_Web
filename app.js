var express  = require('express')
var port = process.env.PORT || 3000
var path = require('path')
var app =express()
var bodyParser=require('body-parser')
var DataBase=require('./public/lib/js/ControlData.js') 

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.listen(port)
console.log('NFCWeb start on port:'+port)

//设置路由分发
//首页
app.get('/',function(request,reponse){
	reponse.render('index',{
		title: 'NFCMarket'
	})
})

//商品总的列表
app.get('/list',function(request,reponse){
    var data = new DataBase();
    var query =  "SELECT id,name,numbers,price,updatetime " +
              "FROM wholeinfo ";
	data.selectFromWhole(query,5,function(goods){
	     reponse.render('list',{
		 title: '商品列表',
		 goods
	})
	});
})

//添加新的商品
app.get('/add',function(request,reponse){
	reponse.render('add',{
		title: '添加新的商品',
		good: {
				id: '',
				name: '',
				place: '',
				energy: '',
				price: '',
				time: '',
				pic: '',
				class:''
			}
	})
})

//更新商品信息
app.get('/update/:id',function(request,reponse){
	reponse.render('add',{
		title: '添加新的商品',
		good: {
				id: '1000000000',
				name: '牛奶',
				place: '呼伦贝尔',
				energy: '100',
				price: '23.50',
				time: '',
				pic: '/image/1.jpg',
				class:'食品'
			}
	})
})

//查看具体销售信息
app.get('/detail/:id',function(request,reponse){
	reponse.render('detail',{
		title: '商品的详细信息',
		good: {
				id: '1000000000',
				name: '牛奶',
				class: '食品',
				place: '呼伦贝尔',
				energy: '100',
				price: '23.50',
				time: '2015/12/12',
				pic: '/image/1.jpg',
				number: '200'
			},
		detail: [{
				time: '2015/1/1',
				price: '20',
				number: '2'
				},{
				time: '2015/2/1',
				price: '25',
				number: '9'
				}]
	})
})

