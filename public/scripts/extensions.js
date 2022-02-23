/*
---------------
EXTENSIONS.JS
---------------
This file contains all the JS extensions that will provide an extended functionality
of JS objects into all the browsers. This is where we make cross-browser supported
object extensions.

Also any new JS objects that are to be defined and reused can be declared here.

*/

if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		if (this == null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}
//=========================================================
//-------------------- String Extensions ------------------
//=========================================================

	/*
	-------------
	String.toBool
	-------------
	Type :: Prototype Extension
	Object :: String
	Browsers :: All
	Description:
		Can be used to convert any string into a boolean value
	*/

	String.prototype.toBool = function () {
		return (/^(?:t|T)rue$/i).test(this);
	};

	/*
	------------
	String.toHex
	------------
	Type :: Extension
	Object :: String
	Browsers :: All
	Description:
		This can be used to find the index of an object in an Array
	*/
	String.prototype.toHex = function () {
		var str = this;
		var hex = '';
		for (var i = 0; i < str.length; i++) {
			hex += '' + str.charCodeAt(i).toString(16);
		}
		return hex;
	};


	/*
	-------------
	String.format
	-------------
	Type :: Extension
	Object :: String
	Browsers :: All
	Description:
		Formats the given string. Replica of C# (string.format) method.
	*/
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	};

	/*
	-------------
	String.insert
	-------------
	Type :: Extension
	Object :: String
	Browsers :: All
	Description:
		Inserts a string into another at the given index.
	*/
	String.prototype.insert = function (index, string) {
		if (index > 0)
			return this.substring(0, index) + string + this.substring(index, this.length);
		else
			return string + this;
	};


	/*
	-----------
	String.trim
	-----------
	Type :: Extension
	Object :: String
	Browsers :: <=IE8
	Description:
		Trims the string
	*/
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/gm, '');
		};
	}

	if (!String.prototype.trimLeft) {
		String.prototype.trimLeft = function() {
			return this.replace(/^\s+/,"");
		}
	}

	if (!String.prototype.trimRight) {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/,"");
		}
	}

//=========================================================
//-------------------- Array Extensions -------------------
//=========================================================

	/*
	-------------
	Array.forEach
	-------------
	Type :: Fix, Extension
	Object :: Array
	Browsers :: <= IE8
	Description:
		This can be used to loop through an array and perform a callback
		for each of the values in the array.
	*/

	// Check if it is already defined, if not define it
	if (!Array.prototype.forEach) {

		Array.prototype.forEach = function forEach(callback, thisArg) {

			var T, k;

			if (this == null) {
				throw new TypeError("this is null or not defined");
			}

			var O = Object(this);
			var len = O.length >>> 0;

			try {
				// Check for any Exceptions

				// Check if the callback is a function
				if ({}.toString.call(callback) !== "[object Function]") {
					throw new TypeError(callback + " is not a function");
				}
				if (thisArg) {
					T = thisArg;
				}
				k = 0;
				while (k < len) {

					var kValue;
					if (Object.prototype.hasOwnProperty.call(O, k)) {
						kValue = O[k];
						callback.call(T, kValue, k, O);
					}
					k++;
				}
			} catch (e) {
				// Handle the Exception
			}
		};
	}


	/*
	-------------
	Array.indexOf
	-------------
	Type :: Extension
	Object :: Array
	Browsers :: All
	Description:
		This can be used to find the index of an object in an Array
	*/

	Array.prototype.indexOf = function (obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) { return i; }
		}
		return -1;
	};

	/*
	-------------
	Array.filter
	-------------
	Type :: Extension
	Object :: Array
	Browsers :: <=IE8
	Description:
		Filters the array values
	Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	*/
	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fun/*, thisArg*/) {

			'use strict';

			if (this === void 0 || this === null) {
			  throw new TypeError();
			}

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== 'function') {
			  throw new TypeError();
			}

			var res = [];
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
			  if (i in t) {
				var val = t[i];

				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if (fun.call(thisArg, val, i, t)) {
				  res.push(val);
				}
			  }
			}

			return res;
		};
	}


	/*
	------------------
	Array.alphanumsort
	------------------
	Type :: Extension
	Object :: Array
	Browsers :: All
	Description:
		Performs a alpha numeric sort (Natural Sort) on the Array
	Source: http://www.davekoelle.com/files/alphanum.js
	*/
	// TODO: Delete the alphaSort from here and use from the custom sort.
	// Array.prototype.alphanumSort = function (caseInsensitive) {

	// 	var z, t;
	// 	for (z = 0; t = this[z]; z++) {
	// 		this[z] = new Array();
	// 		var x = 0, y = -1, n = 0, i, j;

	// 		while (i = (j = t.charAt(x++)).charCodeAt(0)) {
	// 			var m = (i == 46 || (i >=48 && i <= 57));
	// 			if (m !== n) {
	// 				this[z][++y] = "";
	// 				n = m;
	// 			}
	// 			this[z][y] += j;
	// 		}
	// 	}

	// 	this.sort(function(a, b) {
	// 		for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
	// 			if (caseInsensitive) {
	// 				aa = aa.toLowerCase();
	// 				bb = bb.toLowerCase();
	// 			}
	// 			if (aa !== bb) {
	// 				var c = Number(aa), d = Number(bb);
	// 				if (c == aa && d == bb) {
	// 					return c - d;
	// 				} else return (aa > bb) ? 1 : -1;
	// 			}
	// 		}
	// 		return a.length - b.length;
	// 	});

	// 	for (var index = 0; index < this.length; index++) {
	// 		this[index] = this[index].join("");
	// 	}
	// }


