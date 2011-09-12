/**
* ansSlider jQuery plugin - v.0.2.1 - http://idc.anavallasuiza.com/project/ansslider/
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
				position = settings.index + (parseInt(pos.substr(1), 10) * settings.span);
			} else if (/^\-[0-9]+$/.test(pos)) {
				position = settings.index - (parseInt(pos.substr(1), 10) * settings.span);
			}

			var $target = settings.$slides.filter('[data-anssliderindex=' + position + ']');

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

					//Widget events
					if ($.isFunction(settings.beforeLoad)) {
						$element.bind('ansliderBeforeLoad', settings.beforeLoad);
					}

					if ($.isFunction(settings.load)) {
						$element.bind('ansliderLoad', settings.load);
					}

					if ($.isFunction(settings.change)) {
						$element.bind('ansliderChange', settings.change);
					}

					if ($.isFunction(settings.beforeChange)) {
						$element.bind('ansliderBeforeChange', settings.beforeChange);
					}

					$element.trigger('ansliderBeforeLoad');

					//$slides
					var w = 0;
					
					settings.$slides = $('> ' + settings.filter, this).each(function (index) {
						$(this).attr('data-anssliderindex', index).css({'float': 'left'});
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

					if (settings.scroll) {
						settings.$window.css('overflow-x', 'scroll');
					}

					$element.data('ansSlider', settings);

					//Go to
					$element.ansSlider('goto', settings.index);

					//Buttons
					if (settings.buttons) {
						if ($.isFunction(settings.buttons)) {
							settings.$buttons = $.proxy(settings.buttons, $element)();
						} else {
							settings.$buttons = $(settings.buttons);
						}

						settings.$buttons.click(function () {
							$element.ansSlider('goto', $(this).attr('data-anssliderindex'));
							return false;
						});
					}

					$element.trigger('ansliderLoad');
				});
			},

			goto: function (position) {
				var pos = position;

				return this.each(function () {
					var $element = $(this),
						settings = $element.data('ansSlider'),
						$target = helpers.getTarget(settings, pos);
					
					if ($target) {
						$element.trigger('ansliderBeforeChange', [$target]);

						settings.$tray.delay(settings.delay).animate({
							'left': (($target.position().left * -1) + settings.offset) + 'px'
						}, settings.duration, settings.easing, function () {
							if (settings.$buttons) {
								settings.$buttons.removeClass('selected').filter('[data-anssliderindex=' + $target.attr('data-anssliderindex') + ']').addClass('selected');
							}

							settings.index = parseInt($target.attr('data-anssliderindex'), 10);

							$element.trigger('ansliderChange', [$target]);
						});
					}
				});
			},

			play: function () {
				return this.each(function () {
					var $element = $(this),
						settings = $element.data('ansSlider'),
						index = '+1';

					var interval = function () {
						var $target = helpers.getTarget(settings, index);

						if (!$target) {
							index = (index == '+1') ? '-1' : '+1';
						}

						$element.ansSlider('goto', index);

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
			$.error('Method "' +  method + '" does not exist in ansSlider plugin!');
		}
	}

	$.fn.ansSlider.defaults = {
		width: '100%',
		scroll: false,
		duration: 1000,
		easing: 'swing',
		interval: 5000,
		offset: 0,
		buttons: '',
		index: 0,
		delay: 0,
		span: 1,
		filter: '*',

		beforeChange: false,
		change: false,
		beforeLoad: false,
		load: false
	};
})(jQuery);