function caculateBox(el, box){

	if(!el){
		return box;
	}
	var tagName = el.tagName;
	var _box;

	switch(tagName){
		case "mi":

			_box = new Mi(el).getBox2();
			box.width += _box.width || 0;
			break;
		case "mo":
			_box = new Mi(el).getBox2();
			box.width += _box.width || 0;
			break;
		case "mn":
			_box = new Mi(el).getBox2();
			box.width += _box.width || 0;
			break;
		case 'mtext':
			_box = new Mi(el).getBox2();
			box.width += _box.width || 0;
			break;
		case 'mover':
			box.height += 5;
			var lbox = caculateBox(el.firstChild, {width: 0, height: defaultHeight});
			box.width += lbox.width;
			break;
		case 'munder':
			box.height += 5;
			var lbox = caculateBox(el.firstChild, {width: 0, height: defaultHeight});
			box.width += lbox.width;
			break;
		case 'mroot':
			var fbox = {
				width: 0,
				height: defaultHeight
			}
			var sbox = {
				width: 0,
				height: defaultHeight
			}

			if(el.firstChild.tagName === 'mspace'){
				fbox.height = 0;
			}

			if(el.lastChild.tagName === 'mspace'){
				sbox.height = 0;
			}else if(el.getAttribute('fontSize')){
				var fontSize = el.getAttribute('fontSize').replace('px', '');
				
				sbox.height = Number(fontSize) + 2;
			}
			caculateBox(el.firstChild, fbox);
			caculateBox(el.lastChild, sbox);

			box.width += fbox.width + 5 + sbox.width;
			var iheight = (sbox.height + fbox.height / 3) - fbox.height;
			var mHeight = fbox.height > iheight ? fbox.height : iheight;
			box.height = box.height > mHeight ? box.height : mHeight + 2;
			break;
		case 'mtable':
			var _box = {height: 0, width: 0};
			// box.height -= box.height;
			
			var mtrArrs = [];
			for (var k = 0, len1 = el.childNodes.length; k < len1; k++) {
				var myChild = el.childNodes[k];
				if(myChild.tagName === 'mtr'){
					//获取每列的宽高，为后续表格布局准备
					var arr = [];
					for(var m = 0, lenm = myChild.childNodes.length; m < lenm; m++){
						var tdbox = caculateBox(myChild.childNodes[m], {width: 0, height: defaultHeight});
						arr.push(tdbox);
					}
					mtrArrs.push(arr);
				}
			};

			for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
				var myChild = el.childNodes[j];
				if(myChild.tagName === 'mtr'){
					var trbox = caculateBox(myChild, {width: 0, height: defaultHeight, mtrArrs: mtrArrs});
					_box.height += trbox.height + 0;//0暂时设置列表行高为0.
					_box.width = _box.width > trbox.width ? _box.width : trbox.width;
				}
			};

			box.height = box.height > _box.height ? box.height : _box.height;

			box.width += _box.width;
			break;
		case 'mtr':
			//mtd之间的间距
			var tdMargin = 2;
			var mtrMarginBottom = 5;
			var _box = {height: 0, width: 0};
			for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
				var myChild = el.childNodes[j];
				if(myChild.tagName === 'mtd'){
					var tdWidth = getMaxWidth(box.mtrArrs, j);
					var tdbox = caculateBox(myChild, {width: 0, height: defaultHeight});
					_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
					_box.width += tdbox.width > tdWidth ? tdbox.width : tdWidth + tdMargin;
				}
			};

			box.height = (box.height > _box.height ? box.height : _box.height) + mtrMarginBottom;
			box.width += _box.width;
			break;
		case 'mfrac':
			var fbox = caculateBox(el.childNodes[0], {width: 0, height: defaultHeight});
			var sbox = caculateBox(el.childNodes[1], {width: 0, height: defaultHeight});
			box.width += fbox.width > sbox.width ? fbox.width + 1 : sbox.width + 1;
			
			var mHeight = fbox.height + sbox.height + 5;
			box.height = box.height > mHeight ? box.height : mHeight;
			break;
		case 'munderover':
			//这个是中间的那个元素，这个是正常的状态
			var fbox = caculateBox(el.childNodes[0], {width: 0, height: defaultHeight});
			//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
			var sbox = caculateBox(el.childNodes[1], {width: 0, height: defaultHeight - 4});
			//这个是上面的那个元素
			var tbox = caculateBox(el.childNodes[2], {width: 0, height: defaultHeight - 4});
			var bwidth = fbox.width > sbox.width ? fbox.width: sbox.width;
			box.width += bwidth > tbox.width ? bwidth : tbox.width;
			 
			var mHeight = fbox.height + sbox.height + tbox.height;
			box.height = box.height > mHeight ? box.height : mHeight;
			break;
		case 'msup':
			setSup(el.childNodes[1]);
			var _box = {width: 0, height: 0};
			for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
				var myChild = el.childNodes[j];
				var tdbox = caculateBox(myChild, {width: 0, height: defaultHeight});
				_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
				_box.width += tdbox.width;
			};
			box.height = box.height > _box.height ? box.height : _box.height;
			box.width += _box.width;
			break;
		case 'mspace':
			var linebreak = el.getAttribute('linebreak');
			var breakType = ['newline', 'goodbreak', 'auto', 'badbreak', 'nobreak'];
			var width = el.getAttribute('width'), height = el.getAttribute('height');
			width = width ? Number(width.replace('px', '')) : 0;
			//默认计算是传入的height值为defaultHeight;
			height = height ? Number(height.replace('px', '')) : defaultHeight;
			
			if(breakType.indexOf(linebreak) !== -1){
				box.height += height;
			}else{
				box.height = box.height > height ? box.height : height;
				box.width += width;
			}
			break;
		case 'mspace':
			var linebreak = el.getAttribute('linebreak');
			var breakType = ['newline', 'goodbreak', 'auto', 'badbreak', 'nobreak'];
			var width = el.getAttribute('width'), height = el.getAttribute('height');
			width = width ? Number(width.replace('px', '')) : 0;
			height = height ? Number(height.replace('px', '')) : defaultHeight;
			if(linebreak === 'newline'){
				var myPNode = el.parentNode;
				var index = 0;
				while(myPNode.childNodes.item(index) != el){
					index++;
				}
				var preBox = {width: 0, height: defaultHeight};
				for(var l = 0; l < index; l++){
					var item = myPNode.childNodes[l];
					if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
						var iwidth = item.getAttribute('width'), iheight = el.getAttribute('height');
						iwidth = iwidth ? Number(iwidth.replace('px', '')) : 0;
						iheight = iheight ? Number(iheight.replace('px', '')) : defaultHeight;
						preBox.width = preBox.width > iwidth ? preBox.width : iwidth;
						preBox.height += iheight;
					}else{
						var nItemBox = caculateBox(item, {width: 0, height: defaultHeight});
						preBox.width += nItemBox.width;
						preBox.height = preBox.height > nItemBox.height ? preBox.height : nItemBox.height;
					}
				}
				var nextBox = {width: 0, height: defaultHeight};
				for(l = l+1;l < myPNode.childNodes.length; l++){
					var item = myPNode.childNodes[l];
					if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
						var iwidth = item.getAttribute('width'), iheight = el.getAttribute('height');
						iwidth = iwidth ? Number(iwidth.replace('px', '')) : 0;
						iheight = iheight ? Number(iheight.replace('px', '')) : defaultHeight;
						nextBox.height += iheight;
						nextBox.width = nextBox.width > iwidth ? nextBox.width : iwidth;
					}else{
						var nItemBox = caculateBox(item, {width: 0, height: defaultHeight});
						nextBox.width += nItemBox.width;
						nextBox.height = nextBox.height > nItemBox.height ? nextBox.height : nItemBox.height;
						
					}
				}
				box.height += height > nextBox.height ? height : nextBox.height;
				box.width -= preBox.width;
				box.width += preBox.width > (width + nextBox.width) ? preBox.width : (width+nextBox.width);
			}else{
				box.height += height / 2;
				box.width += width;
			}
			break;
		default:
			//由于换行的存在，这里先保存之前计算的盒子宽度
			var old_width = box.width; 
			var old_height = box.height;
			for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
				var myChild = el.childNodes[j];
				var tdbox = caculateBox(myChild, box);
			};

			var mspaces = el.getElementsByTagName && el.getElementsByTagName('mspace');
			//先检查是否包含mspace，换行标签，没有的话计算下面的，有就计算，
			
			//这样可以避免在计算完下面的一个的时候，突然遇到mspace，而又要重新计算一遍
			if(mspaces && mspaces.length){
				var rowWidth = [], mspacePos = [];
				var nodes = el.childNodes;

				//此处认为取到的mspace元素是按先后顺序的，如果是这样则可以节省循环时间
				var pos = 0;
				for(var i = 0, len = mspaces.length; i < len; i++){
					var ispace = mspaces[i];
					//排除不是直接父元素和非linebreak属性的mspace
					if(ispace.parentNode == el && ispace.getAttribute("linebreak")){
						while(nodes.item(pos) !== mspaces[i] && pos < nodes.length){
							pos++;
						}
						mspacePos.push(pos);
					}
				}
				//为保证还是排下顺序
				// mspacePos.sort();
				var lineMspaceHeight = [];

				for(var k = 0; k < mspacePos.length + 1; k++){
					rowWidth[k] = {totalW: 0, maxRowHeight: 0};
					
					//获取上一个mspace，如果存在，则计算他的高度，否则不计算
					var postion = mspacePos[k-1];
					var imspace = postion != null ? nodes[postion] : null;
					var _lineHeight = 0;
					if(imspace){
						_lineHeight = caculateBox(imspace, {width: 0, height: 0}).height;
					}

					var end = mspacePos[k] ? mspacePos[k] : nodes.length;
					var j = mspacePos[k - 1] ? mspacePos[k - 1] + 1 : 0;
					//计算当前mspace前面的所有兄弟元素的宽度，并累加，作为当前mspace分行前的一行长度，
					//并获取当前mspace前面一行的最高高度。与上面计算的imspace的高度作比较。
					for(; j < end;j++){
						var _preBox = caculateBox(nodes[j], {width: 0, height: defaultHeight});
						rowWidth[k].totalW += _preBox.width;
						rowWidth[k].maxRowHeight = rowWidth[k].maxRowHeight > _preBox.height ? rowWidth[k].maxRowHeight : _preBox.height;
						rowWidth[k].maxRowHeight = rowWidth[k].maxRowHeight > _lineHeight ? rowWidth[k].maxRowHeight : _lineHeight; 
					}
				}

				var maxRowWidth = 0;
				var rowHeight = 0;
				for(var l = 0; l < rowWidth.length; l++){
					maxRowWidth = maxRowWidth > rowWidth[l].totalW ? maxRowWidth : rowWidth[l].totalW;
					rowHeight += rowWidth[l].maxRowHeight;
				}

				//重置当前盒子的宽度
				box.width = old_width + maxRowWidth;
				//此处需要考虑换行导致的行高影响，所以需要计算并比较行高
				box.height = box.height > rowHeight ? box.height : rowHeight;
			}else{
				
			}


			if(el.tagName === 'mfenced'){
				box.width += 16;
			}else if(el.tagName === 'msqrt'){
				box.width += 5;
			}else if(el.tagName === 'mroot'){
				box.width += 5;
			}else if(el.tagName === 'menclose'){
				box.width += 14;
				box.height += 3;
			}else if(el.tagName === 'mtd' && el.nextSibling && el.nextSibling.tagName === 'mtd'){
				box.width += 2;
			}

			break;
	}
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

	var offset_left = offset.left;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
			offset.left = offset_left;
		}
		drawBox(item, s, offset);
	};

	return s;
}
//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<mfenced open="[" close="]"><mrow/></mfenced></math>
//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<mfenced open="[" close="]"><mn>2</mn></mfenced></math>
function drawMfenced(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	var typeOpen = el.getAttribute('open') || '[', typeClose = el.getAttribute('close') || ']';

	if(clientRect){
		s.attr(clientRect);
	}
	// var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	// myBox.width += 2;

	// var marginTop = myPBox.height - myBox.height;
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var old_top = offset.top;
	var old_left = offset.left;
	var baseline = getBaseLine(el);

	offset.top += baseline;
	var x = offset.left || 0, y = offset.top ? offset.top: 0, h = myBox.height;


	//"M{x0},{y0}H{x1}V{y1}H{x2}"
	//默认使用"[]"
	var arrayOpen = [x+5, y, x, y + h, x+5];
	var arrayClose = [x+myBox.width - 6, y, x + myBox.width, y + h, x+myBox.width-6];
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
	offset.left += 7;
	x = x-5;
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
		var offset_left = offset.left;
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
				offset.left = offset_left;
			}
			drawBox(item, s, offset);
		};
	}
	offset.left += 8;
	offset.top -= baseline;
	offset.top = old_top;
	offset.left = old_left + myBox.width;
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
			var baseline = getBaseLine(el);
			offset.top += baseline;
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			offset.top -= baseline;
			break;
		case 'mn':
			var fontSize = el.getAttribute('fontSize');
			var box = {width: 0, height: defaultHeight};
			if(fontSize){
				box.height = Number(fontSize.replace('px', ''));
			}
			var myBox = caculateBox(el, box);
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var baseline = getBaseLine(el);
			offset.top += baseline;
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			offset.top -= baseline;
			break;
		case 'mo':
			var box = {width: 0, height: defaultHeight};
			var myBox = caculateBox(el, box);
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});
			var baseline = getBaseLine(el);
			offset.top += baseline;
			var x = offset.left, y = offset.top + myBox.height - 3; //+ (myPBox.height - myBox.height) / 2 + myBox.height - 3;

			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			offset.top -= baseline;
			break;
		case 'mtext':
			var box = {width: 0, height: defaultHeight};
			var myBox = caculateBox(el, box);
			var fontSize = el.getAttribute('fontSize');
			var attrs = fontSize ? {'font-size': fontSize} : {};
			var baseline = getBaseLine(el);
			offset.top += baseline;
			var x = offset.left, y = offset.top + myBox.height - 3;
			drawBaseText(svg, x, y, el.textContent, attrs);
			offset.left += myBox.width;
			offset.top -= baseline;
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
	return svg;
}

