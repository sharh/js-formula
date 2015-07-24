function caculateMunderOver (item, box) {
	//这个是中间的那个元素，这个是正常的状态
	var fbox = caculateBox(item.childNodes[0], {width: 0, height: defaultHeight});
	//这个是下面的那个元素，不是中间的要比中间的小一些,小4个px
	var sbox = caculateBox(item.childNodes[1], {width: 0, height: defaultHeight - 4});
	//这个是上面的那个元素
	var tbox = caculateBox(item.childNodes[2], {width: 0, height: defaultHeight - 4});
	var bwidth = fbox.width > sbox.width ? fbox.width: sbox.width;
	box.width += bwidth > tbox.width ? bwidth : tbox.width;
	box.height += fbox.height + sbox.height + tbox.height - defaultHeight;
}