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
    var query = "SELECT numbers,price,updatetime,id,name " +
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
				productplace: '',
				energy: '',
				price: '',
				time: '',
				pic: '',
				style:''
			}
	})
})

//更新商品信息
app.get('/update/:id',function(request,reponse){
	var id = request.params.id;
//	console.log("id is "+id);
	var data = new DataBase();
    var query = "SELECT numbers,price,updatetime,id,name,style,productplace,energy " +
              "FROM wholeinfo where id = '"+id+"'";
	data.selectFromWhole(query,8,function(goods){ 
		 var good = goods[0];
	     reponse.render('add',{
		 title: '更新商品的信息',
		 good
		 });
	});
})

//删除商品
app.delete('/list',function(request,reponse){
	var id = request.query.id;
// 	console.log("receive id is "+id);
	var data = new DataBase();
	var sdelete="delete from wholeinfo where id = '"+id+"'";
	data.deleteinfo(sdelete,function(){
		  reponse.json({success:1});
	});
})
//查看具体销售信息
app.get('/detail/:id',function(request,reponse){
	var id = request.params.id;
//	console.log("id is "+id);
	var data = new DataBase();
    var query = "SELECT numbers,price,updatetime,id,name,style,productplace,energy " +
              "FROM wholeinfo where id = '"+id+"'";
	data.selectFromWhole(query,8,function(goods){ 
		 var good = goods[0];
		 var query = "SELECT numbers,price,saletime " +
              "FROM detailinfo where id = '"+id+"'";
		 data.selectFromWhole(query,3,function(details){ 
              //	 good.setpic((id+".jpg"));
	//	 console.log("place is "+good.productplace+" updatetime is "+good.updatetime+" style is "+good.style+" pic is "+good.pic);
	     reponse.render('detail',{
		 title: '商品的详细信息',
		 good,
		 details
		 });
	});
	});
})

