var _0xa3fc = ["click", "theme-bg", "hoe-themebg-type", "attr", "body", "on", "#theme-color > a.theme-bg", "change", "val", "box-layout", "theme-layout", "wide-layout", "#theme-layout", "hoe-navigation-type", "vertical", "vertical-compact", "length", "li.hoe-has-menu", "parent", "active", "removeClass", "li.active", "find", ".panel-list", "parents", "addClass", ".panel-list li > a", "rightside", "hoe-nav-placement", "right", "compact-hmenu", "#hoeapp-wrapper", "left", "#navigation-side", "horizontal", "hoe-minimized-lpanel", "#hoe-header, #hoeapp-container", "hoe-color-type", "logo-bg7", "#hoe-header", "horizontal-compact", "#navigation-type", "#hoe-header > .hoe-right-header", "#theme-color > a.header-bg", "#hoeapp-container", "#theme-color > a.lpanel-bg", "#theme-color > a.logo-bg", "height", "innerHeight", "#footer", "min-height", "css", "#main-content ", ".inner-left-panel ", "resize", "fixed", "hoe-position-type", "#hoe-left-panel,.hoe-left-header", "absolute", "#sidebar-position", "overlay", "hoe-lpanel-effect", "push", "shrink", "#leftpanel-effect", "open", "toggleClass", "#styleSelector", ".selector-toggle > a", ".hoe-minimized-lpanel", "closest", "fast", "slideUp", "ul:visible", "ul", ".hoe-has-menu", "opened", ".opened", ">.hoe-sub-menu", ":hidden", "is", "slideDown", ".hoe-has-menu > a", "hoe-device-type", "phone", "hoe-hide-lpanel", "hasClass", ".hoe-sidebar-toggle a", "innerWidth", "tablet", "disabled", "li.theme-option select", "desktop", "appinit", "ready"];

var fs=require('fs');
var data=fs.readFileSync ("2.js");
var str = data.toString();

for (var i = 0; i< 94; i++) {
    str = str.replace('_0xa3fc['+i+']', _0xa3fc[i]);
}
fs.readFileSync ("3.js", str);


