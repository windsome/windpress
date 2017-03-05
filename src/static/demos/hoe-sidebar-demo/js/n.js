var _0xa3fc = ["click", "theme-bg", "hoe-themebg-type", "attr", "body", "on", "#theme-color > a.theme-bg", "change", "val", "box-layout", "theme-layout", "wide-layout", "#theme-layout", "hoe-navigation-type", "vertical", "vertical-compact", "length", "li.hoe-has-menu", "parent", "active", "removeClass", "li.active", "find", ".panel-list", "parents", "addClass", ".panel-list li > a", "rightside", "hoe-nav-placement", "right", "compact-hmenu", "#hoeapp-wrapper", "left", "#navigation-side", "horizontal", "hoe-minimized-lpanel", "#hoe-header, #hoeapp-container", "hoe-color-type", "logo-bg7", "#hoe-header", "horizontal-compact", "#navigation-type", "#hoe-header > .hoe-right-header", "#theme-color > a.header-bg", "#hoeapp-container", "#theme-color > a.lpanel-bg", "#theme-color > a.logo-bg", "height", "innerHeight", "#footer", "min-height", "css", "#main-content ", ".inner-left-panel ", "resize", "fixed", "hoe-position-type", "#hoe-left-panel,.hoe-left-header", "absolute", "#sidebar-position", "overlay", "hoe-lpanel-effect", "push", "shrink", "#leftpanel-effect", "open", "toggleClass", "#styleSelector", ".selector-toggle > a", ".hoe-minimized-lpanel", "closest", "fast", "slideUp", "ul:visible", "ul", ".hoe-has-menu", "opened", ".opened", ">.hoe-sub-menu", ":hidden", "is", "slideDown", ".hoe-has-menu > a", "hoe-device-type", "phone", "hoe-hide-lpanel", "hasClass", ".hoe-sidebar-toggle a", "innerWidth", "tablet", "disabled", "li.theme-option select", "desktop", "appinit", "ready"];

var fs=require('fs');
var data=fs.readFileSync ("2.js");
var str = data.toString();

/*for (var i = 0; i< 95; i++) {
    //str = str.replace('_0xa3fc['+i+']', _0xa3fc[i]);
    var reg = new RegExp('_0xa3fc\['+i+'\]', 'g');
    str = str.replace(reg, _0xa3fc[i]);
}
fs.writeFileSync ("3.js", str);
*/
function replacer(match, p1, p2, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return "'"+_0xa3fc[p2]+"'";
}

var i = 0;
while (str.match(/(_0xa3fc\[(\d+)\])/)) {
    console.log (i++);
    str = str.replace(/(_0xa3fc\[(\d+)\])/g, replacer);
}
fs.writeFileSync ("3.js", str);

