function caculateBox(el, box){

	if(!el){
		return box;
	}
	var tagName = el.tagName;
	var _box;

	switch(tagName){
		case "mi":
			_box = new Mi(el).getBox();
			box.width += _box.width || 0;
			break;
		case "mo":
			_box = new Mi(el).getBox();
			box.width += _box.width || 0;
			break;
		case "mn":
			_box = new Mi(el).getBox();
			box.width += _box.width || 0;
			break;
		case 'mtext':
			_box = new Mi(el).getBox();
			box.width += _box.width || 0;
			break;
		case 'mtable':
			var _box = {height: 0, width: 0};
			// box.height -= box.height;
			for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
				var myChild = item.childNodes[j];
				if(myChild.tagName === 'mtr'){
					var trbox = caculateBox(myChild, {width: 0, height: defaultHeight});
					_box.height += trbox.height + 0;//0暂时设置列表行高为0.
					_box.width = _box.width > trbox.width ? _box.width : trbox.width;
				}
			};

			box.height = box.height > _box.height ? box.height : _box.height;

			box.width += _box.width;
			break;
		case 'mtr':
			_box = new Mi(el).getBox();
			box.width += _box.width || 0;
			break;
	}

	if(_box){
		box.width += _box.width || 0;
		return box;
	}

	var childs = el.childNodes;
	for (var i = 0, len = childs.length; i < len; i++) {
		var item = childs[i];
		if(item.tagName === 'mfrac'){
			var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
			var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight});
			box.width += fbox.width > sbox.width ? fbox.width + 1 : sbox.width + 1;
			
			var mHeight = fbox.height + sbox.height + 5;
			box.height = box.height > mHeight ? box.height : mHeight;
			continue;
		}else if(item.tagName === 'munderover'){
			//这个是中间的那个元素，这个是正常的状态
			var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
			//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
			var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight - 4});
			//这个是上面的那个元素
			var tbox = caculateBox(item.childNodes[2], {width: 0, height: defaultHeight - 4});
			var bwidth = fbox.width > sbox.width ? fbox.width: sbox.width;
			box.width += bwidth > tbox.width ? bwidth : tbox.width;
			 
			var mHeight = fbox.height + sbox.height + tbox.height;
			box.height = box.height > mHeight ? box.height : mHeight;
			continue;
		}else if(item.tagName === 'msup' || item.tagName === 'msub'){
			setSup(item.childNodes[1]);
		}else if(item.tagName === 'msubsup'){
			setSup(item.childNodes[1]);
			setSup(item.childNodes[2]);
			//这个是中间的那个元素，这个是正常的状态
			var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
			//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
			var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight - 4});
			//这个是上面的那个元素
			var tbox = caculateBox(item.childNodes[2], {width: 0, height: defaultHeight - 4});
			box.width += fbox.width + (sbox.width > tbox.width ? sbox.width: tbox.width);

			var mHeight = fbox.height + (sbox.height + tbox.height) / 2 + 5;
			box.height = box.height > mHeight ? box.height : mHeight;
			
			continue;
		}else if(item.tagName === 'mtable'){
			var _box = {height: 0, width: 0};
			// box.height -= box.height;
			for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
				var myChild = item.childNodes[j];
				if(myChild.tagName === 'mtr'){
					var trbox = caculateBox(myChild, {width: 0, height: defaultHeight});
					_box.height += trbox.height + 0;//0暂时设置列表行高为0.
					_box.width = _box.width > trbox.width ? _box.width : trbox.width;
				}
			};

			box.height = box.height > _box.height ? box.height : _box.height;

			box.width += _box.width;
			continue;
		}else if(item.tagName === 'mtr'){
			var _box = {height: 0, width: 0};
			for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
				var myChild = item.childNodes[j];
				if(myChild.tagName === 'mtd'){
					var tdbox = caculateBox(myChild, {width: 0, height: defaultHeight});
					_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
					_box.width += tdbox.width;
				}
			};

			box.height = box.height > _box.height ? box.height : _box.height;
			box.width += _box.width;
			continue
		}else if(item.tagName === 'mspace'){
			var linebreak = item.getAttribute('linebreak');
			var breakType = ['newline', 'goodbreak', 'auto', 'badbreak', 'nobreak'];
			var width = item.getAttribute('width'), height = item.getAttribute('height');
			width = width ? Number(width.replace('px', '')) : 0;
			height = height ? Number(height.replace('px', '')) : defaultHeight;
			if(linebreak === 'newline'){
				var myPNode = item.parentNode;
				var index = 0;
				while(myPNode.childNodes.item(index) != item){
					index++;
				}
				var preBox = {width: 0, height: defaultHeight};
				for(var l = 0; l < index; l++){
					var preItemBox = caculateBox(myPNode.childNodes[l], {width: 0, height: defaultHeight});
					preBox.width += preItemBox.width;
					preBox.height = preBox.height > preItemBox.height ? preBox.height : preItemBox.height;
				}
				var nextBox = {width: 0, height: defaultHeight};
				for(l = l+1;l < myPNode.childNodes.length; l++){
					var nItemBox = caculateBox(myPNode.childNodes[l], {width: 0, height: defaultHeight});
					nextBox.width += nItemBox.width;
					nextBox.height = nextBox.height > nItemBox.height ? nextBox.height : nItemBox.height;
				}
				box.height += height > nextBox.height ? height : nextBox.height;
				box.width -= preBox.width;
				box.width += preBox.width > (width + nextBox.width) ? preBox.width : (width+nextBox.width);
				break;
			}else{
				box.height += height / 2;
				box.width += width;
			}

		}

		caculateBox(item, box);
		switch(item.tagName){
			case 'menclose':
				box.width += 5;
				box.height += 2;
				break;
			case 'mfenced':
				box.width += 11;
				// box.height += 2;
				break;
			case 'mover':
				box.height += 5;
				var lbox = caculateBox(item.lastChild, {width: 0, height: defaultHeight});
				box.width -= lbox.width;
				break;
			case 'mroot':
				box.width += 5;
				box.height += 2;
				break;
			case 'msqrt':
				box.width += 5;
				box.height += 2;
				break;
			case 'msubsup':
				box.width += 5;
				box.height += 7;
				break;
			case 'msup':
				box.width += 2;
				box.height += 6;
				break;
			case 'msub':
				box.height += 6;
				break;
			case 'mtd':
				box.height += 2;
				box.width += 5;
				break;
			case 'mtable':
				var _box = {height: 0, width: 0};
				box.height -= box.height;
				for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
					var myChild = item.childNodes[j];
					if(myChild.tagName === 'mtr'){
						box.height += caculateBox(myChild, {width: 0, height: defaultHeight}).height + 0;//0暂时设置列表行高为0.
						if(myChild.nextSibling && myChild.nextSibling.tagName === 'mtr'){
							box.width -= caculateBox(myChild.nextSibling, {width:0, height: 0}).width;
						}
					}else if(!box.height){
						box.height += caculateBox(myChild, {width: 0, height: 0}).height;
					}
				};
				break;
			case 'munder':
				box.height += 5;
				var lbox = caculateBox(item.lastChild, {width: 0, height: defaultHeight});
				box.width -= lbox.width;
				break;
			case 'munderover':
				var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
				var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight});
				var tbox = caculateBox(item.childNodes[3], {width: 0, height: defaultHeight});
				box.width += (fbox.width > sbox.width ? fbox.width: sbox.width);
				box.height += fbox.height + sbox.height - defaultHeight + 5;
				continue;
				box.height += 22;
				break;
		}
	};

	return box;

}