function drawMroot(el, svg, offset){
	svg = svg || Snap();
	var s = svg.g();
	//只接受2个子元素
	var fChild = el.firstChild;
	var sChild = el.lastChild;
	setSup(sChild);
	var myBox = caculateBox(el, {width: 0, height: defaultHeight});
	var fbox = caculateBox(fChild, {width: 0, height: defaultHeight});
	var sbox = caculateBox(sChild, {width: 0, height: 10});
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	//居中显示的行高
	var baseline = getBaseLine(el);
	var _oldTop = offset.top;
	var _oldLeft = offset.left;

	offset.top += baseline;
	var x = offset.left || 0,
		y = offset.top > 0 ? offset.top : 0, 
		h = fbox.height, 
		w = fbox.width;
	//一个字符宽度
	x += sbox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + 2*h/3, x + 1, y + 2*h/3 - 2, x + 5/2, y + h, x + 5, y + 1, x+w+5];

    drawSqrt(s,array);
    offset.left = _oldLeft;
    offset.top += y + 2*h/3 - 2 - 2*sbox.height;
    drawBox(sChild, s, offset);
    offset.left += 5;
    offset.top = _oldTop + 2;
    drawBox(fChild, s, offset);
    offset.top = _oldTop;
    offset.left = _oldLeft + myBox.width;
    return s;
}

