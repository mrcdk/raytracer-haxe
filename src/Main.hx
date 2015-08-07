package;


import haxe.ds.Vector;
import haxe.Timer;
#if js
import js.Browser;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.HtmlElement;
import js.Lib;
#elseif flash
import flash.display.BitmapData;
import flash.display.Bitmap;
#end

class Main {
	
	static function main() {
		Timer.measure(exec);
	}
	
	static function defaultScene() {
		return {
			things: [
				new Plane(new Vector(0, 1, 0), 0, Surfaces.checkerboard),
				new Sphere(new Vector(0, 1, -.25), 1, Surfaces.shiny),
				new Sphere(new Vector(-1, .5, 1.5), .5, Surfaces.shiny),
			],
			lights: [
				{ pos: new Vector( -2, 2.5, 0), color: new Color(0.49, 0.07, 0.07) },
                { pos: new Vector(1.5, 2.5, 1.5), color: new Color(0.07, 0.07, 0.49) },
                { pos: new Vector(1.5, 2.5, -1.5), color: new Color(0.07, 0.49, 0.071) },
                { pos: new Vector(0.0, 3.5, 0.0), color: new Color(0.21, 0.21, 0.35) }
			],
			camera: new Camera(new Vector(3, 2, 4), new Vector( -1, .5, 0)),
		}
	}
	
	#if js
	static function exec() {
		var canv:CanvasElement = cast Browser.document.createElement("canvas");
		canv.width = 256;
		canv.height = 256;
		Browser.document.body.appendChild(canv);
		var ctx = canv.getContext2d();
		var rayTracer = new RayTracer();
		rayTracer.render(defaultScene(), ctx, canv.width, canv.height);
	}
	#elseif flash
	static function exec() {
		haxe.Log.setColor(0xFFFFFF);
		var stage = flash.Lib.current.stage;
		stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
		stage.align = flash.display.StageAlign.TOP_LEFT;
		var ctx = new BitmapData(256, 256);
		flash.Lib.current.addChild(new Bitmap(ctx));
		var rayTracer = new RayTracer();
		rayTracer.render(defaultScene(), ctx, ctx.width, ctx.height);
	}
	#end
	
}

abstract Vector( { x:Float, y:Float, z:Float } ) {
	
	public var x(get, set):Float;
		inline function get_x() return this.x;
		inline function set_x(v) return this.x = v;
	public var y(get, set):Float;
		inline function get_y() return this.y;
		inline function set_y(v) return this.y = v;
	public var z(get, set):Float;
		inline function get_z() return this.z;
		inline function set_z(v) return this.z = v;
	
	public inline function new (x, y, z) this = {x: x, y: y, z: z};
	
	
    public static inline function mag(v: Vector) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
	
    public static inline function norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag == 0) ? Math.POSITIVE_INFINITY : 1.0 / mag;
        return v * div;
    }
	
	public inline function dot (v:Vector) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	
    public inline function cross(v:Vector) {
        return new Vector(this.y * v.z - this.z * v.y,
                          this.z * v.x - this.x * v.z,
                          this.x * v.y - this.y * v.x);
    }
	
    @:op(A + B)
	inline function plus (v:Vector) {
		return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
	}
	
	@:op(A - B)
	inline function minusLhs (v:Vector) {
		return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
	}
	@:op(B - A)
	inline function minusRhs (v:Vector) {
		return new Vector(v.x - this.x, v.y - this.y, v.z - this.z);
	}
	
    @:commutative
	@:op(A * B)
	inline function times (k:Float) {
		return new Vector(k * this.x, k * this.y, k * this.z);
	}
	
	public function toString() {
		return 'Vector($x, $y, $z)';
	}
	
}