function drawMath(el, box, offset){
	if(!box){
		box = {width: 0, height: defaultHeight};
		box = caculateBox(el, box);
	}
	var s = Snap().attr({
		height: box.height,
		width: box.width,
		verticalAlign: '-webkit-baseline-middle'
	});
	offset = offset ? offset : {left:0, top: 0, right: 0, bottom:0, h: box.height};

	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, s, offset);
	};
}
//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<mfenced open="[" close="]"><mrow/></mfenced></math>
//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<mfenced open="[" close="]"><mn>2</mn></mfenced></math>
function drawMfenced(el, svg, offset, clientRect){
	var s = svg || Snap();
	var typeOpen = el.getAttribute('open') || '[', typeClose = el.getAttribute('close') || ']';

	if(clientRect){
		s.attr(clientRect);
	}
	// var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	myBox.width += 10;

	// var marginTop = myPBox.height - myBox.height;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	// offset.top += marginTop / 2;
	var x = offset.left || 0, y = offset.top ? offset.top: 0, h = myBox.height;


	//"M{x0},{y0}H{x1}V{y1}H{x2}"
	//默认使用"[]"
	var arrayOpen = [x+5, y, x, y + h, x+5];
	var arrayClose = [x+myBox.width - 5, y, x + myBox.width, y + h, x+myBox.width-5];
	//'(': '(',
	// '{': '{',
	// '[': '[',
	// '|': '|',
	// '||': '||',
	switch(typeOpen){
		case '[':
			break;
		case '{':
			//∫符合的组合形式
			//"M{x0}{y0},Q{x1},{y1},{x2},{y2}T{x3},{y3}L{x}{y}
			//M{x4},{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x}{y}";
			var up = [x+20/4, y + 1, x+15/4, y, x+10/4, y + 1, x+10/4, y + h/ 2 - 3, x, y + h/2];
			var down = [x+20/4, y + h - 1, x + 15/4, y + h, x + 10/4, y + h - 1, x + 10/4, y + h / 2 + 3, x, y + h / 2];
			arrayOpen = [].concat(up, down);
			break;
		case '|':
			//"M{x0},{y0}V{y1}";
			arrayOpen = [x + 5/2, y, y + h];
			break;
		case '||':
			//"M{x0},{y0}V{y1}M{x2}{y2}V{y3}";
			arrayOpen = [x + 5/4, y, y + h, x + 15/4, y, y + h];
			break;
		case '(':
			//"M{x0},{y0}Q{x1},{y1},{x2},{y2}";
			arrayOpen = [x + 4, y, x + 1, y + h / 2, x + 4, y + h];
			break;
	}
	drawFence(s, arrayOpen, typeOpen);
	offset.left += 5;
	x = x-4;
	switch(typeClose){
		case ']':
			break;
		case '}':
			var up = [x + myBox.width, y + 1, x+myBox.width+5/4, y, x+ myBox.width +10/4, y + 1, x+myBox.width+10/4, y + h / 2 - 3, x+myBox.width + 20/4, y + h/2];
			var down = [x + myBox.width, y + h - 1, x + myBox.width + 5/4, y + h, x + myBox.width + 10/4, y + h- 1, x + myBox.width + 10/4, y + h / 2 + 3, x + myBox.width + 20/4, y + h / 2];
			arrayClose = [].concat(up, down);
			break;
		case '|':
			arrayClose = [x + myBox.width + 5/2, y, y + h];
			break;
		case '||':
			arrayClose = [x + myBox.width + 5/4, y, y + h, x + myBox.width + 15/4, y, y + h];
			break;
		case ')':
			arrayClose = [x + myBox.width, y, x + myBox.width+ 4, y + h / 2, x + myBox.width, y + h];
			break;
	}
	drawFence(s, arrayClose, typeClose);
	offset.right += 5;
	if(el.childNodes.length){
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			drawBox(item, s, offset);
		};
	}
	offset.left += 8;
	// offset.top -= marginTop / 2;
}

