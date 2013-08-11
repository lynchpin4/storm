var Launcher = {};
var wallpaper = wallpaper || {};
wallpaper.options = wallpaper.options || {};

(function(){
	
	function HomeScreen(options)
	{
		options = options || {};
		
		this.initialize();
		this.options = {
			hue_animation : true
		};
		$.extend(this.options, options);
		$.extend(this.options, wallpaper.options);
	}
	
	HomeScreen.prototype.initialize = function()
	{
	}
	
	HomeScreen.prototype.applyOptions = function()
	{
		var background = this.background;
		$.extend(this.options, wallpaper.options);
		if (this.options.wallpaper != null)
		{
			background.setBackground(this.options.wallpaper);
		}
		this.update_hue();
		
		if (this.options.header_has_bg)
		{
			$('.modular-header').addClass('has-bg');
		}
		else
		{
			$('.modular-header').removeClass('has-bg');
		}
		
		// hackery ??
		if (this.options.hue_animation && !background.background.hasClass('hue-anim-end')) background.background.addClass('hue-anim-end'); 
	}
	
	HomeScreen.prototype.start = function()
	{
		console.log('this is the truth');
		this.background = new Launcher.Background();
		this.update_clock();
		this.applyOptions();
	}
	
	// should possibly be a function of background?
	HomeScreen.prototype.update_hue = function(start)
	{
		var bg = this.background.background;
		if (this.options.hue_animation)
		{
			if (!bg.hasClass('hue-anim')) bg.addClass('hue-anim');
			if (bg.hasClass('hue-anim-end'))
			{
				console.log('hue animation reversing');
				bg.removeClass('hue-anim-end');
			}
			else
			{
				console.log('hue animation starting');
				if (!bg.hasClass('hue-anim-end')) {  bg.addClass('hue-anim-end'); } else { bg.removeClass('hue-anim-end'); } 
			}
			
			setTimeout(this.update_hue.bind(this), 50 * 1000);
		}
		else
		{
			if (bg.hasClass('hue-anim')) bg.removeClass('hue-anim hue-anim-end');
		}
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
		
		pbg.prototype.setBackground = function(url)
		{
			this.background.css('background-image', 'url('+url+')');
			this.calcDimensions();
		}
		
		pbg.prototype.calcDimensions = function()
		{
			this.background = $('.background');
			this.background_src = ((this.background.css('background-image').split("(")[1]).split(")")[0]);
			this.background_image = new Image();
			this.background_image.onload = (function(){ this.background_width = this.background_image.width; this.background_height = this.background_image.height; this.calcDimensionsDone(); }).bind(this);
			this.background_image.src = this.background_src;
		}
		
		// todo: promise api or something
		pbg.prototype.calcDimensionsDone = function()
		{
			console.log(' background image dimensions '+this.background_width+"x"+this.background_height);
			var width = $(window).width();
			this.scrollTo(width % 5);
			
			if (width <= 500 && this.background_width > (500 + width))
			{
				this.scrollTo((this.background_width / 2 - 500));
			}
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