$(document).ready(function (e) {
    $('#upPic').on('submit',(function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            type:'POST',
            url: $(this).attr('action'),
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
        }).done(function(results){
        	if(results.success===1){
				console.log("success");
				$('#pic').attr('src',results.path)
			}
        });
    }));

    $("#inputfile").on("change", function() {
        $("#upPic").submit();
    });
});