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
		this.background = new Launcher.Background();
		this.update_clock();
	}
	
	HomeScreen.prototype.update_clock = function()
	{
		var now = new Date(),
			hr = now.getHours(),
			min = now.getMinutes(),
			ampm = 'PM';
		
		if (hr < 12) ampm = 'AM';
		if (hr > 12) hr -= 12;
		if (min < 10) min = "0"+min;
		if (hr == 0) hr = '12';
		
		$('.clock').text(hr + ':' + min + ' ' + ampm);
		
		setTimeout(this.update_clock.bind(this), 1000);
	}
	
	var ParallaxBackground;
	(function()
	{
		function pbg()
		{
			console.log('parallax background init');
			this.calcDimensions();
		}
		
		pbg.prototype.calcDimensions = function()
		{
			this.background_src = (($('.background').css('background-image').split("(")[1]).split(")")[0]);
			this.background_image = new Image();
			this.background_image.onload = (function(){ this.background_width = this.background_image.width; this.background_height = this.background_image.height; this.calcDimensionsDone(); }).bind(this);
			this.background_image.src = this.background_src;
		}
		
		// todo: promise api or something
		pbg.prototype.calcDimensionsDone = function()
		{
			console.log(' background image dimensions '+this.background_width+"x"+this.background_height);
		}
		
		pbg.prototype.scrollTo = function(x)
		{
			var y = 0;
			$('.background').addClass('animated');
			$('.background').css('background-position', '-'+x + 'px -' + y +'px');
			setTimeout(function() { $('.background').removeClass('animated'); }, 1000);
		}
		
		pbg.prototype.scrollImmediate = function(x)
		{
			$('.background').removeClass('animated'); 
			var y = 0;
			$('.background').css('background-position', '-'+x + 'px -' + y +'px');
		}
		
		pbg.prototype.addBlur = function(px)
		{
			if (px == null) px = 2;
			var value = $('.background').css('-webkit-filter');
			if (value.indexOf("blur") != -1) { this.removeBlur(); this.addBlur(px); return; }
			if (value == null) value = "";
			value = value + " blur("+px+"px)";
			$('.background').css('-webkit-filter', value);
		}
		
		pbg.prototype.removeBlur = function()
		{
			var value = $('.background').css('-webkit-filter');
			if (value != null && value != "") value = value.split('blur')[0];
			$('.background').css('-webkit-filter', value);
		}
		
		ParallaxBackground = pbg;
	})();
	
	Launcher = {
		HomeScreen: HomeScreen,
		Background: ParallaxBackground
	};
	
})();

//module.exports = Launcher;