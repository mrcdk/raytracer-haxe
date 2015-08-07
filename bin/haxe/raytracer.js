(function (console) { "use strict";
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	haxe_Timer.measure(Main.exec,{ fileName : "Main.hx", lineNumber : 20, className : "Main", methodName : "main"});
};
Main.defaultScene = function() {
	return { things : [new Plane({ x : 0, y : 1, z : 0},0,Surfaces.checkerboard),new Sphere({ x : 0, y : 1, z : -.25},1,Surfaces.shiny),new Sphere({ x : -1, y : .5, z : 1.5},.5,Surfaces.shiny)], lights : [{ pos : { x : -2, y : 2.5, z : 0}, color : { r : 0.49, g : 0.07, b : 0.07}},{ pos : { x : 1.5, y : 2.5, z : 1.5}, color : { r : 0.07, g : 0.07, b : 0.49}},{ pos : { x : 1.5, y : 2.5, z : -1.5}, color : { r : 0.07, g : 0.49, b : 0.071}},{ pos : { x : 0.0, y : 3.5, z : 0.0}, color : { r : 0.21, g : 0.21, b : 0.35}}], camera : new Camera({ x : 3, y : 2, z : 4},{ x : -1, y : .5, z : 0})};
};
Main.exec = function() {
	var canv = window.document.createElement("canvas");
	canv.width = 256;
	canv.height = 256;
	window.document.body.appendChild(canv);
	var ctx = canv.getContext("2d",null);
	var rayTracer = new RayTracer();
	rayTracer.render(Main.defaultScene(),ctx,canv.width,canv.height);
};
var _$Main_Color_$Impl_$ = {};
_$Main_Color_$Impl_$.__name__ = true;
_$Main_Color_$Impl_$.toDrawingColor = function(this1) {
	var legalize = function(d) {
		return d > 1.?1.:d;
	};
	var tmp;
	var r = Math.floor(legalize(this1.r) * 255);
	var g = Math.floor(legalize(this1.g) * 255);
	var b = Math.floor(legalize(this1.b) * 255);
	tmp = { r : r, g : g, b : b};
	return tmp;
};
_$Main_Color_$Impl_$.toString = function(this1) {
	return "rgb(" + this1.r + ", " + this1.g + ", " + this1.b + ")";
};
var Camera = function(pos,lookAt) {
	this.pos = pos;
	var down = { x : 0, y : -1, z : 0};
	var tmp;
	var v = { x : lookAt.x - pos.x, y : lookAt.y - pos.y, z : lookAt.z - pos.z};
	var mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	var div = mag == 0?Infinity:1.0 / mag;
	tmp = { x : div * v.x, y : div * v.y, z : div * v.z};
	this.forward = tmp;
	var tmp1;
	var tmp3;
	var tmp4;
	var this2 = this.forward;
	tmp4 = { x : this2.y * down.z - this2.z * down.y, y : this2.z * down.x - this2.x * down.z, z : this2.x * down.y - this2.y * down.x};
	var v1 = tmp4;
	var mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
	var div1 = mag1 == 0?Infinity:1.0 / mag1;
	tmp3 = { x : div1 * v1.x, y : div1 * v1.y, z : div1 * v1.z};
	var this1 = tmp3;
	tmp1 = { x : 1.5 * this1.x, y : 1.5 * this1.y, z : 1.5 * this1.z};
	this.right = tmp1;
	var tmp2;
	var tmp5;
	var tmp6;
	var this4 = this.forward;
	var v3 = this.right;
	tmp6 = { x : this4.y * v3.z - this4.z * v3.y, y : this4.z * v3.x - this4.x * v3.z, z : this4.x * v3.y - this4.y * v3.x};
	var v2 = tmp6;
	var mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
	var div2 = mag2 == 0?Infinity:1.0 / mag2;
	tmp5 = { x : div2 * v2.x, y : div2 * v2.y, z : div2 * v2.z};
	var this3 = tmp5;
	tmp2 = { x : 1.5 * this3.x, y : 1.5 * this3.y, z : 1.5 * this3.z};
	this.up = tmp2;
};
Camera.__name__ = true;
var Thing = function() { };
Thing.__name__ = true;
var Sphere = function(center,radius,surface) {
	this.radius2 = radius * radius;
	this.center = center;
	this.surface = surface;
};
Sphere.__name__ = true;
Sphere.__interfaces__ = [Thing];
Sphere.prototype = {
	normal: function(pos) {
		var tmp;
		var tmp1;
		var v1 = this.center;
		tmp1 = { x : pos.x - v1.x, y : pos.y - v1.y, z : pos.z - v1.z};
		var v = tmp1;
		var mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
		var div = mag == 0?Infinity:1.0 / mag;
		tmp = { x : div * v.x, y : div * v.y, z : div * v.z};
		return tmp;
	}
	,intersect: function(ray) {
		var tmp;
		var this1 = this.center;
		var v1 = ray.start;
		tmp = { x : this1.x - v1.x, y : this1.y - v1.y, z : this1.z - v1.z};
		var eo = tmp;
		var tmp1;
		var v2 = ray.dir;
		tmp1 = eo.x * v2.x + eo.y * v2.y + eo.z * v2.z;
		var v = tmp1;
		var dist = 0.;
		if(v >= 0) {
			var disc = this.radius2 - (eo.x * eo.x + eo.y * eo.y + eo.z * eo.z - v * v);
			if(disc >= 0) dist = v - Math.sqrt(disc);
		}
		if(dist == 0) return null; else return { thing : this, ray : ray, dist : dist};
	}
};
var Plane = function(norm,offset,surface) {
	this.surface = surface;
	this.norm = norm;
	this.offset = offset;
};
Plane.__name__ = true;
Plane.__interfaces__ = [Thing];
Plane.prototype = {
	normal: function(pos) {
		return this.norm;
	}
	,intersect: function(ray) {
		var tmp;
		var this1 = this.norm;
		var v = ray.dir;
		tmp = this1.x * v.x + this1.y * v.y + this1.z * v.z;
		var denom = tmp;
		if(denom > 0) return null; else {
			var tmp1;
			var this2 = this.norm;
			var v1 = ray.start;
			tmp1 = this2.x * v1.x + this2.y * v1.y + this2.z * v1.z;
			var dist = (tmp1 + this.offset) / -denom;
			return { thing : this, ray : ray, dist : dist};
		}
	}
};
Math.__name__ = true;
var Surfaces = function() { };
Surfaces.__name__ = true;
var RayTracer = function() {
	this.maxDepth = 5;
};
RayTracer.__name__ = true;
RayTracer.prototype = {
	render: function(scene,ctx,screenWidth,screenHeight) {
		var getPoint = function(x,y,camera) {
			var recenterX = function(x1) {
				return (x1 - screenWidth / 2.0) / 2.0 / screenWidth;
			};
			var recenterY = function(y1) {
				return -(y1 - screenHeight / 2.0) / 2.0 / screenHeight;
			};
			var tmp;
			var tmp1;
			var this1 = camera.forward;
			var tmp2;
			var tmp3;
			var this3 = camera.right;
			var k = recenterX(x);
			tmp3 = { x : k * this3.x, y : k * this3.y, z : k * this3.z};
			var this2 = tmp3;
			var tmp4;
			var this4 = camera.up;
			var k1 = recenterY(y);
			tmp4 = { x : k1 * this4.x, y : k1 * this4.y, z : k1 * this4.z};
			var v2 = tmp4;
			tmp2 = { x : this2.x + v2.x, y : this2.y + v2.y, z : this2.z + v2.z};
			var v1 = tmp2;
			tmp1 = { x : this1.x + v1.x, y : this1.y + v1.y, z : this1.z + v1.z};
			var v = tmp1;
			var mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
			var div = mag == 0?Infinity:1.0 / mag;
			tmp = { x : div * v.x, y : div * v.y, z : div * v.z};
			return tmp;
		};
		var _g = 0;
		while(_g < screenHeight) {
			var y2 = _g++;
			var _g1 = 0;
			while(_g1 < screenWidth) {
				var x2 = _g1++;
				var color = this.traceRay({ start : scene.camera.pos, dir : getPoint(x2,y2,scene.camera)},scene,0);
				var c = _$Main_Color_$Impl_$.toDrawingColor(color);
				ctx.fillStyle = _$Main_Color_$Impl_$.toString(c);
				ctx.fillRect(x2,y2,x2 + 1,y2 + 1);
			}
		}
	}
	,intersections: function(ray,scene) {
		var closest = Infinity;
		var closestInter = null;
		var _g = 0;
		var _g1 = scene.things;
		while(_g < _g1.length) {
			var thing = _g1[_g];
			++_g;
			var inter = thing.intersect(ray);
			if(inter != null && inter.dist < closest) {
				closestInter = inter;
				closest = inter.dist;
			}
		}
		return closestInter;
	}
	,testRay: function(ray,scene) {
		var isect = this.intersections(ray,scene);
		return isect != null?isect.dist:null;
	}
	,traceRay: function(ray,scene,depth) {
		var isect = this.intersections(ray,scene);
		return isect == null?_$Main_Color_$Impl_$.background:this.shade(isect,scene,depth);
	}
	,shade: function(isect,scene,depth) {
		var d = isect.ray.dir;
		var tmp;
		var tmp3;
		var k = isect.dist;
		tmp3 = { x : k * d.x, y : k * d.y, z : k * d.z};
		var this1 = tmp3;
		var v = isect.ray.start;
		tmp = { x : this1.x + v.x, y : this1.y + v.y, z : this1.z + v.z};
		var pos = tmp;
		var normal = isect.thing.normal(pos);
		var tmp1;
		var tmp4;
		var tmp5;
		var k1 = normal.x * d.x + normal.y * d.y + normal.z * d.z;
		tmp5 = { x : k1 * normal.x, y : k1 * normal.y, z : k1 * normal.z};
		var this2 = tmp5;
		tmp4 = { x : 2 * this2.x, y : 2 * this2.y, z : 2 * this2.z};
		var v1 = tmp4;
		tmp1 = { x : d.x - v1.x, y : d.y - v1.y, z : d.z - v1.z};
		var reflectDir = tmp1;
		var tmp2;
		var this3 = _$Main_Color_$Impl_$.background;
		var c = this.getNaturalColor(isect.thing,pos,normal,reflectDir,scene);
		tmp2 = { r : this3.r + c.r, g : this3.g + c.g, b : this3.b + c.b};
		var naturalColor = tmp2;
		var reflectedColor = depth >= this.maxDepth?_$Main_Color_$Impl_$.grey:this.getReflectionColor(isect.thing,pos,normal,reflectDir,scene,depth);
		return { r : naturalColor.r + reflectedColor.r, g : naturalColor.g + reflectedColor.g, b : naturalColor.b + reflectedColor.b};
	}
	,getReflectionColor: function(thing,pos,normal,rd,scene,depth) {
		var tmp;
		var this1 = this.traceRay({ start : pos, dir : rd},scene,depth + 1);
		var k = thing.surface.reflect(pos);
		tmp = { r : k * this1.r, g : k * this1.g, b : k * this1.b};
		return tmp;
	}
	,getNaturalColor: function(thing,pos,norm,rd,scene) {
		var _g = this;
		var addLight = function(light,col) {
			var tmp;
			var this1 = light.pos;
			tmp = { x : this1.x - pos.x, y : this1.y - pos.y, z : this1.z - pos.z};
			var ldis = tmp;
			var tmp1;
			var mag = Math.sqrt(ldis.x * ldis.x + ldis.y * ldis.y + ldis.z * ldis.z);
			var div = mag == 0?Infinity:1.0 / mag;
			tmp1 = { x : div * ldis.x, y : div * ldis.y, z : div * ldis.z};
			var livec = tmp1;
			var neatIsect = _g.testRay({ start : pos, dir : livec},scene);
			var isInShadow = neatIsect == null?false:neatIsect <= Math.sqrt(ldis.x * ldis.x + ldis.y * ldis.y + ldis.z * ldis.z);
			if(isInShadow) return col; else {
				var illum = livec.x * norm.x + livec.y * norm.y + livec.z * norm.z;
				var tmp2;
				if(illum > 0) {
					var this2 = light.color;
					tmp2 = { r : illum * this2.r, g : illum * this2.g, b : illum * this2.b};
				} else tmp2 = _$Main_Color_$Impl_$.defaultColor;
				var lcolor = tmp2;
				var tmp3;
				var tmp6;
				var mag1 = Math.sqrt(rd.x * rd.x + rd.y * rd.y + rd.z * rd.z);
				var div1 = mag1 == 0?Infinity:1.0 / mag1;
				tmp6 = { x : div1 * rd.x, y : div1 * rd.y, z : div1 * rd.z};
				var v = tmp6;
				tmp3 = livec.x * v.x + livec.y * v.y + livec.z * v.z;
				var specular = tmp3;
				var tmp4;
				if(specular > 0) {
					var this3 = light.color;
					var k = Math.pow(specular,thing.surface.roughness);
					tmp4 = { r : k * this3.r, g : k * this3.g, b : k * this3.b};
				} else tmp4 = _$Main_Color_$Impl_$.defaultColor;
				var scolor = tmp4;
				var tmp5;
				var tmp7;
				var tmp8;
				var c2 = thing.surface.diffuse(pos);
				tmp8 = { r : lcolor.r * c2.r, g : lcolor.g * c2.g, b : lcolor.b * c2.b};
				var this4 = tmp8;
				var tmp9;
				var c3 = thing.surface.specular(pos);
				tmp9 = { r : scolor.r * c3.r, g : scolor.g * c3.g, b : scolor.b * c3.b};
				var c1 = tmp9;
				tmp7 = { r : this4.r + c1.r, g : this4.g + c1.g, b : this4.b + c1.b};
				var c = tmp7;
				tmp5 = { r : col.r + c.r, g : col.g + c.g, b : col.b + c.b};
				return tmp5;
			}
		};
		return Lambda.fold(scene.lights,addLight,_$Main_Color_$Impl_$.defaultColor);
	}
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function() { };
haxe_Timer.__name__ = true;
haxe_Timer.measure = function(f,pos) {
	var t0 = haxe_Timer.stamp();
	var r = f();
	haxe_Log.trace(haxe_Timer.stamp() - t0 + "s",pos);
	return r;
};
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
_$Main_Color_$Impl_$.white = { r : 1, g : 1, b : 1};
_$Main_Color_$Impl_$.grey = { r : .5, g : .5, b : .5};
_$Main_Color_$Impl_$.black = { r : 0, g : 0, b : 0};
_$Main_Color_$Impl_$.background = _$Main_Color_$Impl_$.black;
_$Main_Color_$Impl_$.defaultColor = _$Main_Color_$Impl_$.black;
Surfaces.shiny = { diffuse : function(_) {
	return _$Main_Color_$Impl_$.white;
}, specular : function(_1) {
	return _$Main_Color_$Impl_$.grey;
}, reflect : function(_2) {
	return 0.7;
}, roughness : 250};
Surfaces.checkerboard = { diffuse : function(pos) {
	if((Math.floor(pos.z) + Math.floor(pos.x)) % 2 != 0) return _$Main_Color_$Impl_$.white; else return _$Main_Color_$Impl_$.black;
}, specular : function(_) {
	return _$Main_Color_$Impl_$.white;
}, reflect : function(pos1) {
	if((Math.floor(pos1.z) + Math.floor(pos1.x)) % 2 != 0) return 0.1; else return 0.7;
}, roughness : 150};
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