function drawBox(el, svg, offset){
	var tagName = el.tagName;
	switch(tagName){
		case 'math':
			drawMath(el, svg, offset);
			break;
		case 'mi':
			var box = {width: 0, height: defaultHeight};
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var myBox = caculateBox(el, box);
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			break;
		case 'mn':
			var box = {width: 0, height: defaultHeight};
			var myBox = caculateBox(el, box);
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			break;
		case 'mo':
			var box = {width: 0, height: defaultHeight};
			var myBox = caculateBox(el, box);
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			break;
		case 'mtext':
			var box = {width: 0, height: defaultHeight};
			var myBox = caculateBox(el, box);
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 +  - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			break;
		case 'mfenced':
			drawMfenced(el, svg, offset);
			break;
		case 'mrow':
			drawCommon(el, svg, offset);
			break;
		case 'menclose':
			drawMenclose(el, svg, offset);
			break;
		case 'mfrac':
			drawMfrac(el, svg, offset);
			break;
		case 'mover':
			drawMover(el, svg, offset);
			break;
		case 'mroot':
			drawMroot(el, svg, offset);
			break;
		case 'mspace':
			drawMspace(el, svg, offset);
			break;
		case 'msqrt':
			drawMsqrt(el, svg, offset);
			break;
		case 'msub':
			drawMsub(el, svg, offset);
			break;
		case 'msup':
			drawMsup(el, svg, offset);
			break;
		case 'msubsup':
			drawMsubsup(el, svg, offset);
			break;
		case 'mtd':
			drawMtd(el, svg, offset);
			break;
		case 'mtr':
			drawMtr(el, svg, offset);
			break;
		case 'mtable':
			drawMtable(el, svg, offset);
			break;
		case 'munder':
			drawMunder(el, svg, offset);
			break;
		case 'munderover':
			drawMunderOver(el, svg, offset);
			break;
		case 'mstyle':
			drawMstyle(el, svg, offset);
			break;
	}
}

function drawMstyle(el, svg, offset){
	if(!offset){
		offset = {left: 0, top: 0, right: 0, bottom: 0};
	}
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, svg, offset);
	};
}

function drawMtd(el, svg, offset){
	svg = svg.g();
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, svg, offset);
	};

	//判断是否还有下一个，如果有，则加一个距离
	if(el.nextSibling && el.nextSibling.tagName === 'mtd'){
		offset.left += 3;
	}
}

function drawMtr(el, svg, offset){
	svg = svg.g();
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, svg, offset);
	};

	//如果还有兄弟mtr则变换高度
	if(el.nextSibling && el.nextSibling.tagName === 'mtr'){
		offset.top += caculateBox(el, {width: 0, height: defaultHeight}).height + 0;//0暂时设置列表行高为0.
		offset.left = 0;
	}
}

function drawMtable(el, svg, offset){

	svg = svg.g();
	if(!offset){
		offset = {left: 0, top: 0, right: 0, bottom: 0};
	}
	var _box = {height: 0, width: 0};
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		var myChild = el.childNodes[j];
		if(myChild.tagName === 'mtr'){
			var trbox = caculateBox(myChild, {width: 0, height: defaultHeight});
			_box.height += trbox.height + 0;//0暂时设置列表行高为0.
			_box.width = _box.width > trbox.width ? _box.width : trbox.width;
		}
	};
	var _originTop = offset.top;
	var _oldLeft = offset.left;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, svg, offset);
	};
	offset.top = _originTop;
	offset.left = _oldLeft + _box.width;
}