function drawMstyle(el, svg, offset){
	svg = svg || Snap();
	// var s = svg.g();
	if(!offset){
		offset = {left: 0, top: 0, right: 0, bottom: 0};
	}
	var offset_left = offset.left;
	var offset_top = offset.top;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
			offset.left = offset_left;
		}
		drawBox(item, svg, offset);
	};

	offset.top = offset_top;
	offset.left = offset_left;
}

function drawMtd(el, svg, offset){
	svg = svg || Snap();
	var s = svg.g();
	// 当前的起始位置
	var baseline = getBaseLine(el);

	//保存当前起始点
	var start_offset_left = offset.left;
	var _mold_top = offset.top;

	offset.top += baseline;
	var myBox = caculateBox(el, {width: 0, height: defaultHeight});
	var offset_left = offset.tdWidth - myBox.width;
	console.log('当前列的最大宽度: ', offset.tdWidth, '差值： ', offset_left)
	//默认居中对齐
	offset.left +=  offset_left > 0 ? offset_left / 2 : 0;
	var _offset_left = offset.left;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
			offset.left = _offset_left;
		}
		drawBox(item, s, offset);
	};

	offset.left +=  offset_left > 0 ? offset_left / 2 : 0;

	//mtd之间的间隙
	var tdMargin = 2;
	//判断是否还有下一个，如果有，则加一个距离
	if(el.nextSibling && el.nextSibling.tagName === 'mtd'){
		offset.left += tdMargin;
		// drawVerticalLine(s, [offset.left - 1, _mold_top - 2, _mold_top + 2 * baseline + myBox.height + 7])
	}
	//还原当前起始点
	offset.top = _mold_top;
}

