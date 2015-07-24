
//默认情况下中文字体的宽高是一样的
//而英文字体的宽只有font-size的一半。

function Mi(el){
	this.$element = $(el);
	this.element = el;
	this.attrs = {};
	this.width = 0;
	this.height = 0;	
}

Mi.prototype.getAttr = function(attrName) {
	return this.$element.attr(attrName);
};

Mi.prototype.getAttrs = function(attrName) {
	return this.attrs;
};

Mi.prototype.setAttr = function(attrName, value) {
	return this.element.setAttribute(attrName, value);
};

Mi.prototype.getBox = function() {
	var content = this.element.textContent;
	var myFontSize = this.element.getAttribute('fontSize');
	if(myFontSize === '12px'){
		var span = document.createElement('span');
		span.innerHTML = content;
		span.style.cssText = "position: absolute; top: -9999px; font-size: "+myFontSize+';';
		document.body.appendChild(span);
		var newRect = span.getClientRects()[0];
		this.width = newRect.width;
		this.height = newRect.height;
		span.remove();
		return {
			width: this.width,
			height: this.height
		}
	}

	//不推荐使用这种方式，原因是在浏览器在布排满一行后，
	//得到的getClientRects不再是准确的，从而导致一些奇怪的现象出现
	var rect = this.element.getClientRects()[0];
	this.width = rect.width;
	this.height = rect.height;

	return {
		width: this.width,
		height: this.height
	}
};

Mi.prototype.getBox2 = function() {
	var platform = navigator.platform;
	var content = this.element.textContent;
	var fontSize = this.$element.parents('math').parents().css('font-size').replace('px', '');
	var smallFontSize = this.element.getAttribute('fontSize');

	fontSize = smallFontSize ? smallFontSize : fontSize;
	fontSize = (fontSize+'').replace('px', '');
	if(!fontSize){
		fontSize = '16';
	}

	//家教机上显示字体需要加宽
	fontSize = Number(fontSize)// + (platform === 'Win32' ? 0 : 1);
	for (var i = 0, len = content.length; i < len; i++) {
		//中文字体占满格
		if(/[\u4E00-\u9FA5]/gi.test(content[i])){
			this.width += fontSize;
		}else{
			//英文占半格
			this.width += fontSize / 2;
		}
	};

	if(!this.width){
		this.width = 0;
	}

	return {
		width: this.width,
		height: this.height
	}
};

Mi.prototype.init = function() {
	var attrNodes = this.element.attributes;
	for(var i = 0, len = attrNodes.length; i < len; i++){
		var name = attrNodes[i].name;
		this.attrs[name] = attrNodes[i].value;
	}
};

Mi.prototype.toString = function(){
	console.log(this.element.innerHTML);
}

Mi.prototype.__classname__='mi';