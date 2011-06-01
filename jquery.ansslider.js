/**
* ansSlider jQuery plugin - v.0.2 - http://idc.anavallasuiza.com/project/ansslider/
*
* ansSlider is released under the GNU Affero GPL version 3
*
* More information at http://www.gnu.org/licenses/agpl-3.0.html
*/
(function($) {
	var helpers = {
		getTarget: function (settings, pos) {
			var position;

			if (typeof pos == 'number' && pos < 0) {
				position = settings.index + pos;
			} else if (/^[0-9]+$/.test(pos)) {
				position = parseInt(pos, 10);
			} else if (/^\+[0-9]+$/.test(pos)) {
				position = settings.index + parseInt(pos.substr(1), 10);
			} else if (/^\-[0-9]+$/.test(pos)) {
				position = settings.index - parseInt(pos.substr(1), 10);
			}

			var $target = settings.$slides.filter('[rel=' + position + ']');

			if ($target.length) {
				return $target;
			}

			return false;
		}
	};

	$.fn.ansSlider = function (method) {

		var methods = {
			init : function (options) {
				var common_settings = $.extend({}, this.ansSlider.defaults, options);

				return this.each(function() {
					var $element = $(this), element = this, settings = $.extend({}, common_settings);

					//$slides
					var w = 0;

					settings.$slides = $('> *', this).each(function (index) {
						$(this).attr('rel', index).css('float', 'left');
						w += $(this).outerWidth(true);
					});

					//Create html tree
					settings.$slides.wrapAll('<div><div></div></div>');
					settings.$tray = settings.$slides.parent();
					settings.$window = settings.$tray.parent();

					//$tray css properties
					settings.$tray.width(w).css({
						'float': 'left',
						'position': 'relative'
					});

					//$element css properties
					$element.css({
						'float': 'left',
						'width': $element.width() + 'px',
						'position': 'relative',
						'overflow': 'visible'
					});

					//$window css properties
					settings.$window.css({
						'float': 'left',
						'overflow': 'hidden',
						'width': settings.width,
						'padding': '0',
						'position': 'relative'
					});

					$element.data('ansSlider', settings);

					//Go to
					$element.ansSlider('goto', settings.index);

					//Buttons
					if (settings.buttons) {
						$(settings.buttons).click(function () {
							$element.ansSlider('goto', $(this).attr('rel'));
							return false;
						});
					}
				});
			},

			goto: function (position) {
				var pos = position;

				return this.each(function () {
					var $element = $(this),
						settings = $element.data('ansSlider'),
						$target = helpers.getTarget(settings, pos);

					if ($target) {
						if ($.isFunction(settings.before)) {
							$.proxy(settings.before, $element)($target);
						}

						settings.$tray.delay(settings.delay).animate({
							'left': (($target.position().left * -1) + settings.offset) + 'px'
						}, settings.duration, settings.easing, function () {
							if (settings.buttons) {
								$(settings.buttons).removeClass('selected').filter('[rel=' + $target.attr('rel') + ']').addClass('selected');
							}
							if ($.isFunction(settings.after)) {
								$.proxy(settings.after, $element)($target);
							}
						});

						settings.index = parseInt($target.attr('rel'), 10);
					}
				});
			},

			play: function () {
				return this.each(function () {
					var $element = $(this),
						settings = $element.data('ansSlider'),
						rel = '+1';

					var interval = function () {
						var $target = helpers.getTarget(settings, rel);

						if (!$target) {
							rel = (rel == '+1') ? '-1' : '+1';
						}

						$element.ansSlider('goto', rel);

						settings.timeout = setTimeout(interval, parseInt(settings.interval));
					}

					settings.timeout = setTimeout(interval, parseInt(settings.interval));
				});
			},

			stop: function () {
				return this.each(function () {
					var settings = $(this).data('ansSlider');

					clearTimeout(settings.timeout);
				});
			}
		}

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method "' +  method + '" does not exist in ansSlider plugin!');
		}
	}

	$.fn.ansSlider.defaults = {
		width: '100%',
		duration: 1000,
		easing: 'swing',
		interval: 5000,
		offset: 0,
		buttons: '',
		index: 0,
		delay: 0,
		before: false,
		after: false
	};
})(jQuery);