function drawMtr(el, svg, offset){
	svg = svg || Snap();
	var s = svg.g();
	var offset_left = offset.left;
	// var offset_top = offset_top.
	// var lineHeight = getLineHeight(el);

	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		//获取当前列的最大宽度
		offset.tdWidth = getMaxWidth(offset.mtrArr, i);
		
		drawBox(item, s, offset);
	};

	//如果还有兄弟mtr则变换高度
	if(el.nextSibling && el.nextSibling.tagName === 'mtr'){

		var _box = caculateBox(el, {width: 0, height: defaultHeight, mtrArrs: offset.mtrArr});
		// var _box = {height: 0, width: 0};
		// for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		// 	var myChild = el.childNodes[j];
		// 	if(myChild.tagName === 'mtd'){
		// 		var tdbox = caculateBox(myChild, {width: 0, height: defaultHeight});
		// 		_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
		// 		_box.width += tdbox.width;
		// 	}
		// };


		offset.top +=  _box.height + 1;//0暂时设置列表行高为0.
		// drawHorizontalLine(s, [offset_left - 3, offset.top, _box.width]);
		// offset.left = offset_left;
	}
}

function drawMtable(el, svg, offset){

	svg = svg || Snap();
	var s = svg.g();
	if(!offset){
		offset = {left: 0, top: 0, right: 0, bottom: 0};
	}
	var _box = {height: 0, width: 0};
	var mtrArr = [];
	var _box = caculateBox(el, {width: 0, height: defaultHeight});
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		var myChild = el.childNodes[j];
		//获取每列的宽高，为后续表格布局准备
		var arr = [];
		for(var m = 0, lenm = myChild.childNodes.length; m < lenm; m++){
			var tdbox = caculateBox(myChild.childNodes[m], {width: 0, height: defaultHeight});
			arr.push(tdbox);
		}
		mtrArr.push(arr);
	};
	//外框
	// drawRect(s,[offset.left, offset.top, _box.width, _box.height]);
	var _originTop = offset.top;
	var _oldLeft = offset.left;
	offset.mtrArr = mtrArr;
	offset.top += 2;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		offset.left += 3;
		drawBox(item, s, offset);
		offset.left = _oldLeft;//换行
	};

	// offset.mtrArr && delete offset.mtrArr;
	offset.top = _originTop;
	offset.left = _oldLeft + _box.width;
}

//<math xmlns="http://www.w3.org/1998/Math/MathML">
//<menclose notation="box"><mn>12</mn></menclose></math>
function drawMenclose(el, svg, offset, clientRect){
	//由于notation可以组合，这里暂时只画一个，不画组合的
	var type = el.getAttribute('notation') && el.getAttribute('notation').split(' ')[0];
	type = type || 'longdiv';

	svg = svg || Snap();
	var s = svg.g();
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	// myBox.width += 5,
	 myBox.height += 2;

	var baseline = getBaseLine(el);
	offset.top += baseline;
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
    		array = [x, y + 1, x + myBox.width - 5, y + h];
    		offset.left += 5;
    		break;
    	case "radical":
			// strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}";
    		array = [x, y + 2*h/3, x + 1, y + 2*h/3 - 2, x + 5/2, y + h, x + 5, y + 1, x+myBox.width];
    		offset.left += 5;
    		break;
    	case "box":
    		 // x = array[0],y = array[1],w = array[2],h = array[3],rx = array[4],//圆角半径ry = array[5];
    		array = [x + 2, y + 1, myBox.width - 4, h - 3];
    		offset.left += 2;
    		break;
    	case "roundedbox":
    		array = [x + 2, y + 1, myBox.width - 4, h - 3, 3, 3];
    		offset.left += 2;
    		break;
    	case "circle":
    		// cx = array[0],cy = array[1],rx = array[2],ry = array[3];
    		array = [(x + myBox.width)/2, y + (h / 2), myBox.width / 2 - 6, h / 2 - 2];
    		offset.left += 2;
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
    		array = [x + 2, y + h - 3, x + myBox.width - 2];
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
    		array = [x+2, y + h - 3, x + myBox.width - 2, y + 1];
    		offset.left += 2.5;
    		break;
    	case "updiagonalarrow":
    		// strFormat = "M{x0},{y0}L{x1},{y1}L{x2}{y2}M{x1}{y1}L{x3}{y3}";
    		array = [x + 2, y + h, x + myBox.width - 1, y + 1, x + myBox.width - 5, y + 8, x + myBox.width - 9, y];
    		offset.left += 2.5;
    		break;
    	case "phasorangle":
    		// strFormat = "M{x0},{y0}L{x1},{y1}H{x2}";
    		array = [x + 4, y + 1, x, y + h - 3, x + myBox.width];
    		offset.left += 5;
    		break;
    }

    drawEnclose(s, array, type);

    var mspacePosArray = [];
    //对type为circle的采取居中对齐
    if(type === 'circle'){
    	var iwidth = 0, iheight = 0;
    	for(var m = 0, len = el.childNodes.length; m < len; m++){
    		var mitem = el.childNodes[m];
    		if(mitem.tagName === 'mspace'){
				mspacePosArray.push({
					pos: m,
					width: iwidth,
					height: iheight
				});
				iwidth = iheight = 0;
    		}else{
    			var iBox = caculateBox(mitem, {width: 0, height: defaultHeight});
    			iwidth += iBox.width;
    			iheight = iheight > iBox.height ? iheight : iBox;
    		}
    	}

    	mspacePosArray.push({
			pos: m,
			width: iwidth,
			height: iheight
		});
    }

	var startOpts = mspacePosArray.shift();
	if(el.childNodes.length){
		var _offset_left = offset.left;
		if(startOpts){
			var offsetMargin = myBox.width - startOpts.width;
			offset.left += offsetMargin / 2;
		}
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
				offset.left = _offset_left;
				var startOpts = mspacePosArray.shift();
				if(startOpts){
					var offsetMargin = myBox.width - startOpts.width;
					offset.left += offsetMargin / 2;
				}
			}
			drawBox(item, s, offset);
		};
	}

	offset.top -= baseline;
}

