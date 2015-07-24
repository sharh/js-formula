function caculateTable(item, box){
	var _box = {height: 0, width: 0};
	for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
		var myChild = item.childNodes[j];
		if(myChild.tagName === 'mtr'){
			var trbox = caculateMtr(myChild, {width: 0, height: defaultHeight});
			box.height += trbox.height + 0;//0暂时设置列表行高为0.
			_box.width = _box.width > trbox.width ? _box.width : trbox.width;
		}
	};

	box.width += _box.width;
}

function caculateMtr(item, box){
	var _box = {height: 0, width: 0};
	for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
		var myChild = item.childNodes[j];
		if(myChild.tagName === 'mtd'){
			var tdbox = caculateMtd(myChild, {width: 0, height: defaultHeight});
			_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
			_box.width += tdbox.width;
		}
	};

	box.height += _box.height;
	box.width += _box.width;
}

function caculateMtd(item, box){
	var _box = {height: 0, width: 0};
	for (var j = 0, len1 = item.childNodes.length; j < len1; j++) {
		var myChild = item.childNodes[j];
		var tdbox = caculateBox(myChild, {width: 0, height: defaultHeight});
		_box.height = _box.height > tdbox.height ? _box.height : tdbox.height;
		_box.width += tdbox.width;
	};
	box.height += _box.height;
	box.width += _box.width;
}