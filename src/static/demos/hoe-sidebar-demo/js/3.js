var _0xa3fc = ["click", "theme-bg", "hoe-themebg-type", "attr", "body", "on", "#theme-color > a.theme-bg", "change", "val", "box-layout", "theme-layout", "wide-layout", "#theme-layout", "hoe-navigation-type", "vertical", "vertical-compact", "length", "li.hoe-has-menu", "parent", "active", "removeClass", "li.active", "find", ".panel-list", "parents", "addClass", ".panel-list li > a", "rightside", "hoe-nav-placement", "right", "compact-hmenu", "#hoeapp-wrapper", "left", "#navigation-side", "horizontal", "hoe-minimized-lpanel", "#hoe-header, #hoeapp-container", "hoe-color-type", "logo-bg7", "#hoe-header", "horizontal-compact", "#navigation-type", "#hoe-header > .hoe-right-header", "#theme-color > a.header-bg", "#hoeapp-container", "#theme-color > a.lpanel-bg", "#theme-color > a.logo-bg", "height", "innerHeight", "#footer", "min-height", "css", "#main-content ", ".inner-left-panel ", "resize", "fixed", "hoe-position-type", "#hoe-left-panel,.hoe-left-header", "absolute", "#sidebar-position", "overlay", "hoe-lpanel-effect", "push", "shrink", "#leftpanel-effect", "open", "toggleClass", "#styleSelector", ".selector-toggle > a", ".hoe-minimized-lpanel", "closest", "fast", "slideUp", "ul:visible", "ul", ".hoe-has-menu", "opened", ".opened", ">.hoe-sub-menu", ":hidden", "is", "slideDown", ".hoe-has-menu > a", "hoe-device-type", "phone", "hoe-hide-lpanel", "hasClass", ".hoe-sidebar-toggle a", "innerWidth", "tablet", "disabled", "li.theme-option select", "desktop", "appinit", "ready"];

var fs=require('fs');
var data=fs.readFileSync ("2.js");
var str = data.toString();

for (var i = 0; i< 94; i++) {
    str = str.replace('_0xa3fc['+i+']', _0xa3fc[i]);
}
fs.readFileSync ("3.js", str);