function drawMsqrt(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el, box);
	myBox.width += 5;
	var baseline = getBaseLine(el);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	offset.top += baseline;
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + 2*h/3, x + 1, y + 2*h/3 - 2, x + 5/2, y + h, x + 5, y + 1, x+w];
    offset.left += 5;
    drawSqrt(s,array);

    if(el.childNodes.length){
		var _offset_left = offset.left;

		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
				offset.left = _offset_left;
			}
			drawBox(item, s, offset);
		};
	}
	offset.top -= baseline;
	return svg;
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

	var baseline = getBaseLine(el);
	offset.top += baseline;

	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + fbox.height + 2, x + w, y + fbox.height + 2];
    drawFrac(s,array);

	var _oldLeft = offset.left;
	var _oldTop = offset.top;
	offset.left += (w - fbox.width) / 2;

	var _offset_left = offset.left;
	
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
			offset.left = _offset_left;
		}
		drawBox(item, s, offset);
		offset.top += fbox.height + 2;//y + fbox.height + 2
		offset.left = _oldLeft + (w - sbox.width) / 2;
	};
	offset.top = _oldTop;
	offset.left = _oldLeft + w;
	offset.top -= baseline;
	return svg;
}

function drawMover(el, svg, offset, clientRect){
	var type = getLastChild(el).textContent || '(';

	if(type === '⏞'){
		type = '{';
	}else if(type === '⏜'){
		type = '(';
	}

	if(/&#x/i.test(type)){
		type = type.replace('&#x', '').replace(';', '');
		if (type === '23DC') {
			type = '(';
		}else if(type === '23DE'){
			type = '{';
		}
	}
	svg = svg || Snap();
	var s = svg.g();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	// var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	// var marginTop = myPBox.height - myBox.height;
	var baseline = getBaseLine(el);
	offset.top += baseline;
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
		case '→':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			array = [x, y + 2.5, x + w, x + w - 2, y + 3.5, x + w, y + 2.5, x + w - 2, y + 1.5];
			break;
		case '←':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			array = [x + w, y + 2.5, x, x + 2, y + 3.5, x, y + 2.5, x + 2, y + 1.5];
			break;
		case '↔':
			//M{x0},{y0}H{x1}L{x3},{y3}M{x4},{y4}L{x5},{y5}
			//M{x6},{y6}L{x7},{y7}L{x8},{y8}
			array = [x, y + 2.5, x + w, x + w - 2, y + 3.5, x + w, y + 2.5, x + w - 2, y + 1.5, x + 2, y + 1.5, x, y+2.5, x + 2, y+3.5];
			break;
		case '⇀':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x, y + 2.5, x + w, x + w - 2, y + 1.5];
			break;
		case '⇁':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x, y + 2.5, x + w, x + w - 2, y + 3.5];
			break;
		case '↼':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x + w, y + 2.5, x, x + 2, y + 1.5];
			break;
		case '↽':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x + w, y + 2.5, x, x + 2, y + 3.5];
			break;
		case '⇄':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrup = [x, y + 1.5, x + w, x + w - 2, y + 0.5, x + w, y + 1.5, x + w - 2, y + 2.5];
			var arrdown = [x + w, y + 3.5, x, x + 2, y + 2.5, x, y + 3.5, x + 2, y + 4.5];
			array = arrup.concat(arrdown);
			break;
		case '⇆':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x + w, y + 1.5, x, x + 2, y + 0.5, x, y + 1.5, x + 2, y + 2.5];
			var arrup = [x, y + 3.5, x + w, x + w - 2, y + 2.5, x + w, y + 3.5, x + w - 2, y + 4.5];
			array = arrdown.concat(arrup);
			break;
		case '⇇':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x + w, y + 1.5, x, x + 2, y + 0.5, x, y + 1.5, x + 2, y + 2.5];
			var arrup = [x + w, y + 3.5, x, x + 2, y + 2.5, x, y + 3.5, x + 2, y + 4.5];
			array = arrdown.concat(arrup);
			break;
		case '⇉':
			//⇋⇌⇍⇎⇏⇐⇒⇔⇚⇛⇜↽↼
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x, y + 1.5, x + w, x + w - 2, y + 0.5, x + w, y + 1.5, x + w - 2, y + 2.5];
			var arrup = [x, y + 3.5, x + w, x + w - 2, y + 2.5, x + w, y + 3.5, x + w - 2, y + 4.5];
			array = arrdown.concat(arrup);
			break;
		default:
			break;
	}

	drawOver(s, array, type);

	offset.top += 5;
	if(el.childNodes.length){
		var _offset_left = offset.left;
		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
				offset.left = _offset_left;
			}
			drawBox(item, s, offset);
			break;
		};
	}
	offset.top -= 5;
	offset.top -= baseline;
	return svg;

}

