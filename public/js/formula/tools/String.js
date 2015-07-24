var StringTools =  function() {};
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
    return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
    return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s) {
    return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
StringTools.htmlUnescape = function(s) {
    return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
};
StringTools.startsWith = function(s, start) {
    return s.length >= start.length && StringTools.substr(s, 0, start.length) == start;
};
StringTools.endsWith = function(s, end) {
    var vg1 = end.length;
    var vh1 = s.length;
    return vh1 >= vg1 && StringTools.substr(s, vh1 - vg1, vg1) == end;
};
StringTools.isSpace = function(s, pos) {
    var c = StringTools.cca(s, pos);
    return c >= 9 && c <= 13 || c == 32;
};
StringTools.ltrim = function(s) {
    var l = s.length;
    var r = 0;
    while (r < l && StringTools.isSpace(s, r)) r++;
    if (r > 0) return StringTools.substr(s, r, l - r);
    else return s;
};
StringTools.rtrim = function(s) {
    var l = s.length;
    var r = 0;
    while (r < l && StringTools.isSpace(s, l - r - 1)) r++;
    if (r > 0) return StringTools.substr(s, 0, l - r);
    else return s;
};
StringTools.trim = function(s) {
    return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.rpad = function(s, c, l) {
    var vi1 = s.length;
    var vj1 = c.length;
    while (vi1 < l) if (l - vi1 < vj1) {
        s += StringTools.substr(c, 0, l - vi1);
        vi1 = l;
    } else {
        s += c;
        vi1 += vj1;
    };
    return s;
};
StringTools.lpad = function(s, c, l) {
    var vk1 = "";
    var vi1 = s.length;
    if (vi1 >= l) return s;
    var vj1 = c.length;
    while (vi1 < l) if (l - vi1 < vj1) {
        vk1 += StringTools.substr(c, 0, l - vi1);
        vi1 = l;
    } else {
        vk1 += c;
        vi1 += vj1;
    };
    return vk1 + s;
};
StringTools.replace = function(s, sub, vE1) {
    return s.split(sub).join(vE1);
};
StringTools.hex = function(n, vl1) {
    var s = "";
    var vm1 = "0123456789ABCDEF";
    do {
        s = vm1.charAt(n & 15) + s;
        n >>>= 4;
    } while ( n > 0 );
    if (vl1 != null) while (s.length < vl1) s = "0" + s;
    return s;
};
StringTools.vn1 = function(s, index) {
    return s.charCodeAt(index);
};
StringTools.vo1 = function(c) {
    return c != c;
};

StringTools.substr = function(s, pos, len) {
    if (pos != null && pos != 0 && len != null && len < 0) return "";
    if (len == null) len = s.length;
    if (pos < 0) {
        pos = s.length + pos;
        if (pos < 0) pos = 0;
    } else if (len < 0) len = s.length + len - pos;
    return s.substr(pos, len);
};

StringTools.cca = function(s, index) {
    var x = s.charCodeAt(index);
    if (x != x) return undefined;
    return x;
};