//=========================================================
//--------------------- Misc Extensions -------------------
//=========================================================

	/*
	----------
	console
	----------
	Type :: Fix
	Browsers :: IE
	Problem:
		Console object is not accessable in the code.
	Description:
		Console is used to log any data to the console.
	*/

	if (!window.console) window.console = {};
	if (!window.console.log) window.console.log = function () {};

	/**
	 * @ngdoc function
	 * @name  offset
	 * @description
	 * Returns the absolute offset of the element
	 * Pretty handy function
	 * Got from here =>
	 * http://cvmlrobotics.blogspot.in/2013/03/angularjs-get-element-offset-position.html
	 * => Someone give this man a medal :)
	 */
	window.offset = function (el) {
		try {
			return el.offset();
		} catch(e) {}
		var _x = 0;
		var _y = 0;
		var body = document.documentElement || document.body;
		var scrollX = window.pageXOffset || body.scrollLeft;
		var scrollY = window.pageYOffset || body.scrollTop;
		_x = el.getBoundingClientRect().left + scrollX;
		_y = el.getBoundingClientRect().top + scrollY;
		return { left: _x, top:_y };
	}

	/* Deep extend function
	 * equivalent to jQuery extend
	 * Source: http://youmightnotneedjquery.com/#deep_extend
	 */
	window.deepExtend = function(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj)
				continue;

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object')
						deepExtend(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	};

	/* Extend function
	 * Source: http://youmightnotneedjquery.com/#extend
	 */

	window.extend = function(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i])
				continue;

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key))
					out[key] = arguments[i][key];
			}
		}

		return out;
	};

	/* EventTarget for creating event objects
	 * Source: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
	 * Modified names as we require, like on "addListener" => "on"
	 */

	window.EventTarget = function(obj) {
		this._listeners = {};

		if (typeof obj === "object") {
			for (var key in obj) {
				this[key] = obj[key];
			}
		}
	};

	EventTarget.prototype = {

		constructor: EventTarget,

		on: function(type, listener){
			if (typeof this._listeners[type] == "undefined"){
				this._listeners[type] = [];
			}

			this._listeners[type].push(listener);
		},

		trigger: function(event){
			if (typeof event == "string"){
				event = { type: event };
			}
			if (!event.target){
				event.target = this;
			}

			if (!event.type){  //falsy
				throw new Error("Event object missing 'type' property.");
			}

			if (this._listeners[event.type] instanceof Array){
				var listeners = this._listeners[event.type];
				for (var i=0, len=listeners.length; i < len; i++){
					listeners[i].call(this, event);
				}
			}
		},

		off: function(type, listener){
			if (this._listeners[type] instanceof Array){
				var listeners = this._listeners[type];
				for (var i=0, len=listeners.length; i < len; i++){
					if (listeners[i] === listener){
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
	};


	/***
	  *  For loading the "define" kind modules
	  * Mainly for vidyo libraries
	  */

	var $__toObject = function(value) {
		if (value == null) throw TypeError();
		return Object(value);
	};

	var modules = {};
	var callbacks = {};
	var queue = [];
	var current = null;
	if (!window.defineBasePath) {
	window.defineBasePath = '/scripts/vidyo/';
	}
	function next() {
		if (queue.length) {
			current = queue.shift();
			var script = document.createElement('script');
			script.src = window.defineBasePath + current + '.js';
			script.onload = next;
			document.body.appendChild(script);
		}
	}
	function resolve(name, callback) {
		if (modules[name]) {
			callback(modules[name]);
		} else if (callbacks[name]) {
			callbacks[name].push(callback);
		} else {
			queue.push(name);
			callbacks[name] = callback ? [callback]: [];
			if (!current) {
				next();
			}
		}
	}
	function resolved(name, module) {
		modules[name] = module;
		for (var i = 0; i < callbacks[name].length; i++) {
		callbacks[name][i](module);
		}
	}

	window.define = function(depsOrModuleFunc, moduleFunc) {
		var deps;
		if (typeof depsOrModuleFunc === 'function') {
			deps = [];
			moduleFunc = depsOrModuleFunc;
		} else {
			deps = depsOrModuleFunc.slice(0);
		}
		var name = null;
		if (current) {
			name = current;
			current = null;
		}
		var args = [];
		function recur() {
			if (deps.length) {
				var dep = deps.shift();
				resolve(dep, function(module) {
					args.push(module);
					recur();
				});
			} else {
				var module = moduleFunc.apply(null, $__toObject(args));
				if (name) {
					resolved(name, module);
				}
			}
		}
		recur();
	};


	// From Vidyoweb.js
	window.vyWrap = function(obj, functionName, factory) {
		var base = obj[functionName].bind(obj);
		obj[functionName] = factory(base);
	};
	window.vyTempAssign = function(object, values, block) {
		var key;
		var oldValues = {};
		for (key in values) {
			if (values.hasOwnProperty(key)) {
				oldValues[key] = object[key];
				object[key] = values[key];
			}
		}
		try {
			block(object);
		} finally {
			for (key in values) {
				if (values.hasOwnProperty(key)) {
					object[key] = oldValues[key];
				}
			}
		}
	};
	window.vyReplaceUnknowns = function(object) {
		for (var key in object) {
			if (typeof object[key] === 'unknown') {
				object[key] = undefined;
			} else if (typeof object[key] === 'object') {
				vyReplaceUnknowns(object[key]);
			}
		}
	};
	window.vyRetry = function(delay, count, func) {
		setTimeout(function() {
			if (!func(count - 1) && count > 1) {
				vyRetry(delay, count - 1, func);
			}
		}, delay);
	};

//Temporary fix to redirect to LS. later we need to work by adding via grunt
switch (window.location.hostname) {
	case 'devoddclass.wallstreetenglish.com':
		window.lsUrl = "http://testworld.wallstreetenglish.com";
		window.dcUrl = "http://devoddclass.wallstreetenglish.com";
		break;
	case 'testclass.wallstreetenglish.com':
		window.lsUrl = "http://testworld.wallstreetenglish.com";
		window.dcUrl = "http://testclass.wallstreetenglish.com";
		break;
	case 'testoddclass.wallstreetenglish.com':
		window.lsUrl = "http://testworld.wallstreetenglish.com";
		window.dcUrl = "http://testoddclass.wallstreetenglish.com";
		break;
	case 'stageclass.wallstreetenglish.com':
		window.lsUrl = "http://stageworld.wallstreetenglish.com";
		window.dcUrl = "http://stageclass.wallstreetenglish.com";
		break;
	case 'class.wallstreetenglish.com':
		window.lsUrl = "http://world.wallstreetenglish.com";
		window.dcUrl = "http://class.wallstreetenglish.com";
		break;
	default:
		window.lsUrl = "http://devworld.wallstreetenglish.com";
		window.dcUrl = "http://devclass.wallstreetenglish.com";
}
