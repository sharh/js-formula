function caculateMfrac (item, box) {
	var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
	var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight});
	box.width += fbox.width > sbox.width ? fbox.width + 1 : sbox.width + 1;
	box.height += fbox.height + sbox.height - defaultHeight + 5;
}