function drawMunder(el, svg, offset, clientRect){
	var type = getLastChild(el).textContent || '(';
	if(type === '⏞'){
		type = '{';
	}else if(type === '⏜'){
		type = '(';
	}

	if(/&#x/i.test(type)){
		type = type.replace('&#x', '').replace(';', '');
		if (type === '23DC') {
			type = '(';
		}else if(type === '23DE'){
			type = '{';
		}
	}

	svg = svg || Snap();
	var s = svg.g();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	var marginTop = myPBox.height - myBox.height;
	var baseline = getBaseLine(el);
	offset.top += baseline;
	offset.top += 5;
	var x = offset.left || 0, y = offset.top ? offset.top : 0, h = myBox.height, w = myBox.width;
	//"M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}"
	var array = [x, y + h - 5, x + w / 2, y + h, x + w, y+ h -5];
    

	//string format
	// var strFormat = "M{x0},{y0}Q{x1},{y1},{x2},{y2}";
	switch(type){
		case '(':
			break;
		case '{':
			//¨
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
		case '→':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			array = [x, y + h - 2.5, x + w, x + w - 2, y + h - 3.5, x + w, y + h - 2.5, x + w - 2, y + h - 1.5];
			break;
		case '←':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			array = [x + w, y + h - 2.5, x, x + 2, y + h - 3.5, x, y + h - 2.5, x + 2, y + h - 1.5];
			break;
		case '↔':
			//M{x0},{y0}H{x1}L{x3},{y3}M{x4},{y4}L{x5},{y5}
			//M{x6},{y6}L{x7},{y7}L{x8},{y8}
			array = [x, y + h - 2.5, x + w, x + w - 2, y + h - 3.5, x + w, y + h - 2.5, x + w - 2, y + h - 1.5, x + 2, y + h - 1.5, x, y+ h - 2.5, x + 2, y+ h - 3.5];
			break;
		case '⇀':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x, y + h - 2.5, x + w, x + w - 2, y + h - 3.5];
			break;
		case '⇁':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x, y + h - 2.5, x + w, x + w - 2, y + h - 1.5];
			break;
		case '↼':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x + w, y + h - 2.5, x, x + 2, y + h - 3.5];
			break;
		case '↽':
			//M{x0},{y0}H{x1}L{x2},{y2}
			array = [x + w, y + h - 2.5, x, x + 2, y + h - 1.5];
			break;
		case '⇄':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x + w, y + h - 1.5, x, x + 2, y + h - 0.5, x, y + h - 1.5, x + 2, y + h - 2.5];
			var arrup = [x, y + h - 3.5, x + w, x + w - 2, y + h - 2.5, x + w, y + h - 3.5, x + w - 2, y + h - 4.5];
			array = arrup.concat(arrdown);
			break;
		case '⇆':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrup = [x, y + h - 1.5, x + w, x + w - 2, y + h - 0.5, x + w, y + h - 1.5, x + w - 2, y + h - 2.5];
			var arrdown = [x + w, y + h - 3.5, x, x + 2, y + h - 2.5, x, y + h - 3.5, x + 2, y + h - 4.5];
			array = arrdown.concat(arrup);
			break;
		case '⇇':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x + w, y + h - 1.5, x, x + 2, y + h - 0.5, x, y + h - 1.5, x + 2, y + h - 2.5];
			var arrup = [x + w, y + h - 3.5, x, x + 2, y + h - 2.5, x, y + h - 3.5, x + 2, y + h - 4.5];
			array = arrdown.concat(arrup);
			break;
		case '⇉':
			//⇋⇌⇍⇎⇏⇐⇒⇔⇚⇛⇜↽↼
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			var arrdown = [x, y + h - 1.5, x + w, x + w - 2, y + h - 0.5, x + w, y + h - 1.5, x + w - 2, y + h - 2.5];
			var arrup = [x, y + h - 3.5, x + w, x + w - 2, y + h - 2.5, x + w, y + h - 3.5, x + w - 2, y + h - 4.5];
			array = arrdown.concat(arrup);
			break;
		default:
			break;
	}

	drawOver(s, array, type);

	offset.top -= 5;
	if(el.childNodes.length){
		var _offset_left = offset.left;

		for (var i = 0, len = el.childNodes.length; i < len; i++) {
			var item = el.childNodes[i];
			if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
				offset.left = _offset_left;
			}
			drawBox(item, s, offset);
			break;
		};
	}
	// offset.top += 5;
	offset.top -= baseline;
	return svg;
}

function drawMunderOver(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	
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

	var baseline = getBaseLine(el);
	offset.top += baseline;
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
	offset.top -= baseline;
	return svg;
}

function drawMsup(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	// var myPBox = caculateBox(el.parentNode, {width: 0, height: defaultHeight});

	// var marginTop = myPBox.height - myBox.height;
	var baseline = getBaseLine(el);
	offset.top += baseline;
	//主元素
	drawBox(el.childNodes[0], svg, offset);
	offset.top -= 7;
	// setSup(el.childNodes[1]);
	drawBox(el.childNodes[1], svg, offset);
	offset.top -= baseline;
	offset.top += 7;

	return svg;
}

function drawMsub(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
	
	if(clientRect){
		s.attr(clientRect);
	}
	var box = {width: 0, height: defaultHeight};
	var myBox = caculateBox(el.firstChild, box);
	offset = offset || {left: 0, right: 0, top: 0, bottom: 0};
	var baseline = getBaseLine(el);
	offset.top += baseline;

	//主元素
	drawBox(el.childNodes[0], svg, offset);
	offset.top += 5;
	drawBox(el.childNodes[1], svg, offset);
	offset.top -= 5;
	offset.top -= baseline;

	return svg;
}

function drawMsubsup(el, svg, offset, clientRect){
	svg = svg || Snap();
	var s = svg.g();
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
	var baseline = getBaseLine(el);
	offset.top += baseline;

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
	offset.top -= baseline;
	offset.top += 8;
	offset.left = originLeft + myBox.width;

	return svg;
}