$(document)[_0xa3fc[94]](function() {
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
				$(_0xa3fc[6])[_0xa3fc[5]](_0xa3fc[0], function() {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[1], $(this)[_0xa3fc[3]](_0xa3fc[2]))
				})
			}
			_0x8220x1();
		},
		Handlethemelayout: function() {
			$(_0xa3fc[12])[_0xa3fc[5]](_0xa3fc[7], function() {
				if ($(this)[_0xa3fc[8]]() == _0xa3fc[9]) {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[10], _0xa3fc[9])
				} else {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[10], _0xa3fc[11])
				}
			})
		},
		Handleactivestatemenu: function() {
			$(_0xa3fc[26])[_0xa3fc[5]](_0xa3fc[0], function() {
				if ($(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13]) == _0xa3fc[14] || $(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13]) == _0xa3fc[15]) {
					if ($(this)[_0xa3fc[18]](_0xa3fc[17])[_0xa3fc[16]] === 0) {
						$(this)[_0xa3fc[24]](_0xa3fc[23])[_0xa3fc[22]](_0xa3fc[21])[_0xa3fc[20]](_0xa3fc[19]);
						$(this)[_0xa3fc[18]]()[_0xa3fc[25]](_0xa3fc[19]);
					}
				}
			})
		},
		Handlesidebarside: function() {
			$(_0xa3fc[33])[_0xa3fc[5]](_0xa3fc[7], function() {
				if ($(this)[_0xa3fc[8]]() == _0xa3fc[27]) {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[29]);
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[14]);
					$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[30]);
				} else {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[32]);
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[14]);
					$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[30]);
				}
			})
		},
		Handlenavigationtype: function() {
			$(_0xa3fc[41])[_0xa3fc[5]](_0xa3fc[7], function() {
				if ($(this)[_0xa3fc[8]]() == _0xa3fc[34]) {
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[34]);
					$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[30]);
					$(_0xa3fc[36])[_0xa3fc[20]](_0xa3fc[35]);
					$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[32]);
					$(_0xa3fc[39])[_0xa3fc[3]](_0xa3fc[37], _0xa3fc[38]);
				} else {
					if ($(this)[_0xa3fc[8]]() == _0xa3fc[40]) {
						$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[34]);
						$(_0xa3fc[31])[_0xa3fc[25]](_0xa3fc[30]);
						$(_0xa3fc[36])[_0xa3fc[20]](_0xa3fc[35]);
						$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[32]);
						$(_0xa3fc[39])[_0xa3fc[3]](_0xa3fc[37], _0xa3fc[38]);
					} else {
						if ($(this)[_0xa3fc[8]]() == _0xa3fc[15]) {
							$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[15]);
							$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[30]);
							$(_0xa3fc[36])[_0xa3fc[25]](_0xa3fc[35]);
							$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[32]);
						} else {
							$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[14]);
							$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[30]);
							$(_0xa3fc[36])[_0xa3fc[20]](_0xa3fc[35]);
							$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[28], _0xa3fc[32]);
						}
					}
				}
			})
		},
		Handlethemecolor: function() {
			function _0x8220x2() {
				$(_0xa3fc[43])[_0xa3fc[5]](_0xa3fc[0], function() {
					$(_0xa3fc[42])[_0xa3fc[3]](_0xa3fc[37], $(this)[_0xa3fc[3]](_0xa3fc[37]))
				})
			}
			function _0x8220x3() {
				$(_0xa3fc[45])[_0xa3fc[5]](_0xa3fc[0], function() {
					$(_0xa3fc[44])[_0xa3fc[3]](_0xa3fc[37], $(this)[_0xa3fc[3]](_0xa3fc[37]))
				})
			}
			function _0x8220x4() {
				$(_0xa3fc[46])[_0xa3fc[5]](_0xa3fc[0], function() {
					$(_0xa3fc[39])[_0xa3fc[3]](_0xa3fc[37], $(this)[_0xa3fc[3]](_0xa3fc[37]))
				})
			}
			_0x8220x2();
			_0x8220x3();
			_0x8220x4();
		},
		Handlecontentheight: function() {
			function _0x8220x5() {
				var _0x8220x6 = $(window)[_0xa3fc[47]]();
				var _0x8220x7 = $(_0xa3fc[39])[_0xa3fc[48]]();
				var _0x8220x8 = $(_0xa3fc[49])[_0xa3fc[48]]();
				var _0x8220x9 = _0x8220x6 - _0x8220x7 - _0x8220x8 - 2;
				var _0x8220xa = _0x8220x6 - _0x8220x7 - 2;
				$(_0xa3fc[52])[_0xa3fc[51]](_0xa3fc[50], _0x8220x9);
				$(_0xa3fc[53])[_0xa3fc[51]](_0xa3fc[47], _0x8220xa);
			}
			_0x8220x5();
			$(window)[_0xa3fc[54]](function() {
				_0x8220x5()
			});
		},
		Handlesidebarposition: function() {
			$(_0xa3fc[59])[_0xa3fc[5]](_0xa3fc[7], function() {
				if ($(this)[_0xa3fc[8]]() == _0xa3fc[55]) {
					$(_0xa3fc[57])[_0xa3fc[3]](_0xa3fc[56], _0xa3fc[55])
				} else {
					$(_0xa3fc[57])[_0xa3fc[3]](_0xa3fc[56], _0xa3fc[58])
				}
			})
		},
		Handlesidebareffect: function() {
			$(_0xa3fc[64])[_0xa3fc[5]](_0xa3fc[7], function() {
				if ($(this)[_0xa3fc[8]]() == _0xa3fc[60]) {
					$(_0xa3fc[36])[_0xa3fc[3]](_0xa3fc[61], _0xa3fc[60])
				} else {
					if ($(this)[_0xa3fc[8]]() == _0xa3fc[62]) {
						$(_0xa3fc[36])[_0xa3fc[3]](_0xa3fc[61], _0xa3fc[62])
					} else {
						$(_0xa3fc[36])[_0xa3fc[3]](_0xa3fc[61], _0xa3fc[63])
					}
				}
			})
		},
		Handlethemeoption: function() {
			$(_0xa3fc[68])[_0xa3fc[5]](_0xa3fc[0], function() {
				$(_0xa3fc[67])[_0xa3fc[66]](_0xa3fc[65])
			})
		},
		Handlelpanelmenu: function() {
			$(_0xa3fc[82])[_0xa3fc[5]](_0xa3fc[0], function() {
				var _0x8220xb = $(this)[_0xa3fc[70]](_0xa3fc[69])[_0xa3fc[16]];
				if (_0x8220xb === 0) {
					$(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[18]](_0xa3fc[74])[_0xa3fc[22]](_0xa3fc[73])[_0xa3fc[72]](_0xa3fc[71]);
					$(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[18]](_0xa3fc[74])[_0xa3fc[22]](_0xa3fc[77])[_0xa3fc[20]](_0xa3fc[76]);
					var _0x8220xc = $(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[22]](_0xa3fc[78]);
					if (_0x8220xc[_0xa3fc[80]](_0xa3fc[79])) {
						_0x8220xc[_0xa3fc[81]](_0xa3fc[71]);
						$(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[25]](_0xa3fc[76]);
					} else {
						$(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[18]](_0xa3fc[74])[_0xa3fc[22]](_0xa3fc[73])[_0xa3fc[72]](_0xa3fc[71]);
						$(this)[_0xa3fc[18]](_0xa3fc[75])[_0xa3fc[20]](_0xa3fc[76]);
					};
				};
			})
		},
		HandleSidebartoggle: function() {
			$(_0xa3fc[87])[_0xa3fc[5]](_0xa3fc[0], function() {
				if ($(_0xa3fc[31])[_0xa3fc[3]](_0xa3fc[83]) !== _0xa3fc[84]) {
					$(_0xa3fc[44])[_0xa3fc[66]](_0xa3fc[35]);
					$(_0xa3fc[39])[_0xa3fc[66]](_0xa3fc[35]);
					if ($(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13]) !== _0xa3fc[15]) {
						$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[15])
					} else {
						$(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13], _0xa3fc[14])
					};
				} else {
					if (!$(_0xa3fc[31])[_0xa3fc[86]](_0xa3fc[85])) {
						$(_0xa3fc[31])[_0xa3fc[25]](_0xa3fc[85])
					} else {
						$(_0xa3fc[31])[_0xa3fc[20]](_0xa3fc[85])
					}
				}
			})
		},
		Handlelpanel: function() {
			function _0x8220xd() {
				var _0x8220xe = $(window)[0][_0xa3fc[88]];
				if (_0x8220xe >= 768 && _0x8220xe <= 1024) {
					$(_0xa3fc[31])[_0xa3fc[3]](_0xa3fc[83], _0xa3fc[89]);
					$(_0xa3fc[36])[_0xa3fc[25]](_0xa3fc[35]);
					$(_0xa3fc[91])[_0xa3fc[3]](_0xa3fc[90], false);
				} else {
					if (_0x8220xe < 768) {
						$(_0xa3fc[31])[_0xa3fc[3]](_0xa3fc[83], _0xa3fc[84]);
						$(_0xa3fc[36])[_0xa3fc[20]](_0xa3fc[35]);
						$(_0xa3fc[91])[_0xa3fc[3]](_0xa3fc[90], _0xa3fc[90]);
					} else {
						if ($(_0xa3fc[4])[_0xa3fc[3]](_0xa3fc[13]) !== _0xa3fc[15]) {
							$(_0xa3fc[31])[_0xa3fc[3]](_0xa3fc[83], _0xa3fc[92]);
							$(_0xa3fc[36])[_0xa3fc[20]](_0xa3fc[35]);
							$(_0xa3fc[91])[_0xa3fc[3]](_0xa3fc[90], false);
						} else {
							$(_0xa3fc[31])[_0xa3fc[3]](_0xa3fc[83], _0xa3fc[92]);
							$(_0xa3fc[36])[_0xa3fc[25]](_0xa3fc[35]);
							$(_0xa3fc[91])[_0xa3fc[3]](_0xa3fc[90], false);
						}
					}
				};
			}
			_0x8220xd();
			$(window)[_0xa3fc[54]](_0x8220xd);
		}
	};
	HoeDatapp[_0xa3fc[93]]();
});