//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<menclose notation="box"><mn>12</mn></menclose></math>
function drawMenclose(el, svg, offset, clientRect){
	//由于notation可以组合，这里暂时只画一个，不画组合的
	var type = el.getAttribute('notation').split(' ')[0];

	var s = svg || Snap();
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	myBox.width += 5, myBox.height += 2;

	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;

	// offset.top += marginTop / 2;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height;
	
	var array = [x + 1, y + h, x + 4, y + h / 2, x+1, y + 1, x+myBox.width];
	switch(type){
    	case "longdiv":
    		// strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}H{x3}";
    		offset.left += 5;
    		break;
    	case "actuarial":
    		// strFormat = "M{x0},{y0}H{x1}V{y1}";
    		array = [x, y + h + 1, x + myBox.width, y + h];
    		offset.left += 5;
    		break;
    	case "radical":
			// strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}";
    		array = [x, y + 2*h/3, x + 1, y + 2*h/3 - 2, x + 5/2, y + h, x + 5, y + 1, x+myBox.width];
    		offset.left += 5;
    		break;
    	case "box":
    		 // x = array[0],y = array[1],w = array[2],h = array[3],rx = array[4],//圆角半径ry = array[5];
    		array = [x + 2, y + 1, myBox.width - 4, h - 2];
    		offset.left += 2;
    		break;
    	case "roundedbox":
    		array = [x + 2, y + 1, myBox.width - 4, h - 2, 2, 2];
    		offset.left += 2;
    		break;
    	case "circle":
    		// cx = array[0],cy = array[1],rx = array[2],ry = array[3];
    		array = [(x + myBox.width)/2, y + (h / 2), myBox.width / 2 - 2, h / 2 - 1];
    		offset.left += 3;
    		break;
    	case "left":
    		// strFormat = "M{x0},{y0}V{y1}";
    		array = [x+2, y + 1, y + h];
    		offset.left += 3;
    		break;
    	case "right":
    		// strFormat = "M{x0},{y0}V{y1}";
    		array = [x+myBox.width - 3, y + 1, y + h];
    		// offset.left += 3;
    		break;
    	case "top":
    		// strFormat = "M{x0},{y0}H{x1}";
    		array = [x + 2, y + 1, x + myBox.width - 2];
    		offset.left += 2;
    		offset.top += 1;
    		break;
    	case "bottom":
    		array = [x + 2, y + h - 1, x + myBox.width - 2];
    		offset.left += 2;
    		// offset.top += 1;
    		break;
    	case "updiagonalstrike":
    		// strFormat = "M{x0},{y0}L{x1},{y1}";
    		array = [x + 2, y + h, x + myBox.width - 2, y + 1];
    		offset.top += 1;
    		offset.left += 2.5;
    		break;
    	case "downdiagonalstrike":
    		// strFormat = "M{x0},{y0}L{x1},{y1}";
    		array = [x + 2, y + 1, x + myBox.width - 2, y + h];
    		offset.top += 1;
    		offset.left += 2.5;
    		break;
    	case "verticalstrike":
    		// strFormat = "M{x0},{y0}V{y1}";
    		array = [(x + myBox.width) / 2, y, y + h];
    		offset.left += 2.5;
    		break;
    	case "horizontalstrike":
    		// strFormat = "M{x0},{y0}H{x1}";
    		array = [x + 2, y + h / 2, x + myBox.width -2];
    		offset.left += 2.5;
    		break;
    	case "madruwb":
    		strFormat = "M{x0},{y0}H{x1}V{y1}";
    		array = [x+2, y + h, x + myBox.width - 2, y + 1];
    		offset.left += 2.5;
    		break;
    	case "updiagonalarrow":
    		// strFormat = "M{x0},{y0}L{x1},{y1}L{x2}{y2}M{x1}{y1}L{x3}{y3}";
    		array = [x + 2, y + h, x + myBox.width - 1, y + 1, x + myBox.width - 5, y + 8, x + myBox.width - 9, y];
    		offset.left += 2.5;
    		break;
    	case "phasorangle":
    		// strFormat = "M{x0},{y0}L{x1},{y1}H{x2}";
    		array = [x + 4, y + 1, x, y + h, x + myBox.width];
    		offset.left += 5;
    		break;
    }

    drawEnclose(s, array, type);

	if(el.childNodes.length){
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			drawBox(item, s, offset);
		};
	}

	// offset.top -= marginTop / 2;
}

function drawMsqrt(el, svg, offset, clientRect){
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	myBox.width += 5;
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;

	// offset.top += marginTop / 2;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + 2*h/3, x + 1, y + 2*h/3 - 2, x + 5/2, y + h, x + 5, y + 1, x+w];
    offset.left += 5;
    drawSqrt(s,array);

    if(el.childNodes.length){
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			drawBox(item, s, offset);
		};
	}
	// offset.top -= marginTop / 2;
}

function drawMfrac(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	if(clientRect){
		s.attr(clientRect);
	}
	var myBox = {};
	var fbox = caculateBox(el.childNodes[0], {width: 0, height: defaultHeight});
	var sbox = caculateBox(el.childNodes[1], {width: 0, height: defaultHeight});
	myBox.width = fbox.width > sbox.width ? fbox.width + 1 : sbox.width + 1;
	myBox.height = fbox.height + sbox.height + 5;
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;

	// offset.top += marginTop / 2;

	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + fbox.height + 2, x + w, y + fbox.height + 2];
    drawFrac(s,array);

	var _oldLeft = offset.left;
	var _oldTop = offset.top;
	offset.left += (w - fbox.width) / 2;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, s, offset);
		offset.top += fbox.height + 2;//y + fbox.height + 2
		offset.left = _oldLeft + (w - sbox.width) / 2;
	};
	offset.top = _oldTop;
	offset.left = _oldLeft + w;
	// offset.top -= marginTop / 2;
}

function drawMover(el, svg, offset, clientRect){
	var type = getLastChild(el).textContent;
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;

	// offset.top += marginTop / 2;
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + 5, x + w / 2, y, x + w, y+5];
    

	//string format
	// var strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
	switch(type){
		case '(':
			break;
		case '{':
			
    		// strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}T{x3}{y3}Q{x4},{y4},{x5},{y5}";
			var Larray = [x, y + 5, x + 1, y + 3 *5 /4, x + 2, y + 5/2, x + w/2 -2, y + 4 / 2, x + w/2 -1, y, x + w/2, y];
			var Rarray = [x + w, y + 5, x + w - 1, y + 3 *5 /4, x + w - 2, y + 5/2, x + w/2 + 2, y + 4 / 2, x + w/2 + 1, y + 1 / 3, x + w/2, y];
			array = Larray.concat(Rarray);
			break;
		case '_':
			// strFormat = "M{x0},{y0}H{x1}";
			array = [x, y + 2, x + w];
			break;
		case '^':
			// strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}";
			array = [x, y + 5, x + w / 2, y, x + w, y + 5];
			break;
		case '~':
			// strFormat = "M{x0},{y0}C{x1},{y1},{x2},{y2},{x3},{y3}S{x4},{y4},{x5},{y5}";
			array = [x, y + 5/2, x + w / 8, y + 5/4, x + w/4, y + 5/4, x + w/2, y + 5 / 2, x + 3*w / 4, y + 15/4, x + w, y + 5/2];
			break;
		case '=':
			// strFormat = "M{x0},{y0}L{x1},{y1}M{x2},{y2}L{x3},{y3}";
			array = [x, y + 1, x + w, y + 1, x, y + 4, x + w, y + 4];
			break;
		case '.':
			// x = array[0],
			// y = array[1],
			// r = array[2];
			array = [x + w / 2, y + 3.5, 2.5];
			// return drawCircle(svg, array, attrs);
			break;
		case '。':

			array = [x + w / 2, y + 3.5, 2.5];
			break;
		case '°':
			return drawCircle(svg, array, attrs);
			break;
		default:
			break;
	}

	drawOver(s, array, type);

	offset.top += 5;
	if(el.childNodes.length){
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			drawBox(item, s, offset);
			break;
		};
	}
	offset.top -= 5;
	// offset.top -= marginTop / 2;

}

