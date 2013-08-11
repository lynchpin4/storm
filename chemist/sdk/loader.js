// chemist lazyloader
// a fragile and dumb module loader and import system
var chemist = chemist || {};
window.chemist_path = window.chemist_path || "./chemist/";
(function(){
	var fs = require('fs'),
	events = require('events');
	
	chemist.events = new events.EventEmitter();
	
	chemist.__imports = [];
	chemist.imports = function() {  }
	chemist.import = function(p)
	{
		function append_src(path){ $('head').append('<script type="text/javascript" src="'+path+'"></script>'); }
		if (fs.existsSync(p))
		{
			append_src(path);
		}
		else
		{
			if (window[p] != null) return window[p];
			if (chemist.__imports.map(function(x) { if (x == p) return x; }).length >= 1)
			{
				console.log('chemist: already imported ' + p);
				return;
			}
			var filename_approx = window.chemist_path + p.replace('.', '/') + ".js";
			console.log('loading: '+filename_approx);
			if (fs.existsSync(filename_approx))
			{
				chemist.__imports.push(p);
				append_src(filename_approx);
			}
			else
			{
				console.log('chemist: error loading '+p+' filename '+filename_approx+' could not be found');
			}
		}
	}
	
	// i could asworn i had a better way to do this years ago
	chemist.define = function(ns)
	{
		var components = ns.split('.');
		var l = "window.";
		components.map(function(n) { var ret = (l + n + " = " + l + n + " || {};"); l = l + n + "."; return ret; }).map(eval);
	}
	
	chemist.bootstrap = function()
	{
		chemist.events.emit('chemist:bootstrap');
		console.log('application started');
	}
	
	chemist.__pre = function()
	{
		chemist.events.emit('domready');
		chemist.bootstrap();
	}
	
	$(chemist.__pre);
	
	chemist.require = require;
})()