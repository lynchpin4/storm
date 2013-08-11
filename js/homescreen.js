var Launcher = {};
var events = require('events');
var wallpaper = wallpaper || {};
wallpaper.options = wallpaper.options || {};

(function(){
	
	function HomeScreen(options)
	{
		$.extend(this, events.EventEmitter.prototype);
		options = options || {};
		
		this.initialize();
		this.options = {
			hue_animation : false
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
	}
	
	HomeScreen.prototype.applySize = function()
	{
		$('.launcher-page').css('height', $(window).height()-35);
	}
	
	HomeScreen.prototype.start = function()
	{
		console.log('this is the truth');
		this.background = new Launcher.Background();
		this.update_clock();
		this.applyOptions();
		this.applySize();
	}
	
	// should possibly be a function of background?
	const HUE_ANIM_DIR = 45;
	const HUE_END_DEG = 360;
	const HUE_START_DEG = 0;
	HomeScreen.prototype.update_hue = function(start)
	{
		var bg = this.background.background;
		if (this.options.hue_animation)
		{
			if (!this.__set_hue_animation)
			{
				this.__set_hue_animation = true;
				this.__hue_switch = true;
				bg.css('transition', '-webkit-filter '+HUE_ANIM_DIR+'s ease-in;');
				bg.css('-webkit-filter', 'hue-rotate('+HUE_START_DEG+'deg)');
			}
			this.__hue_switch = !this.__hue_switch;
			if (this.__hue_switch)
			{
				bg.css('-webkit-filter', 'hue-rotate('+HUE_START_DEG+'deg)');
			}
			else
			{
				bg.css('-webkit-filter', 'hue-rotate('+HUE_END_DEG+'deg)');
			}
			clearTimeout(this.__hue_timeout);
			this.__hue_timeout = setTimeout(this.update_hue.bind(this), HUE_ANIM_DIR * 1000);
		}
		else
		{
			this.__set_hue_animation = false;
			bg.css('transition', '');
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