function drawMunder(el, svg, offset, clientRect){
	var type = getLastChild(el).textContent;
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;
	// offset.top += marginTop / 2;
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + h - 5, x + w / 2, y + h, x + w, y+ h -5];
    

	//string format
	// var strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
	switch(type){
		case '(':
			break;
		case '{':
			
    		// strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}T{x3}{y3}Q{x4},{y4},{x5},{y5}";
			var Larray = [x, y + h - 5, x + 1, y + h - 3 *5 /4, x + 2, y + h - 5/2, x + w/2 -2, y + h - 4 / 2, x + w/2 -1, y + h, x + w/2, y + h];
			var Rarray = [x + w, y + h - 5, x + w - 1, y + h - 3 *5 /4, x + w - 2, y + h - 5/2, x + w/2 + 2, y + h - 4 / 2, x + w/2 + 1, y + h - 1 / 3, x + w/2, y + h];
			array = Larray.concat(Rarray);
			break;
		case '_':
			// strFormat = "M{x0},{y0}H{x1}";
			array = [x, y + h, x + w];
			break;
		case '^':
			// strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}";
			array = [x, y + h - 5, x + w / 2, y + h, x + w, y + h - 5];
			break;
		case '~':
			// strFormat = "M{x0},{y0}C{x1},{y1},{x2},{y2},{x3},{y3}S{x4},{y4},{x5},{y5}";
			array = [x, y + h - 5/2, x + w / 8, y + h - 5/4, x + w/4, y + h - 5/4, x + w/2, y + h - 5 / 2, x + 3*w / 4, y + h - 15/4, x + w, y + h - 5/2];
			break;
		case '=':
			// strFormat = "M{x0},{y0}L{x1},{y1}M{x2},{y2}L{x3},{y3}";
			array = [x, y + h - 1, x + w, y + h - 1, x, y + h - 4, x + w, y + h - 4];
			break;
		case '.':
			// x = array[0],
			// y = array[1],
			// r = array[2];
			array = [x + w / 2, y + h - 3.5, 2.5];
			// return drawCircle(svg, array, attrs);
			break;
		case '。':

			array = [x + w / 2, y + h - 3.5, 2.5];
			break;
		case '°':
			return drawCircle(svg, array, attrs);
			break;
		default:
			break;
	}

	drawOver(s, array, type);

	offset.top -= 5;
	if(el.childNodes.length){
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			drawBox(item, s, offset);
			break;
		};
	}
	offset.top += 5;
	// offset.top -= marginTop / 2;
}

function drawMunderOver(el, svg, offset, clientRect){
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	
	var myBox = {};

	//这个是中间的那个元素，这个是正常的状态
	var fbox = caculateBox(el.childNodes[0], {width: 0, height: defaultHeight});
	//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
	var sbox = caculateBox(el.childNodes[1], {width: 0, height: defaultHeight - 4});
	//这个是上面的那个元素
	var tbox = caculateBox(el.childNodes[2], {width: 0, height: defaultHeight - 4});
	var bwidth = fbox.width > sbox.width ? fbox.width: sbox.width;
	myBox.width = bwidth > tbox.width ? bwidth : tbox.width;
	myBox.height = fbox.height + sbox.height + tbox.height + 2;
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;

	// offset.top += marginTop / 2;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	// offset.top -= 5;
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	var _oldTop = offset.top, _oldLeft = offset.left;
	offset.left += (myBox.width - tbox.width) / 2;
	drawBox(el.childNodes[2], s, offset);
	offset.top += tbox.height;
	offset.left = _oldLeft + (myBox.width - fbox.width) / 2;
	drawBox(el.childNodes[0], s, offset);
	offset.top += fbox.height - 4;
	offset.left = _oldLeft + (myBox.width - sbox.width) / 2;
	drawBox(el.childNodes[1], s, offset);
	offset.top = _oldTop;
	offset.left = _oldLeft + myBox.width;
	// offset.top -= marginTop / 2;
}

function drawMsup(el, svg, offset, clientRect){
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;
	// offset.top += marginTop / 2;
	//主元素
	drawBox(el.childNodes[0], svg, offset);
	offset.top -= 7;
	// setSup(el.childNodes[1]);
	drawBox(el.childNodes[1], svg, offset);
	// offset.top -= marginTop / 2;
	offset.top += 7;
}

function drawMsub(el, svg, offset, clientRect){
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};

	//主元素
	drawBox(el.childNodes[0], svg, offset);
	offset.top += 5;
	drawBox(el.childNodes[1], svg, offset);
	offset.top -= 5;
}

function drawMsubsup(el, svg, offset, clientRect){
	var s = svg || Snap();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var myBox = {};
	//这个是中间的那个元素，这个是正常的状态
	var fbox = caculateBox(el.childNodes[0], {width: 0, height: defaultHeight});
	//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
	var sbox = caculateBox(el.childNodes[1], {width: 0, height: defaultHeight - 4});
	//这个是上面的那个元素
	var tbox = caculateBox(el.childNodes[2], {width: 0, height: defaultHeight - 4});
	myBox.width = fbox.width + (sbox.width > tbox.width ? sbox.width: tbox.width);
	myBox.height = fbox.height + sbox.height - 10 + tbox.height - 10;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
	var originLeft = offset.left;
	var marginTop = myPBox.height - myBox.height;
	offset.top += 5;
	//主元素
	drawBox(el.childNodes[0], svg, offset);
	offset.top += 8;
	var _curLeft = offset.left;
	//下面的元素
	drawBox(el.childNodes[1], svg, offset);
	//上面的元素
	offset.left = _curLeft;
	offset.top -= 16;
	drawBox(el.childNodes[2], svg, offset);
	// offset.top -= marginTop / 2;
	offset.top += 8;
	offset.left = originLeft + myBox.width;
}

