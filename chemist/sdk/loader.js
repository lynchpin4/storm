// chemist lazyloader
// a fragile and dumb module loader and import system
var chemist = chemist || {};
window.chemist_path = window.chemist_path || "./chemist/";
chemist.loader_paths = window.chemist.loader_paths || [];
chemist.chemist_paths = [chemist_path];

(function(){
	var fs = require('fs'),
	events = require('events');
	
	chemist.events = new events.EventEmitter();
	
	chemist.__imports = [];
	chemist.imports = function(arr) { arr.map(chemist.import); }
	chemist.import = function(p)
	{
		function append_src(path){
            // $('head').append('<script type="text/javascript" src="'+path+'"></script>');
            var code = fs.readFileSync(path);
            var fn = new Function(code);
            fn.call();
        }

		if (fs.existsSync(p))
		{
			append_src(path);
		}
		else
		{
			if (window[p] != null) return window[p];
			if (chemist.__imports.indexOf(p) != -1)
			{
				console.log('chemist: already imported ' + p);
			    return;
			}
            var filesLoaded = 0;
            var filename_approx = "";
            chemist.chemist_paths.concat(chemist.loader_paths).map(function(fp){
                filename_approx = fp + p.replace('.', '/') + ".js";
                if (fs.existsSync(filename_approx))
                    {
                    console.log('loading: '+filename_approx);
                    chemist.__imports.push(p);
                    append_src(filename_approx);
                    filesLoaded++;
                }
            });

            if (filesLoaded == 0)
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