abstract Color( { r:Float, g:Float, b:Float } ) {
	
	public static var white = new Color(1, 1, 1);
	public static var grey = new Color(.5, .5, .5);
	public static var black = new Color(0, 0, 0);
	public static var background = Color.black;
	public static var defaultColor = Color.black;
	
	public var r(get, set):Float;
		inline function get_r() return this.r;
		inline function set_r(v) return this.r = v;
	public var g(get, set):Float;
		inline function get_g() return this.g;
		inline function set_g(v) return this.g = v;
	public var b(get, set):Float;
		inline function get_b() return this.b;
		inline function set_b(v) return this.b = v;
	
	public inline function new(r, g, b) this = { r:r, g:g, b:b };
	
	public function toDrawingColor() {
		var legalize = function(d) return d > 1. ? 1. : d;
		return new Color(
			Math.floor(legalize(this.r) * 255),
			Math.floor(legalize(this.g) * 255),
			Math.floor(legalize(this.b) * 255)
		);
	}
	
	#if flash
	public function toFlashColor() {
		return Std.int(this.r) << 16 | Std.int(this.g) << 8 | Std.int(this.b);
	}
	#end
	
	public function toString() {
		return 'rgb($r, $g, $b)';
	}
	
    @:op(A + B)
	inline function plus (c:Color) {
		return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
	}
	
    @:commutative
	@:op(A * B)
	inline function scale (k:Float) {
		return new Color(k * this.r, k * this.g, k * this.b);
	}
	
    @:op(A * B)
    inline function times (c:Color) {
        return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
    }
	
}

class Camera {
	public var pos:Vector;
	public var forward:Vector;
	public var right:Vector;
	public var up:Vector;
	
	public function new (pos:Vector, lookAt:Vector) {
		this.pos = pos;
		var down = new Vector(0, -1, 0);
		forward = Vector.norm(lookAt - pos);
		right = Vector.norm(forward.cross(down)) * 1.5;
		up = Vector.norm(forward.cross(right)) * 1.5;
	}
}

interface Thing {
	var surface: Surface;
	function intersect(ray:Ray):Intersection;
	function normal(pos:Vector):Vector;
}

class Sphere implements Thing {
	
	public var center:Vector;
	public var surface:Surface;
	
	var radius2:Float;
	
	public function new(center:Vector, radius:Float, surface:Surface) {
		radius2 = radius * radius;
		this.center = center;
		this.surface = surface;
	}
	
	public function normal(pos:Vector) {
		return Vector.norm(pos - center);
	}
	
	public function intersect(ray:Ray):Intersection {
		var eo = center - ray.start;
		var v = eo.dot(ray.dir);
		var dist = 0.;
		if (v >= 0) {
			var disc = radius2 - (eo.dot(eo) - v * v);
			if (disc >= 0) {
				dist = v - Math.sqrt(disc);
			}
		}
		
		if (dist == 0) {
			return null;
		} else {
			return { thing: this, ray: ray, dist:dist };
		}
	}
	
}

class Plane implements Thing {
	
	public var surface:Surface;
	var norm:Vector;
	var offset:Float;
	public function new(norm:Vector, offset:Float, surface:Surface) {
		this.surface = surface;
		this.norm = norm;
		this.offset = offset;
	}
	
	public function normal(pos:Vector) {
		return norm;
	}
	
	public function intersect(ray:Ray):Intersection {
		var denom = norm.dot(ray.dir);
		if (denom > 0) {
			return null;
		} else {
			var dist = (norm.dot(ray.start) + offset) / -denom;
			return { thing: this, ray:ray, dist: dist };
		}
	}
}

class Surfaces {
	public static var shiny:Surface = {
		diffuse: function(_) return Color.white,
		specular: function(_) return Color.grey,
		reflect: function(_) return 0.7,
		roughness: 250,
	};
	
	public static var checkerboard:Surface = {
		diffuse: function(pos) {
			if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 != 0) {
				return Color.white;
			} else {
				return Color.black;
			}
		},
		specular: function(_) return Color.white,
        reflect: function(pos) {
            if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 != 0) {
                return 0.1;
            } else {
                return 0.7;
            }
        },
		roughness: 150,
	};
}

class RayTracer {
	private var maxDepth = 5;
	
	public function new () { }