function drawMspace(el, svg, offset, clientRect){
	var myWidth = el.getAttribute('width');
	var myHeight = el.getAttribute('height');
	var linebreak = el.getAttribute('linebreak');
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
	myWidth = myWidth ? Number(myWidth.replace('px', '')) : 0;
	myHeight = myHeight ? Number(myHeight.replace('px', '')): defaultHeight;
	var marginTop = myPBox.height - myHeight;
	// offset.top += marginTop / 2;
	if(linebreak === 'newline'){
		var pNode = el.parentNode;
		var index = 0;
		while(pNode.childNodes.item(index) != el){
			index++;
		}
		var offLeft = 0;
		var maxHeight = 0;
		for(var i = 0; i < index; i++){
			var item = pNode.childNodes[i];
			var siblingBox = caculateBox(item, {width: 0, height: defaultHeight});
			offLeft += siblingBox.width;
			maxHeight = maxHeight > siblingBox.height ? maxHeight : siblingBox.height;

		}

		offset.left -= offLeft;
		offset.top += maxHeight;
		offset.left = offset.left < 0 ? 0 : offset.left;
		drawRect(svg, [offset.left, offset.top, Number(myWidth), Number(myHeight)], {fill: 'red', stroke: 'none'});
		offset.left += Number(myWidth);
		return;
	}

	drawRect(svg, [offset.left, offset.top, Number(myWidth), Number(myHeight)], {fill: '#bada55', stroke: 'none'});
	offset.left += Number(myWidth);
}

function getLastChild(el){
	if(!el || !el.childNodes || !el.childNodes.length){
		console.log('获取最后元素错误！');
		return null;
	}
	var baseName = ['mi', 'mo', 'mn', 'mtext'];
	if(baseName.indexOf(el.tagName) !== -1){
		return el;
	}

	return getLastChild(el.lastChild);
}

function setSup(el){
	if(el.nodeType === 3){
		return;
	}
	el.setAttribute('fontSize', '12px');
	if(el.childNodes && el.childNodes.length){
		for(var i = 0, len = el.childNodes.length; i < len; i++){
			setSup(el.childNodes[i]);
		}
	}
}


function drawCommon(el, svg, offset){
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		drawBox(item, svg, offset);
	};
}

function drawBaseText(svg, x, y, text, attrs){

	svg.text(x, y, text).attr(attrs);
}

function drawText(svg, array, text){
	svg.text(array[0], array[1], text);
}


/**
 * /
 * @param  {svg element} svg svg上下文，
 * @param  {array} array 定义根号的位置，
 * @param  {array} attrs 设置属性
 * @return {path element} p1 返回p1根号对象
 */
function drawSqrt(svg,array, attrs){

	var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5],
	    x3: array[6],
	    y3: array[7],
	    x4: array[8]
	};

	//string format
	var strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}";

	//default attrs
	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    attrs = attrs || {};

	//画根号
	var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}

/**
 * /
 * @param  {svg element} svg   svg上下文
 * @param  {array} array 路径数据
 * @param  {fence type} type  mfence类型，默认是"("。有"(、[、{、|、||"
 * @param  {attributes} attrs 元素的属性
 * @return {path element} p1  返回路径
 */
function drawFence(svg, array, type, attrs){
	var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5]
	};

	var mfenceType = {
			'(': '(',
			'{': '{',
			'[': '[',
			'|': '|',
			'||': '||',
			'verticalBar': '|',
			'parenthesis': '(',
			'squareBracket': '[',
			'curlyBracket': '{',
			')': '(',
			'}': '{',
			']': '['
		}

	type = mfenceType[type] || '(';

	//string format
	var strFormat = "M{x},{y}Q{x1},{y1},{x2},{y2}";

	//default attrs
	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    attrs = attrs || {};
    // var defaultOpts = $.clone(true, defaultOpts, attrs);

    switch(type){
    	case '(':
    		matrix = {
			    x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			    y2: array[5]
			};
    		strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
    		break;
    	case '[':
    		matrix = matrix = {
			    x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			};
    		strFormat = "M{x0},{y0}H{x1}V{y1}H{x2}";
    		break;
    	case '{':
    		strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}T{x3},{y3}L{x},{y}M{x4},{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x},{y}";
    		var num = 7;
    		var j = 0;

    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3],
    			x2: array[4],
    			y2: array[5],
    			x3: array[6],
    			y3: array[7],
    			x: array[8],
    			y: array[9],
    			x4: array[10],
    			y4: array[11],
    			x5: array[12],
    			y5: array[13],
    			x6: array[14],
    			y6: array[15],
    			x7: array[16],
    			y7: array[17]

    		}
    		// for (var i = 0; i <= num;i++) {
    		// 	if(i !== 4){
	    	// 		matrix['x'+i] = array[j];
	    	// 		matrix['y'+i] = array[j+1];
    		// 	}else{
    		// 		matrix['x'] = array[j];
    		// 		matrix['y'] = array[j+1];
    		// 	}
    		// 	j = j + 2;
    		// };
    		// j = 0;
    		//strFormat = "M{x0},{y0}L{x1},{y1}Q{x2},{y2},{x3},{y3}L{x4}{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x8},{y8}Q{x9},{y9},{x10},{y10}L{x11},{y11}";
    		break;
    	case '|':
    		strFormat = "M{x0},{y0}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			y1: array[2]
    		};
    		break;
    	case '||':
    		strFormat = "M{x0},{y0}V{y1}M{x2}{y2}V{y3}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			y1: array[2],
    			x2: array[3],
    			y2: array[4],
    			y3: array[5]
    		};
    		break;
    	default: 
    		matrix = {
			    x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			    y2: array[5]
			};
    		strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
    		break;
    }

	var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}

