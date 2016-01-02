
// 网页的宽高
var web_height;
var web_width;
// 按钮的宽高
var button_height;
var button_width;

//按钮的位置
var list_top;
var add_top;
var button_left;

function init(){
   web_height = document.documentElement.clientHeight;
   web_width = document.documentElement.clientWidth;
   $("#background").height(web_height).width(web_width);

   button_width = (web_width*106)/683;
   button_height = (web_height*24)/331;

   button_left = (120*web_width)/683;
   list_top = (115*web_height)/331;
   add_top = (142*web_height)/331;


   $("#add").height(button_height).width(button_width).css({position:"absolute",top:add_top,left:button_left});
   $("#list").height(button_height).width(button_width).css({position:"absolute",top:list_top,left:button_left});

   // console.log("height is "+ web_height);
   // console.log("width is "+ web_width);
}

$(function(){
	$("#list").click(function(e){
        location.href="./list";
	});
	$("#add").click(function(e){
        location.href="./add";
	});
}
)