function drawMspace(el, svg, offset, clientRect){
	svg = svg || Snap();
	// var s = svg.g();
	var myWidth = el.getAttribute('width');
	var myHeight = el.getAttribute('height');
	var linebreak = el.getAttribute('linebreak');
	myWidth = myWidth ? Number(myWidth.replace('px', '')) : 0;
	myHeight = myHeight ? Number(myHeight.replace('px', '')): defaultHeight;
	var baseline = getBaseLine(el);
	if(linebreak === 'newline'){

		var pNode = el.parentNode;
		var nodes = pNode.childNodes;
		var index = 0;

		while(nodes.item(index) !== el && index < nodes.length){
			index++;
		}
		//设置默认的高度为18;
		var maxHeight = 18;

		for(var i = 0; i < index; i++){
			var item = nodes[i];
			var _iheight = 0;
			if(item.tagName === 'mspace'){
				_iheight = caculateBox(item, {width: 0, height: 0}).height;
			}else{
				_iheight = caculateBox(item, {width: 0, height: defaultHeight}).height;
			}
			maxHeight = maxHeight > _iheight ? maxHeight : _iheight;
		}

		offset.top += maxHeight;

		return svg;
	}

	offset.top += baseline;
	drawRect(svg, [offset.left, offset.top, Number(myWidth), Number(myHeight)], {fill: '#bada55', stroke: 'none'});
	offset.left += Number(myWidth);
	offset.top -= baseline;
	return svg;
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
	el.setAttribute('fontSize', '10px');
	if(el.childNodes && el.childNodes.length){
		for(var i = 0, len = el.childNodes.length; i < len; i++){
			setSup(el.childNodes[i]);
		}
	}
}


function drawCommon(el, svg, offset){

	var _offset_left = offset.left;
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var item = el.childNodes[i];
		if(item.tagName === 'mspace' && item.getAttribute('linebreak') === 'newline'){
			offset.left = _offset_left;
		}
		drawBox(item, svg, offset);
	};
}

function drawBaseText(svg, x, y, text, attrs){

	svg.text(x, y, text).attr(attrs);
}

function drawText(svg, array, text){
	svg.text(array[0], array[1], text);
}


function getBaseLine(el){
	var pNode = el.parentNode;
	var mIndex = 0;
	var mBaseline = 0;
	while(pNode.childNodes.item(mIndex) !== el){
		mIndex++;
	}
	//这里可能获取到了非直接子元素
	var mspaces = pNode.getElementsByTagName('mspace');
	var mIndexArr = [];
	var j = 0;
	for(var i = 0, len = mspaces.length; i < len; i++){
		//如果不是直接子元素（即跟当前元素不是兄弟元素），跳过。
		if(mspaces[i].parentNode == pNode && mspaces[i].getAttribute('linebreak') == 'newline'){
			while(pNode.childNodes.item(j) !== mspaces[i] && j < pNode.childNodes.length){
				j++;
			}
			mIndexArr.push(j);
		}
	}
	if(mIndexArr.indexOf(mIndex) === -1){
		mIndexArr.push(mIndex);
	}
	// mIndexArr.sort();
	var maxHeight = 0;
	var maxTag = null;
	var pos = mIndexArr.indexOf(mIndex);
	var start = mIndexArr[pos - 1] || 0;
	var end = mIndexArr[pos + 1] || pNode.childNodes.length;
	if(el.tagName === 'mspace' && el.getAttribute('linebreak') === 'newline'){
		start = mIndex;
	}
	for(var l = start; l < end; l++){
		var item = pNode.childNodes[l];
		var iBox;
		if(item.tagName === 'mspace'){
			iBox = caculateBox(item, {width: 0, height: 0});
		}else{
			iBox = caculateBox(item, {width: 0, height: defaultHeight});
		}
		if(maxHeight < iBox.height){
			maxHeight = iBox.height;
			maxTag = item;
		}
	}

	if(maxTag == el || !maxTag){
		return mBaseline;
	}

	var myBox = caculateBox(el, {width:0, height:defaultHeight});
	switch(maxTag.tagName){
		case 'mfrac':
			var mBox = caculateBox(maxTag.childNodes[0], {width: 0, height: defaultHeight});
			mBaseline += mBox.height / 2;
			break;
		case 'msubsup':
			var mBox = caculateBox(maxTag.childNodes[2], {width: 0, height: defaultHeight}); 
			mBaseline += mBox.height / 2;
			break;
		case 'munderover':
			var mBox = caculateBox(maxTag.childNodes[2], {width: 0, height: defaultHeight}); 
			mBaseline += mBox.height / 2;
			break;
		default:
			var marginTop = (maxHeight - myBox.height) / 2;
			mBaseline += marginTop;
			break;
	}
	mBaseline = mBaseline > 0 ? mBaseline : 0;
	return mBaseline;
}

function getLineHeight(mtr){
	var maxHeight = 0;

	for(var i = 0, len = mtr.childNodes.length; i < len; i++){
		var item = mtr.childNodes[i];
		var tdbox = caculateBox(item, {width: 0, height: defaultHeight});
		maxHeight = maxHeight > tdbox.height ? maxHeight : tdbox.height;
	}

	return maxHeight;
}