/**
 * /
 * @param  {svg element} svg   svg上下文
 * @param  {array} array 路径数据
 * @param  {fence type} type  enclose类型。详见encloseType
 * @param  {attributes} attrs 元素的属性
 * @return {path element} p1  返回路径
 */
function drawEnclose(svg, array, type, attrs){
	var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5],
	    x3: array[6]
	};

	//string format
	var strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}H{x3}";

	//default attrs
	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    var encloseType = {
    	"longdiv": "longdiv",
    	"actuarial":"actuarial",
    	"radical": "radical",
    	"box": "box",
    	"roundedbox": "roundedbox",
    	"circle": "circle",
    	"left": "left",
    	"right": "right",
    	"top": "top",
    	"bottom": "bottom",
    	"updiagonalstrike": "updiagonalstrike",
    	"downdiagonalstrike": "downdiagonalstrike",
    	"verticalstrike": "verticalstrike",
    	"horizontalstrike": "horizontalstrike",
    	"madruwb": "madruwb",
    	"updiagonalarrow": "updiagonalarrow",
    	"phasorangle": "phasorangle"
    }

    type = encloseType[type] || "longdiv";

    attrs = attrs || {};
    // var defaultOpts = $.clone(true, defaultOpts, attrs);

    switch(type){
    	case "longdiv":
    		strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}H{x3}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3],
    			x2: array[4],
    			y2: array[5],
    			x3: array[6]
    		};
    		break;
    	case "actuarial":
    		strFormat = "M{x0},{y0}H{x1}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3]
    		};
    		break;
    	case "radical":
			strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}";
    		matrix = {
			    x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			    y2: array[5],
			    x3: array[6],
			    y3: array[7],
			    x4: array[8]
			};
    		break;
    	case "box":
    		return drawRect(svg, array, attrs);
    		break;
    	case "roundedbox":
    		return drawRect(svg, array, attrs);
    		break;
    	case "circle":
    		return drawEllipse(svg, array, attrs);
    		break;
    	case "left":
    		strFormat = "M{x0},{y0}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			y1: array[2]
    		};
    		break;
    	case "right":
    		strFormat = "M{x0},{y0}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			y1: array[2]
    		};
    		break;
    	case "top":
    		strFormat = "M{x0},{y0}H{x1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2]
    		};
    		break;
    	case "bottom":
    		strFormat = "M{x0},{y0}H{x1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2]
    		};
    		break;
    	case "updiagonalstrike":
    		strFormat = "M{x0},{y0}L{x1},{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3]
    		};
    		break;
    	case "downdiagonalstrike":
    		strFormat = "M{x0},{y0}L{x1},{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3]
    		};
    		break;
    	case "verticalstrike":
    		strFormat = "M{x0},{y0}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			y1: array[2]
    		};
    		break;
    	case "horizontalstrike":
    		strFormat = "M{x0},{y0}H{x1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2]
    		};
    		break;
    	case "madruwb":
    		strFormat = "M{x0},{y0}H{x1}V{y1}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3]
    		};
    		break;
    	case "updiagonalarrow":
    		strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}M{x1},{y1}L{x3},{y3}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3],
    			x2: array[4],
    			y2: array[5],
    			x3: array[6],
    			y3: array[7]
    		};
    		break;
    	case "phasorangle":
    		strFormat = "M{x0},{y0}L{x1},{y1}H{x2}";
    		matrix = {
    			x0: array[0],
    			y0: array[1],
    			x1: array[2],
    			y1: array[3],
    			x2: array[4]
    		};
    		break;
    }

	var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}
/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}       矩形
 */
function drawRect(svg, array, attrs){
	var x = array[0],
		y = array[1],
		w = array[2],
		h = array[3],
		rx = array[4],//圆角半径
		ry = array[5];

	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    attrs = attrs || {};
    defaultOpts.fill = attrs.fill || defaultOpts.fill;
	defaultOpts.stroke = attrs.stroke || defaultOpts.stroke;
	var rect = svg.rect(x, y, w, h, rx, ry).attr(defaultOpts);
	return rect;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}      圆形
 */
function drawCircle(svg, array, attrs){
	var x = array[0],
		y = array[1],
		r = array[2];

	var defaultOpts = {
		fill: 'none',
        stroke: "#bada55"
    }
	attrs = attrs || {};
	defaultOpts.fill = attrs.fill || defaultOpts.fill;
	defaultOpts.stroke = attrs.stroke || defaultOpts.stroke;

	var circle = svg.circle(x, y, r).attr(defaultOpts);
	return circle;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}       椭圆形
 */
function drawEllipse(svg, array, attrs){
	var x = array[0],
		y = array[1],
		rx = array[2],
		ry = array[3];

	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }
	attrs = attrs || {};

	var ellipse = svg.ellipse(x, y, rx, ry).attr(defaultOpts);
	return ellipse;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}       画分数，如：a/b
 */
function drawFrac(svg, array, attrs){
	var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3]
	};

	//string format
	var strFormat = "M{x0},{y0}L{x1},{y1}";

	//default attrs
	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    attrs = attrs || {};

	var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);
	return p1;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} type  [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}      上方类型的
 */
