var Launcher = {};

(function(){
	
	function HomeScreen()
	{
		this.initialize();
	}
	
	HomeScreen.prototype.initialize = function()
	{
	}
	
	HomeScreen.prototype.start = function()
	{
		console.log('this is the truth');
	}
	
	Launcher = {
		HomeScreen: HomeScreen
	};
	
})();

//module.exports = Launcher;