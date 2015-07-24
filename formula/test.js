var mathml = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mi>a</mi><mi>s</mi><mi>d</mi><mi>a</mi><mi>s</mi><mi>d</mi><mi>a</mi><mi>s</mi><mi>d</mi></mfenced></math>'
var mathml2 = '<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mn>45as</mn><mi>速度</mi></msqrt></math>'

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
    defaultOpts = $.clone(true, defaultOpts, attrs);

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
    var defaultOpts = $.clone(true, defaultOpts, attrs);

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
			    y2: array[5],
			    x3: array[6],
			    y3: array[7]
			};
    		strFormat = "M{x0},{y0}L{x1},{y1}L{x2},{y2}L{x3},{y3}";
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
    		strFormat = "M{x0},{y0}L{x1},{y1}Q{x2},{y2},{x3},{y3}L{x4}{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x8},{y8}Q{x9},{y9},{x10},{y10}L{x11},{y11}";
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
    var defaultOpts = $.clone(true, defaultOpts, attrs);

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
    	case "longdiv":
    		strFormat = "";
    		matrix = "";
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
    		strFormat = "M{x0},{y0}L{x1},{y1}L{x2}{y2}M{x1}{y1}L{x3}{y3}";
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

	var defaultOpts = {};
	attrs = attrs || {};
    defaultOpts = $.clone(true, defaultOpts, attrs);

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

	var defaultOpts = {};
	attrs = attrs || {};
    defaultOpts = $.clone(true, defaultOpts, attrs);

	var circle = svg.rect(x, y, r).attr(defaultOpts);
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

	var defaultOpts = {};
	attrs = attrs || {};
    defaultOpts = $.clone(true, defaultOpts, attrs);

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
    defaultOpts = $.clone(true, defaultOpts, attrs);

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
function drawMover(svg, array, type, attrs){
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
    		strFormat = "M{x0},{y0}L{x1},{y1}Q{x2},{y2},{x3},{y3}L{x4}{y4}Q{x5},{y5},{x6},{y6}T{x7},{y7}L{x8},{y8}Q{x9},{y9},{x10},{y10}L{x11},{y11}";
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
    var defaultOpts = $.clone(true, defaultOpts, attrs);

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


function mathFenc(){
	var div = document.createElement('div');
	div.innerHTML = mathml;
	drawFence();
	
}
function drawFence(){
	var mfenceEls = getMfen(div);
	var baseFont = 8;
	var childs = mfenceEls[0].childNodes;
	var len = 0;
	for (var i = childs.length - 1; i >= 0; i--) {
		var item = childs[i];
		if(isBaseTag(item)){
			len += baseLength(item);
		}
	};

	var w = baseFont * len + 20, h = baseFont + 8;

	var s = Snap();
	s.attr({
		width: w,
		height: h
	});

	var p1 = s.path(Snap.format("M{x},{y}Q{x1},{y1},{x2},{y2}", {
			    x: 10,
			    y: 0,
			    x1: 0,
			    y1: h/2,
			    x2: 10,
			    y2: h
			})).attr({
			        fill: "none",
			        stroke: "#bada55"
			    });
	var text = s.text('10', h-4, mfenceEls[0].textContent).attr({
			        fill: "none",
			        stroke: "#bada55"
			    });
	var p2 = s.path(Snap.format("M{x},{y}Q{x1},{y1},{x2},{y2}", {
			    x: w-10,
			    y: 0,
			    x1: w,
			    y1: h/2,
			    x2: w-10,
			    y2: h
			})).attr({
			        fill: "none",
			        stroke: "#bada55"
			    });


}
// drawSqrt()
function drawSqrt(){
	var div = document.createElement('div');
	div.innerHTML = mathml2;
	var sqrt = getSqrt(div);
	var len = 0;

	for (var i = sqrt[0].childNodes.length - 1; i >= 0; i--) {
		var item = sqrt[0].childNodes[i];

		if(isBaseTag(item)){
			len += item.textContent.length;
		}
	};

	var baseFont = 14;
	var w = baseFont * (len+2) + 15, h = baseFont + 8;

	var s = Snap();
	s.attr({
		width: w,
		height: h
	});

	//画根号
	var p1 = s.path(Snap.format("M{x},{y}L{x1},{y1}L{x2},{y2}L{x3},{y3}H{x4}", {
			    x: 0,
			    y: h-h/3+2,
			    x1: 5,
			    y1: h-h/3-4,
			    x2: 10,
			    y2: h,
			    x3: 15,
			    y3: 0,
			    x4: w
			})).attr({
			        fill: "none",
			        stroke: "#bada55"
			    });
	var text = s.text(15, h-2,sqrt[0].textContent).attr({
			        fill: "none",
			        stroke: "#bada55",
			        fontSize: "30px"
			    });

}

function getMfen(el){
	return el.getElementsByTagName('mfenced');
}

function getSqrt(el){
	return el.getElementsByTagName('msqrt');
}

function isBaseTag(el){
	if(el.tagName === 'mi' || el.tagName === 'mn' || el.tagName === 'mo'){
		return true;
	}

	return false;
}

function baseLength(baseEl){
	var textNode = baseEl.childNodes[0];
	return textNode.textContent.length;
}


var s = Snap().attr({height: '10000px'});
var p = s.path("M10 20H20V40").attr({
        fill: "none",
        stroke: "#bada55",
        strokeWidth: 5
    });

var rect = s.rect(10, 10, 20, 30).attr({
        fill: "none",
        stroke: "#bada55",
        strokeWidth: 5
    });
var c = s.circle(50, 50, 40).attr({
        fill: "none",
        stroke: "#bada55",
        strokeWidth: 5
    });
var p2 = s.path("M20 20,C50 40 80 40 120 20,S250 20 280 40").attr({
        fill: "none",
        stroke: "#bada55"
    });
// var p3 = s.path("M20 20,S50 40 120 20,S250 20 280 40").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });
var p4 = s.path("M50 50,Q60 90 80 60T100 30").attr({
        fill: "none",
        stroke: "#bada55"
    });

var p4 = s.path("M150-250-150 50").attr({
        fill: "none",
        stroke: "#bada55"
    });
// var p5 = s.path("M100 100,C90 80 80 80 70 100,V300,M60 300Q70 310 80 310 90 300").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });M100 100,Q90 90 80 100T80 150M60 200Q70 210 80 200T80 150
var p6 = s.path("M100 100,Q97 97 94 100T94 120M88 140Q91 143 94 140T94 120").attr({
        fill: "none",
        stroke: "#bada55"
    });
var p7 = s.path("M100 100H150M108 100V120H98H118M142 100V120H132H152").attr({
        fill: "none",
        stroke: "#bada55"
    });

var p7 = s.path('M270-670H20').attr({
        fill: "none",
        stroke: "#bada55"
    });


var p7 = s.text(100, 100 ,'M270-670H20').attr({
        fill: "none",
        stroke: "#bada55"
    });
// var p4 = s.path("M120-150-200,150").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });

// var p5 = s.path("M100,150 50, 150 100,150").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });
// var p6 = s.path("M50 50 A45 45, 0, 1, 0, 45 130").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });
// var p6 = s.path("M50 50 50 90 10 90").attr({
//         fill: "none",
//         stroke: "#bada55"
//     });
// console.log(s);