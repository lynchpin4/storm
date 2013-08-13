chemist.define('chemist.graphics');

// Load native UI library
var gui = require('nw.gui');
chemist.graphics.ScreenImageUtil = function()
{
    this.win = gui.Window.get();
}

chemist.graphics.ScreenImageUtil.prototype.getCapture = function(cb)
{
    this.win.capturePage(cb, 'png')
}