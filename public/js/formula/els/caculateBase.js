function caculateBase(el, attrs){
	var content = el.textContent;
	var myFontSize = getFontSize(el);
	if(myFontSize){
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
	var rect = this.element.getClientRects()[0];
	this.width = rect.width;
	this.height = rect.height;

	return {
		width: this.width,
		height: this.height
	}
}

function getFontSize(el){
	var fontAttr = el.getAttribute('fontSize') || el.getAttribute('font-size');

	if(!fontAttr){
		cssText = el.style.cssText;
		cssText.replace(/font-size\s*:\s*(.*?)(px|em|%|cm|mm|in|pc);*?/i, function(reg, s1, s2){
			switch(s2){
				case '%':
					fontAttr = Number(s1) / 100 * getFontSize(el.parentNode);
					break;
				case 'px':
					fontAttr = Number(s1);
					break;
				case 'em':
					fontAttr = Number(s1) * 16;
					break;
				case 'cm':
					break;
				case 'mm':
					break;
				case 'in':
					break;
				case 'pc':
					break;
			}
		})
	}

	if(fontAttr == null || fontAttr == undefined){
		if(el.tagName === 'BODY' || el.tagName === 'body'){
			fontAttr = $(el).css('font-size');
		}else{
			return getFontSize(el.parentNode);
		}
	}
	fontAttr = (fontAttr+'').replace('px', '');
	return Number(fontAttr);
}