function drawOver(svg, array, type, attrs){
	var moverType = {
		'{': '{',
		'(': '(',
		')': '(',
		'}': '{',
		'-': '_',
		'_': '_',
		'^': '^',
		'~': '~',
		'=': '=',
		'.': '.',
		'。': '。',
		'°': '°'
	}

	type = moverType[type] || '(';
	var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5]
	};

	//string format
	var strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
	switch(type){
		case '(':
			break;
		case '{':
			var num = 11;
    		var j = 0;
    		for (var i = 0; i <= num;i++) {
    			matrix['x'+i] = array[j];
    			matrix['y'+i] = array[j+1];
    			j = j + 2;
    		};
    		j = 0;
    		strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}T{x3},{y3}Q{x4},{y4},{x5},{y5}M{x6},{y6}Q{x7},{y7},{x8},{y8}T{x9},{y9}Q{x10},{y10},{x11},{y11}";
    		// strFormat = "M{x0},{y0}L{x1},{y1}Q{x2},{y2},{x3},{y3}L{x4}{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x8},{y8}Q{x9},{y9},{x10},{y10}L{x11},{y11}";
			break;
		case '_':
			strFormat = "M{x0},{y0}H{x1}";
			matrix = {
				x0: array[0],
				y0: array[1],
				x1: array[2]
			};
			break;
		case '^':
			strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}";
			break;
		case '~':
			strFormat = "M{x0},{y0}C{x1},{y1},{x2},{y2},{x3},{y3}S{x4},{y4},{x5},{y5}";
			var num = 6;
    		var j = 0;
    		for (var i = 0; i < num;i++) {
    			matrix['x'+i] = array[j];
    			matrix['y'+i] = array[j+1];
    			j = j + 2;
    		};
    		j = 0;
			break;
		case '=':
			strFormat = "M{x0},{y0}L{x1},{y1}M{x2},{y2}L{x3},{y3}";
			matrix = {
				x0: array[0],
				y0: array[1],
				x1: array[2],
				y1: array[3],
				x2: array[4],
				y2: array[5],
				x3: array[6],
				y3: array[7]
			};
			break;
		case '.':
			attrs = attrs || {};
			attrs.fill = '#bada55';
			return drawCircle(svg, array, attrs);
			break;
		case '。':
			return drawCircle(svg, array, attrs);
			break;
		case '°':
			return drawCircle(svg, array, attrs);
			break;
		default:
			break;
	}
	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }

    attrs = attrs || {};
    // var defaultOpts = $.clone(true, defaultOpts, attrs);

	var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array [description]
 * @param  {[type]} type  [description]
 * @param  {[type]} attrs [description]
 * @return {[type]}       箭头
 */
function drawArrow(svg, array, type, attrs){
	var arrowType = {
		'←': '←',
		'→': '←',
		'↔': '↔',
		'↙': '←',
		'↘': '←',
		'↖': '←',
		'↗': '←'
	}

	type = arrowType[type] || '←';

	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }
    var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5],
	    x3: array[6],
	    y3: array[7]
	};

	//string format
	var strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}M{x1},{y1}L{x3},{y3}";

    attrs = attrs || {};
    var defaultOpts = $.clone(true, defaultOpts, attrs);

    switch(type){
    	case '←':
    		break;
    	case '↔':
    		strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}M{x1},{y1}L{x3},{y3}M{x4},{y4}L{x5},{y5}L{x6},{y6}M{x7},{y7}L{x8},{y8}";
    		matrix = {};
    		break;
    }

    var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}


//积分、和
function drawSumAndIntegration(svg, array, type, attrs){
	var arrowType = {
		'sum': 'sum',
		'integration': 'integration',
		'product': 'product'
	}

	type = arrowType[type] || 'sum';

	var defaultOpts = {
        fill: "none",
        stroke: "#bada55"
    }
    var matrix = {
	    x0: array[0],
	    y0: array[1],
	    x1: array[2],
	    y1: array[3],
	    x2: array[4],
	    y2: array[5],
	    x3: array[6],
	    y3: array[7],
	    x4: array[8],
	    y4: array[9],
	    x5: array[10],
	    y5: array[11]
	};

	//string format
	var strFormat = "M{x0},{y0}V{y2}H{x2}L{x3}{y3}L{x4}{y4}H{x5}V{y5}";

    attrs = attrs || {};
    var defaultOpts = $.clone(true, defaultOpts, attrs);

    switch(type){
    	case 'sum':
    		break;
    	case 'integration':

    		//积分，分成上下2部分画。
    		strFormat = "M{x0}{y0},Q{x1},{y1},{x2},{y2}T{x3},{y3}M{x4},{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}";
    		matrix = {
    			x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			    y2: array[5],
			    x3: array[6],
			    y3: array[7],
			    x4: array[8],
			    y4: array[9],
			    x5: array[10],
			    y5: array[11],
			    x6: array[12],
			    y6: array[13],
			    x7: array[14],
			    y7: array[15]
    		};
    		break;
    	case 'product':
    		strFormat = "M{x0}{y0}H{x1}M{x2}{y2}V{y3}H{x4}H{x5}M{x6}{y6}V{y7}H{x8}H{x9}";
    		matrix = {
    			x0: array[0],
			    y0: array[1],
			    x1: array[2],
			    y1: array[3],
			    x2: array[4],
			    y2: array[5],
			    y3: array[6],
			    x4: array[7],
			    x5: array[8],
			    x6: array[9],
			    y6: array[10],
			    y7: array[11],
			    x8: array[12],
			    x9: array[13],
    		};
    }
    //积分
    //s.path("M100 100,Q97 97 94 100T94 120M88 140Q91 143 94 140T94 120")
    var p1 = svg.path(Snap.format(strFormat, matrix)).attr(defaultOpts);

	return p1;
}