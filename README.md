storm
=====

html5 application launcher ui, targeted toward mobile devices

download for your phone @ nowhere.
presently testing is run with https://github.com/rogerwang/node-webkit
which you can put somewhere in your path and then simply run:
	
	cd ../
	nw storm
	
how it looks:
=====

![Screenshot would be here..](docs/launch.png)
![Screenshot would be here..](docs/filemanager.png)
	
chemist
=====

storm has a special framework for its own internal and app use, this is called chemist
chemist provides a basic api inside of its directory you can use

	chemist.define('my.package.name');
	my.package.name.someclass = function() { ... }
	
and to import later

	chemist.import('my.package.name.someclass');
	
will automatically include the file, based on the directory structure it's loaded from (my/package/name/someclass.js in the above example)
and bring it into the local scope.