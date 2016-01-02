var Good = function(number,price,updatetime,id,name,picdir,style,productplace,energy){
	this.id = id;
	this.name=name;
	this.number=number;
	this.price = price;
	this.updatetime=updatetime;
	this.style = style;
	this.productplace = productplace;
	this.energy = energy;
	this.pic = picdir;
}

module.exports=Good;