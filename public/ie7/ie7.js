/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referring to this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'dc-fonticons\'">' + entity + '</span>' + html;
	}
	var icons = {
		'dc-color-pallete': '&#xe604;',
		'dc-folder': '&#xe623;',
		'dc-more-left': '&#xe624;',
		'dc-more-right': '&#xe625;',
		'dc-powerpoint': '&#xe626;',
		'dc-add-people': '&#xe61c;',
		'dc-close': '&#xe61d;',
		'dc-close-o': '&#xe61e;',
		'dc-logout': '&#xe61f;',
		'dc-plus': '&#xe620;',
		'dc-settings': '&#xe621;',
		'dc-upload': '&#xe622;',
		'dc-chat': '&#xe600;',
		'dc-circle': '&#xe601;',
		'dc-clear-all': '&#xe602;',
		'dc-color': '&#xe603;',
		'dc-eraser': '&#xe605;',
		'dc-eraser-path': '&#xe606;',
		'dc-font': '&#xe607;',
		'dc-group': '&#xe608;',
		'dc-line': '&#xe609;',
		'dc-marker': '&#xe60a;',
		'dc-menu-arrow-down': '&#xe60b;',
		'dc-mic': '&#xe60c;',
		'dc-mic-slash': '&#xe60d;',
		'dc-more-down': '&#xe60e;',
		'dc-more-up': '&#xe60f;',
		'dc-notes': '&#xe610;',
		'dc-pencil': '&#xe611;',
		'dc-pointer': '&#xe612;',
		'dc-rectangle': '&#xe613;',
		'dc-size-l': '&#xe614;',
		'dc-size-m': '&#xe615;',
		'dc-size-s': '&#xe616;',
		'dc-slide-share': '&#xe617;',
		'dc-video': '&#xe618;',
		'dc-video-slash': '&#xe619;',
		'dc-white-board': '&#xe61a;',
		'dc-window-share': '&#xe61b;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/dc-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
