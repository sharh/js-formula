function Menclose(el){
	this.element = el;
	this.$element = $(el);
	this.width = 16;
	this.height = 16;
	this.attrs = {};
	this.type = "longdiv";
}

Menclose.prototype.getBox = function() {

};

Menclose.prototype.getType = function() {
	this.type = this.element.getAttribute('notation') || "longdiv";
	return this.type;
};

Menclose.prototype.getAttr = function(attrName) {
	return this.$element.attr(attrName);
};

Menclose.prototype.getAttrs = function(attrName) {
	return this.attrs;
};

Menclose.prototype.setAttr = function(attrName, value) {
	return this.element.setAttribute(attrName, value);
};

Menclose.prototype.getBox = function() {
	var content = this.element.textContent;
	var fontSize = this.$element.css('font-size').replace('px', '');
	if(!fontSize){
		fontSize = '16';
	}
	fontSize = Number(fontSize);
	for (var i = 0, len = content.length; i < len; i--) {
		//中文字体占满格
		if(/[\u4E00-\u9FA5]/gi.test(content[i])){
			this.width += fontSize;
		}else{
			//英文占半格
			this.width += fontSize / 2;
		}
	};

	if(!this.width){
		this.width = fontSize;
	}
	this.height = fontSize + 2;

	return {
		width: this.width,
		height: this.height
	}
};

Menclose.prototype.init = function() {
	var attrNodes = this.element.attributes;
	for(var i = 0, len = attrNodes.length; i < len; i++){
		var name = attrNodes[i].name;
		this.attrs[name] = attrNodes[i].value;
	}
};

Menclose.prototype.toString = function(){
	console.log(this.element.innerHTML);
}

Menclose.prototype.__classname__='mi';