//设置路由分发
var DataBase=require('../public/libs/js/ControlData.js') 
var fs = require('fs')
var path = require('path')
//首页
module.exports = function(app){
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
				 for(var i = 0 ;i<goods.length;i++){
				 	goods[i].updatetime = getLocalTime(goods[i].updatetime);
				 }
			     reponse.render('list',{
				 title: '商品列表',
				 goods
			})
			});
		})

		//添加新的商品
		app.get('/add',function(request,reponse){
			var action = "/add"
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
					},
				action
			})
		})

		//更新商品信息
		app.get('/update/:id',function(request,reponse){
			var id = request.params.id;
		//	console.log("id is "+id);
			var data = new DataBase();
		    var query = "SELECT numbers,price,updatetime,id,name,style,productplace,energy " +
		              "FROM wholeinfo where id = '"+id+"'";
		    var action ="/update"
			data.selectFromWhole(query,8,function(goods){ 
				 var good = goods[0];
			     reponse.render('add',{
				 title: '更新商品的信息',
				 good,
		         action
				 });
			});
		})

		//删除商品
		app.delete('/list',function(request,reponse){
			var id = request.query.id;
		// 	console.log("receive id is "+id);
			var data = new DataBase();
			var sdelete="delete from wholeinfo where id = '"+id+"'";
			data.Changeinfo(sdelete,true,function(){
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
				 good.updatetime = getLocalTime(good.updatetime);
				 var query = "SELECT numbers,price,saletime " +
		              "FROM detailinfo where id = '"+id+"'";
				 data.selectFromWhole(query,3,function(details){ 
		              //	 good.setpic((id+".jpg"));
		         for(var i = 0 ; i < details.length ; i++){
                     details[i].updatetime = getLocalTime(details[i].updatetime);
		         }
			//	 console.log("place is "+good.productplace+" updatetime is "+good.updatetime+" style is "+good.style+" pic is "+good.pic);
			     reponse.render('detail',{
				 title: '商品的详细信息',
				 good,
				 details
				 });
			   });
			});
		})

		//更新产品信息
		app.post('/update',function(request,response){
			var id = request.body.id;
			console.log("id is "+id);
			var name = request.body.name;
			var style = request.body.style;
			var productplace = request.body.productplace;
			var price = request.body.price;
			var energy = request.body.energy;
			uploadFile(id,request,function(){
				var updatetime = Date.parse(new Date())/1000;
				var data = new DataBase();
				// console.log("update");
				var query = "SELECT numbers " +
			              "FROM wholeinfo where id = '"+id+"'";
				data.selectFromWhole(query,1,function(goods){ 
			         var number = goods[0].numbers;
			         var sdelete="delete from wholeinfo where id = '"+id+"'";
					   data.Changeinfo(sdelete,true,function(){
							var sinsert="insert into wholeinfo (id,name,style,productplace,"+
				           "price,energy,numbers,updatetime) values ('"+id+"','"+name+"','"+style+
				           "','"+productplace+"','"+price+"','"+energy+"',"+number+",'"+updatetime+"')"
			                  data.Changeinfo(sinsert,true,function(){
			                                  response.redirect('/detail/'+id);
					     });
				    });
				});
			});
		})

		//添加产品信息
		app.post('/add',function(request,response){
			var id = request.body.id;
			var name = request.body.name;
			var style = request.body.style;
			var productplace = request.body.productplace;
			var price = request.body.price;
			var energy = request.body.energy;
			var updatetime = Date.parse(new Date())/1000;
			var data = new DataBase();
			var sinsert="insert into wholeinfo (id,name,style,productplace,"+
			           "price,energy,numbers,updatetime) values ('"+id+"','"+name+"','"+style+
			           "','"+productplace+"','"+price+"','"+energy+"',"+0+",'"+updatetime+"')"
			  // console.log("add exec is "+ sinsert);
		      data.Changeinfo(sinsert,true,function(){
		                      response.redirect('/list');
			});
		})

		app.post('/uploadPic',function(request,response){
			uploadFile(request,function(){
				
			});
		})

		//Android端获取产品信息
		app.post('/android/updateinfo',function(request,response){
            var updatetime = request.body.updatetime;
             // console.log("updatetime is "+ updatetime);
			var data = new DataBase();
		    var query = "SELECT numbers,price,updatetime,id,name " +
		              "FROM wholeinfo where updatetime > "+updatetime;
			data.selectFromWhole(query,5,function(goods){
			     // console.log("good is "+ goods);
			      response.json(goods);
			})

		})

		//Android来更新商品的出售信息
		app.post('/android/loadupdetail',function(request,response){
			var info = request.body.info;
			var data = new DataBase();
			// var info = "[{'id':'1000000000','time':'1231435135','number':'20','price':'23.5'},"+
			//           "{'id':'1000000001','time':'1231435135','number':'20','price':'23.5'}]"
            var newinfo = eval(info)
			var sinsert = "insert all "
			for(var i=0;i<newinfo.length;i++){
				var id = newinfo[i].id
				var time = newinfo[i].time
                var number = newinfo[i].number
                var price = newinfo[i].price
                var sinsert=sinsert+"into detailinfo (id,price,saletime,numbers)"+
			           " values ('"+id+"','"+price+"','"+time+
			           "','"+number+"') "
			}
			sinsert = sinsert+" select 1 from dual"
			console.log("exec is "+sinsert);
		    data.Changeinfo(sinsert,true,function(){
                    console.json({success:5});
			 });
 		// 	console.log(request.body.info);
		})

		//Android端添加产品信息
		app.post('/android/add',function(request,response){
			var id = request.body.id;
			var name = request.body.name;
			var style = request.body.style;
			var productplace = request.body.productplace;
			var price = request.body.price;
			var energy = request.body.energy;
			var updatetime = Date.parse(new Date())/1000;
			var data = new DataBase();
			var sinsert="insert into wholeinfo (id,name,style,productplace,"+
			           "price,energy,numbers,updatetime) values ('"+id+"','"+name+"','"+style+
			           "','"+productplace+"','"+price+"','"+energy+"',"+0+",'"+updatetime+"')"
			  // console.log("add exec is "+ sinsert);
		      data.Changeinfo(sinsert,true,function(){
		                      response.json({success:1});
			});
		})
}

//把时间戳改为正常的格式
function getLocalTime(nS) {     
       return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,16).replace(/年|月/g, "/").replace(/日/g, " ");      
    } 

function uploadFile(req,callback){
	var fs = require('fs');
    var formidable = require("formidable");
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/";//改变临时目录
    form.parse(req, function(error, fields, files){
        for(var key in files){
            var file = files[key];
            switch (file.type){
                case "image/jpeg":
                    fName = "temp.jpg";
                    break;
                case "image/png":
                    fName = "temp.png";
                    break;
                default :
                    fName = "temp.png";
                    break;
            }
            console.log(file.size);
            var uploadDir = "./public/image/" + fName;
            fs.rename(file.path, uploadDir, function(err) {
                if (err) {
                   console.log(err);
                   return;
                }
                // res.write("upload image:<br/>");
                // res.write("<img src='/imgShow?id=" + fName + "' />");
                // res.end();
                callback();
            });
        }
    });
}