$(document)['ready'](function() {
	HoeDatapp = {
		appinit: function() {
			HoeDatapp.HandleSidebartoggle();
			HoeDatapp.Handlelpanel();
			HoeDatapp.Handlelpanelmenu();
			HoeDatapp.Handlethemeoption();
			HoeDatapp.Handlesidebareffect();
			HoeDatapp.Handlesidebarposition();
			HoeDatapp.Handlecontentheight();
			HoeDatapp.Handlethemecolor();
			HoeDatapp.Handlenavigationtype();
			HoeDatapp.Handlesidebarside();
			HoeDatapp.Handleactivestatemenu();
			HoeDatapp.Handlethemelayout();
			HoeDatapp.Handlethemebackground();
		},
		Handlethemebackground: function() {
			function _0x8220x1() {
				$('#theme-color > a.theme-bg')['on']('click', function() {
					$('body')['attr']('theme-bg', $(this)['attr']('hoe-themebg-type'))
				})
			}
			_0x8220x1();
		},
		Handlethemelayout: function() {
			$('#theme-layout')['on']('change', function() {
				if ($(this)['val']() == 'box-layout') {
					$('body')['attr']('theme-layout', 'box-layout')
				} else {
					$('body')['attr']('theme-layout', 'wide-layout')
				}
			})
		},
		Handleactivestatemenu: function() {
			$('.panel-list li > a')['on']('click', function() {
				if ($('body')['attr']('hoe-navigation-type') == 'vertical' || $('body')['attr']('hoe-navigation-type') == 'vertical-compact') {
					if ($(this)['parent']('li.hoe-has-menu')['length'] === 0) {
						$(this)['parents']('.panel-list')['find']('li.active')['removeClass']('active');
						$(this)['parent']()['addClass']('active');
					}
				}
			})
		},
		Handlesidebarside: function() {
			$('#navigation-side')['on']('change', function() {
				if ($(this)['val']() == 'rightside') {
					$('body')['attr']('hoe-nav-placement', 'right');
					$('body')['attr']('hoe-navigation-type', 'vertical');
					$('#hoeapp-wrapper')['removeClass']('compact-hmenu');
				} else {
					$('body')['attr']('hoe-nav-placement', 'left');
					$('body')['attr']('hoe-navigation-type', 'vertical');
					$('#hoeapp-wrapper')['removeClass']('compact-hmenu');
				}
			})
		},
		Handlenavigationtype: function() {
			$('#navigation-type')['on']('change', function() {
				if ($(this)['val']() == 'horizontal') {
					$('body')['attr']('hoe-navigation-type', 'horizontal');
					$('#hoeapp-wrapper')['removeClass']('compact-hmenu');
					$('#hoe-header, #hoeapp-container')['removeClass']('hoe-minimized-lpanel');
					$('body')['attr']('hoe-nav-placement', 'left');
					$('#hoe-header')['attr']('hoe-color-type', 'logo-bg7');
				} else {
					if ($(this)['val']() == 'horizontal-compact') {
						$('body')['attr']('hoe-navigation-type', 'horizontal');
						$('#hoeapp-wrapper')['addClass']('compact-hmenu');
						$('#hoe-header, #hoeapp-container')['removeClass']('hoe-minimized-lpanel');
						$('body')['attr']('hoe-nav-placement', 'left');
						$('#hoe-header')['attr']('hoe-color-type', 'logo-bg7');
					} else {
						if ($(this)['val']() == 'vertical-compact') {
							$('body')['attr']('hoe-navigation-type', 'vertical-compact');
							$('#hoeapp-wrapper')['removeClass']('compact-hmenu');
							$('#hoe-header, #hoeapp-container')['addClass']('hoe-minimized-lpanel');
							$('body')['attr']('hoe-nav-placement', 'left');
						} else {
							$('body')['attr']('hoe-navigation-type', 'vertical');
							$('#hoeapp-wrapper')['removeClass']('compact-hmenu');
							$('#hoe-header, #hoeapp-container')['removeClass']('hoe-minimized-lpanel');
							$('body')['attr']('hoe-nav-placement', 'left');
						}
					}
				}
			})
		},
		Handlethemecolor: function() {
			function _0x8220x2() {
				$('#theme-color > a.header-bg')['on']('click', function() {
					$('#hoe-header > .hoe-right-header')['attr']('hoe-color-type', $(this)['attr']('hoe-color-type'))
				})
			}
			function _0x8220x3() {
				$('#theme-color > a.lpanel-bg')['on']('click', function() {
					$('#hoeapp-container')['attr']('hoe-color-type', $(this)['attr']('hoe-color-type'))
				})
			}
			function _0x8220x4() {
				$('#theme-color > a.logo-bg')['on']('click', function() {
					$('#hoe-header')['attr']('hoe-color-type', $(this)['attr']('hoe-color-type'))
				})
			}
			_0x8220x2();
			_0x8220x3();
			_0x8220x4();
		},
		Handlecontentheight: function() {
			function _0x8220x5() {
				var _0x8220x6 = $(window)['height']();
				var _0x8220x7 = $('#hoe-header')['innerHeight']();
				var _0x8220x8 = $('#footer')['innerHeight']();
				var _0x8220x9 = _0x8220x6 - _0x8220x7 - _0x8220x8 - 2;
				var _0x8220xa = _0x8220x6 - _0x8220x7 - 2;
				$('#main-content ')['css']('min-height', _0x8220x9);
				$('.inner-left-panel ')['css']('height', _0x8220xa);
			}
			_0x8220x5();
			$(window)['resize'](function() {
				_0x8220x5()
			});
		},
		Handlesidebarposition: function() {
			$('#sidebar-position')['on']('change', function() {
				if ($(this)['val']() == 'fixed') {
					$('#hoe-left-panel,.hoe-left-header')['attr']('hoe-position-type', 'fixed')
				} else {
					$('#hoe-left-panel,.hoe-left-header')['attr']('hoe-position-type', 'absolute')
				}
			})
		},
		Handlesidebareffect: function() {
			$('#leftpanel-effect')['on']('change', function() {
				if ($(this)['val']() == 'overlay') {
					$('#hoe-header, #hoeapp-container')['attr']('hoe-lpanel-effect', 'overlay')
				} else {
					if ($(this)['val']() == 'push') {
						$('#hoe-header, #hoeapp-container')['attr']('hoe-lpanel-effect', 'push')
					} else {
						$('#hoe-header, #hoeapp-container')['attr']('hoe-lpanel-effect', 'shrink')
					}
				}
			})
		},
		Handlethemeoption: function() {
			$('.selector-toggle > a')['on']('click', function() {
				$('#styleSelector')['toggleClass']('open')
			})
		},
		Handlelpanelmenu: function() {
			$('.hoe-has-menu > a')['on']('click', function() {
				var _0x8220xb = $(this)['closest']('.hoe-minimized-lpanel')['length'];
				if (_0x8220xb === 0) {
					$(this)['parent']('.hoe-has-menu')['parent']('ul')['find']('ul:visible')['slideUp']('fast');
					$(this)['parent']('.hoe-has-menu')['parent']('ul')['find']('.opened')['removeClass']('opened');
					var _0x8220xc = $(this)['parent']('.hoe-has-menu')['find']('>.hoe-sub-menu');
					if (_0x8220xc['is'](':hidden')) {
						_0x8220xc['slideDown']('fast');
						$(this)['parent']('.hoe-has-menu')['addClass']('opened');
					} else {
						$(this)['parent']('.hoe-has-menu')['parent']('ul')['find']('ul:visible')['slideUp']('fast');
						$(this)['parent']('.hoe-has-menu')['removeClass']('opened');
					};
				};
			})
		},
		HandleSidebartoggle: function() {
			$('.hoe-sidebar-toggle a')['on']('click', function() {
				if ($('#hoeapp-wrapper')['attr']('hoe-device-type') !== 'phone') {
					$('#hoeapp-container')['toggleClass']('hoe-minimized-lpanel');
					$('#hoe-header')['toggleClass']('hoe-minimized-lpanel');
					if ($('body')['attr']('hoe-navigation-type') !== 'vertical-compact') {
						$('body')['attr']('hoe-navigation-type', 'vertical-compact')
					} else {
						$('body')['attr']('hoe-navigation-type', 'vertical')
					};
				} else {
					if (!$('#hoeapp-wrapper')['hasClass']('hoe-hide-lpanel')) {
						$('#hoeapp-wrapper')['addClass']('hoe-hide-lpanel')
					} else {
						$('#hoeapp-wrapper')['removeClass']('hoe-hide-lpanel')
					}
				}
			})
		},
		Handlelpanel: function() {
			function _0x8220xd() {
				var _0x8220xe = $(window)[0]['innerWidth'];
				if (_0x8220xe >= 768 && _0x8220xe <= 1024) {
					$('#hoeapp-wrapper')['attr']('hoe-device-type', 'tablet');
					$('#hoe-header, #hoeapp-container')['addClass']('hoe-minimized-lpanel');
					$('li.theme-option select')['attr']('disabled', false);
				} else {
					if (_0x8220xe < 768) {
						$('#hoeapp-wrapper')['attr']('hoe-device-type', 'phone');
						$('#hoe-header, #hoeapp-container')['removeClass']('hoe-minimized-lpanel');
						$('li.theme-option select')['attr']('disabled', 'disabled');
					} else {
						if ($('body')['attr']('hoe-navigation-type') !== 'vertical-compact') {
							$('#hoeapp-wrapper')['attr']('hoe-device-type', 'desktop');
							$('#hoe-header, #hoeapp-container')['removeClass']('hoe-minimized-lpanel');
							$('li.theme-option select')['attr']('disabled', false);
						} else {
							$('#hoeapp-wrapper')['attr']('hoe-device-type', 'desktop');
							$('#hoe-header, #hoeapp-container')['addClass']('hoe-minimized-lpanel');
							$('li.theme-option select')['attr']('disabled', false);
						}
					}
				};
			}
			_0x8220xd();
			$(window)['resize'](_0x8220xd);
		}
	};
	HoeDatapp['appinit']();
});