function getMaxWidth(arr, index){

	var maxWidth = 0;

	for(var i = 0, len = arr.length; i < len; i++){
		var item = arr[i];
		var iwidth = item[index] ? (item[index].width ? item[index].width : 0) : 0;
		maxWidth = iwidth > maxWidth ? iwidth : maxWidth;
	}

	return maxWidth;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array 起始坐标点(x,y)，水平距离w。[x,y,w]
 * @param  {[type]} attrs 属性值
 * @return {[type]}       [description]
 */
function drawHorizontalLine(svg, array, attrs){
	svg = svg || Snap();
	var g = svg.g();
	attrs = attrs || {fill: 'none', stroke: '#bada55'};

	var x = array[0],
		y = array[1],
		w = array[2];
	var str = 'M'+x+' '+y+'H'+w;
	var p = g.path(str).attr(attrs);
	return p;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array 起始坐标点(x,y)，竖直距离h。[x,y,h]
 * @param  {[type]} attrs [description]
 * @return {[type]}       [description]
 */
function drawVerticalLine(svg, array, attrs) {
	svg = svg || Snap();
	var g = svg.g();
	attrs = attrs || {fill: 'none', stroke: '#bada55'};

	var x = array[0],
		y = array[1],
		h = array[2];
	var str = 'M'+x+' '+y+'V'+h;
	var p = g.path(str).attr(attrs);
	return p;
}

/**
 * /
 * @param  {[type]} svg   [description]
 * @param  {[type]} array 起始坐标(x,y),终点坐标(x1,y1);
 * @param  {[type]} attrs [description]
 * @return {[type]}       [description]
 */
function drawLine(svg, array, attrs) {
	svg = svg || Snap();
	var g = svg.g();
	attrs = attrs || {fill: 'none', stroke: '#bada55'};

	var x = array[0],
		y = array[1],
		x1 = array[2],
		y1 = array[3];

	var p = g.line(x, y, x1, y1).attr(attrs);
	return p;
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
    		strFormat = "M{x0},{y0}V{y1}M{x2},{y2}V{y3}";
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
        stroke: "#bada55",
        strokeWidth: 2
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
		'°': '°',
		'→': '→',
		'←': '←',
		'↔': '↔',
		'⇀': '⇀',
		'⇁': '⇁',
		'↼': '↼',
		'↽': '↽',
		'⇄': '⇄',
		'⇆': '⇆',
		'⇇': '⇇',
		'⇉': '⇉'
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
		case '→':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}";
			// array = [x, y + 2.5, x + w, x + w - 2, y + 3.5, x + w, y + 2.5, x + w - 2, y + 1.5];
			matrix = {
				x0: array[0],
				y0: array[1],
				x1: array[2],
				x2: array[3],
				y2: array[4],
				x3: array[5],
				y3: array[6],
				x4: array[7],
				y4: array[8]
			}
			break;
		case '←':
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}";
			matrix = {
				x0: array[0],
				y0: array[1],
				x1: array[2],
				x2: array[3],
				y2: array[4],
				x3: array[5],
				y3: array[6],
				x4: array[7],
				y4: array[8]
			}
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			// array = [x + w, y + 2.5, x, x + 2, y + 3.5, x, y + 2.5, x + 2, y + 1.5];
			break;
		case '↔':
			strFormat = "M{x0},{y0}H{x1}L{x3},{y3}M{x4},{y4}L{x5},{y5}M{x6},{y6}L{x7},{y7}L{x8},{y8}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x3:array[3],
				y3:array[4],
				x4:array[5],
				y4:array[6],
				x5:array[7],
				y5:array[8],
				x6:array[9],
				y6:array[10],
				x7:array[11],
				y7:array[12],
				x8:array[13],
				y8:array[14]
			}
			//M{x0},{y0}H{x1}L{x3},{y3}M{x4},{y4}L{x5},{y5}M{x6},{y6}L{x7},{y7}L{x8},{y8}
			// array = [x, y + 2.5, x + w, x + w - 2, y + 3.5, x + w, y + 2.5, x + w - 2, y + 1.5, x + 2, y + 1.5, x, y+2.5, x + 2, y+3.5];
			break;
		case '⇀':
			//M{x0},{y0}H{x1}L{x2},{y2}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}";
			// array = [x, y + 2.5, x + w, x + w - 2, y + 1.5];
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4]
			}
			break;
		case '⇁':
			//M{x0},{y0}H{x1}L{x2},{y2}
			// array = [x, y + 2.5, x + w, x + w - 2, y + 3.5];
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4]
			}
			break;
		case '↼':
			//M{x0},{y0}H{x1}L{x2},{y2}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4]
			}
			break;
		case '↽':
			//M{x0},{y0}H{x1}L{x2},{y2}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4]
			}
			break;
		case '⇄':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}M{x5},{y5}H{x6}L{x7},{y7}M{x8},{y8}L{x9},{y9}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4],
				x3:array[5],
				y3:array[6],
				x4:array[7],
				y4:array[8],
				x5:array[9],
				y5:array[10],
				x6:array[11],
				x7:array[12],
				y7:array[13],
				x8:array[14],
				y8:array[15],
				x9:array[16],
				y9:array[17]
			}
			break;
		case '⇆':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}M{x5},{y5}H{x6}L{x7},{y7}M{x8},{y8}L{x9},{y9}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4],
				x3:array[5],
				y3:array[6],
				x4:array[7],
				y4:array[8],
				x5:array[9],
				y5:array[10],
				x6:array[11],
				x7:array[12],
				y7:array[13],
				x8:array[14],
				y8:array[15],
				x9:array[16],
				y9:array[17]
			}
			break;
		case '⇇':
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}M{x5},{y5}H{x6}L{x7},{y7}M{x8},{y8}L{x9},{y9}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4],
				x3:array[5],
				y3:array[6],
				x4:array[7],
				y4:array[8],
				x5:array[9],
				y5:array[10],
				x6:array[11],
				x7:array[12],
				y7:array[13],
				x8:array[14],
				y8:array[15],
				x9:array[16],
				y9:array[17]
			}
			break;
		case '⇉':
			//⇋⇌⇍⇎⇏⇐⇒⇔⇚⇛⇜↽↼
			//M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}
			strFormat = "M{x0},{y0}H{x1}L{x2},{y2}M{x3},{y3}L{x4},{y4}M{x5},{y5}H{x6}L{x7},{y7}M{x8},{y8}L{x9},{y9}";
			matrix = {
				x0:array[0],
				y0:array[1],
				x1:array[2],
				x2:array[3],
				y2:array[4],
				x3:array[5],
				y3:array[6],
				x4:array[7],
				y4:array[8],
				x5:array[9],
				y5:array[10],
				x6:array[11],
				x7:array[12],
				y7:array[13],
				x8:array[14],
				y8:array[15],
				x9:array[16],
				y9:array[17]
			}
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