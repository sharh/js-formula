
//默认情况下中文字体的宽高是一样的
//而英文字体的宽只有font-size的一半。

function Mn(el){
	this.$element = $(el);
	this.element = el;
	this.attrs = {};
	this.width = 16;
	this.height = 8;	
}

Mn.prototype.getAttr = function(attrName) {
	return this.$element.attr(attrName);
};

Mn.prototype.getAttrs = function(attrName) {
	return this.attrs;
};

Mn.prototype.setAttr = function(attrName, value) {
	return this.element.setAttribute(attrName, value);
};

Mn.prototype.getBox = function() {
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

Mn.prototype.init = function() {
	var attrNodes = this.element.attributes;
	for(var i = 0, len = attrNodes.length; i < len; i++){
		var name = attrNodes[i].name;
		this.attrs[name] = attrNodes[i].value;
	}
};