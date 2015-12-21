$(function(){
	$('.del').click(function (e){
		var target = $(e.target);
		var id =target.data('id');
		var tr = $('.item-id-'+id);
        console.log("id is "+id);
		$.ajax({
			type:'delete',
			url:'/list?id='+id
		})
		//ajax成功后执行，失败则不执行
		.done(function(results){
			if(results.success===1){
				console.log("success");
				if(tr.length>0)
					tr.remove();
			}
		})
	})
});