	#if js
	public function render(scene:Scene, ctx:CanvasRenderingContext2D, screenWidth:Int, screenHeight:Int) {
		var getPoint = function(x, y, camera:Camera) {
			var recenterX = function(x) return (x - (screenWidth / 2.0)) / 2.0 / screenWidth;
			var recenterY = function(y) return  -(y - (screenHeight / 2.0)) / 2.0 / screenHeight;
			return Vector.norm(camera.forward + (camera.right * recenterX(x) + camera.up * recenterY(y)));
		};
		
		for (y in 0...screenHeight) {
			for (x in 0...screenWidth) {
				var color = traceRay( { start: scene.camera.pos, dir: getPoint(x, y, scene.camera) }, scene, 0);
				var c = color.toDrawingColor();
				ctx.fillStyle = Std.string(c);
				ctx.fillRect(x, y, x + 1, y + 1);
			}
		}
	}
	#elseif flash
	public function render(scene:Scene, ctx:BitmapData, screenWidth:Int, screenHeight:Int) {
		var getPoint = function(x, y, camera:Camera) {
			var recenterX = function(x) return (x - (screenWidth / 2.0)) / 2.0 / screenWidth;
			var recenterY = function(y) return  -(y - (screenHeight / 2.0)) / 2.0 / screenHeight;
			return Vector.norm(camera.forward + (camera.right * recenterX(x) + camera.up * recenterY(y)));
		};
		
		ctx.lock();
		for (y in 0...screenHeight) {
			for (x in 0...screenWidth) {
				var color = traceRay( { start: scene.camera.pos, dir: getPoint(x, y, scene.camera) }, scene, 0);
				var c = color.toDrawingColor();
				ctx.setPixel(x, y, c.toFlashColor());
			}
		}
		ctx.unlock();
	}
	#end
	
	function intersections(ray:Ray, scene:Scene) {
		var closest = Math.POSITIVE_INFINITY;
		var closestInter:Intersection = null;
		for (thing in scene.things) {
			var inter = thing.intersect(ray);
			if (inter != null && inter.dist < closest) {
				closestInter = inter;
				closest = inter.dist;
			}
		}
		return closestInter;
	}
	
	function testRay(ray:Ray, scene:Scene) {
		var isect = intersections(ray, scene);
		return isect != null ? isect.dist : null;
	}
	
	function traceRay(ray:Ray, scene:Scene, depth:Float):Color {
		var isect = intersections(ray, scene);
		return isect == null ? Color.background : shade(isect, scene, depth);
	}
	
	function shade(isect:Intersection, scene:Scene, depth:Float) {
		var d = isect.ray.dir;
		var pos = (d * isect.dist) + isect.ray.start;
		var normal = isect.thing.normal(pos);
		var reflectDir = d - ((normal * (normal.dot(d))) * 2);
		var naturalColor = Color.background + getNaturalColor(isect.thing, pos, normal, reflectDir, scene);
		var reflectedColor = depth >= maxDepth ? Color.grey : getReflectionColor(isect.thing, pos, normal, reflectDir, scene, depth);
		return naturalColor + reflectedColor;
	}
	
	function getReflectionColor(thing: Thing, pos: Vector, normal: Vector, rd: Vector, scene: Scene, depth: Float) {
        return traceRay({ start: pos, dir: rd }, scene, depth + 1) * thing.surface.reflect(pos);
    }
	
	function getNaturalColor(thing: Thing, pos: Vector, norm: Vector, rd: Vector, scene: Scene) {
		var addLight = function(light:Light, col:Color) {
			var ldis = light.pos - pos;
			var livec = Vector.norm(ldis);
			var neatIsect = testRay( { start:pos, dir:livec }, scene);
			var isInShadow = neatIsect == null ? false : neatIsect <= Vector.mag(ldis);
			if (isInShadow) {
				return col;
			}
			else {
				var illum = livec.dot(norm);
				var lcolor = illum > 0 ? light.color * illum : Color.defaultColor;
				var specular = livec.dot(Vector.norm(rd));
				var scolor = specular > 0 ? light.color * Math.pow(specular, thing.surface.roughness) : Color.defaultColor;
				
				return col + (lcolor * thing.surface.diffuse(pos) + scolor * thing.surface.specular(pos));
			}
		};
		
		return Lambda.fold(scene.lights, addLight, Color.defaultColor);
	}
}

typedef Ray = {
	start: Vector,
	dir: Vector,
}

typedef Intersection = {
	thing: Thing,
	ray: Ray,
	dist: Float,
}

typedef Surface = {
	diffuse: Vector->Color,
	specular: Vector->Color,
	reflect: Vector->Float,
	roughness: Float,
}

typedef Light = {
	pos: Vector,
	color: Color,
}

typedef Scene = {
	things: Array<Thing>,
	lights: Array<Light>,
	camera: Camera,
}
