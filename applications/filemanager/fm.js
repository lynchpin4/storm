window.storm = storm || {};
chemist.define('filemanager.fm');
var fs = fs || require('fs');

filemanager.templates = {
    shell_html: '<div id="storm_fm" class="storm-filemanager"><div class="filemanager-close"><i class="icon-cross-2" /></div><div class="filemanager-header"></div><div class="filemanager-content"><div class="filemanager-icons"></div><div class="filemanager-actions"></div></div></div>',
    app_icons_test: '<div class="app-button"><div class="app-icon"><i class="icon-phone"></i></div><div class="app-label"><span>Phone</span></div></div>',
    app_icon: '<div class="app-button"><div class="app-icon"><img src="{icon}" /></div><div class="app-label"><span>{label}</span></div></div>',
    icon_row: '<div class="iconrow"></div>'
}

filemanager.fm = function()
{
    $.extend(this, events.EventEmitter.prototype);
}

function fm_needs_redraw()
{
    return $('#storm_fm').length != 1;
}


filemanager.fm.prototype.open = function()
{
    if (fm_needs_redraw())
    {
        storm.homescreen.clearOverlay();
        storm.homescreen.overlay_space.append(filemanager.templates.shell_html);
        $('.filemanager-close').click(this.close.bind(this));
    }

    storm.homescreen.addListener("overlay_ready", this.overlay_ready.bind(this));
    this.appInit();
    storm.homescreen.openOverlay();
}

filemanager.fm.prototype.close = function()
{
    storm.homescreen.closeOverlay();
}

filemanager.fm.prototype.chooseFolder = function(path)
{
    $('.filemanager-header').text('');
    if (fs.existsSync(path + 'meta.json'))
    {
        var data = JSON.parse(fs.readFileSync(path+'meta.json'));
        this.folder_data = data;

        if (data.label)
        {
            $('.filemanager-header').text(data.label);
        }
    }

    var files = fs.readdirSync(path);
    var directory = [];
    for (var i=0;i<files.length;i++)
    {
        var is_dir = fs.lstatSync(path+files[i]).isDirectory();
        var file = {
            is_dir: is_dir,
            name: files[i],
            path: path + files[i],
            icon: is_dir && fs.existsSync(path  + files[i] + "/icon.svg") ? path + files[i] +"/icon.svg" : "assets/gion/mimetypes/application-x-executable.svg"
        };
        if (file.is_dir && file.icon.indexOf("icon.svg") == -1) file.icon = "assets/gion/places/gnome-fs-directory.svg";
        directory.push(file);
    }

    this.directory = directory;
    storm.filemanager.renderIcons();
}

filemanager.fm.prototype.renderIcons = function()
{
    $('.filemanager-icons').html('');
    $('.filemanager-icons').hide();
    $('.filemanager-icons').append(filemanager.templates.icon_row);

    for (var i=0;i<this.directory.length;i++)
    {
        var data = this.directory[i];
        if (data.name == "meta.json") continue;
        $('.filemanager-icons .iconrow').append(filemanager.templates.app_icon.replace('{label}', data.name).replace('{icon}', data.icon));
    }

    $('.filemanager-icons').show();
}

filemanager.fm.prototype.appInit = function()
{
    console.log('filemanager app init');
}

filemanager.fm.prototype.appStart = function()
{
    console.log('filemanager app start');
}

filemanager.fm.prototype.overlay_ready = function()
{
    storm.homescreen.removeAllListeners('overlay_ready');
    this.appStart();
}

chemist.events.on('homescreen:icons_ready', function(){
    $('.link-open-apps').click(function(){
        storm.filemanager = storm.filemanager || new filemanager.fm();
        storm.filemanager.open();
        storm.filemanager.chooseFolder('./applications/');
    });
});