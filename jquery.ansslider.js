/**
 * ansSlider jQuery plugin - v.0.4 - http://idc.anavallasuiza.com/project/ansslider/
 *
 * ansSlider is released under the GNU Affero GPL version 3
 *
 * More information at http://www.gnu.org/licenses/agpl-3.0.html
 */
(function($) {
	
	var helpers = {
		getTarget: function ($element, pos) {
			var position;
			var settings = $element.data('ansSlider');

			if (settings.$window.width() > settings.$tray.outerWidth(true)) {
				return false;
			}

			if (typeof pos === "object" && pos.jquery && pos.parent().is(settings.$tray)) {
				position = pos.index();
			} else if (typeof pos === "number") {
				position = pos;
			} else if (/^[0-9]+$/.test(pos)) {
				position = parseInt(pos, 10);

				if (position > settings.$slides.length - 1) {
					position = settings.$slides.length - 1;
				}
			} else if (/^\+[0-9]+$/.test(pos)) {
				position = settings.index + (parseInt(pos.substr(1), 10) * settings.span);

				if ($element.ansSlider('slideIsVisible', 'last')) {
					position = settings.index;
				} else if (position > settings.$slides.length - 1) {
					position = settings.$slides.length - 1;
				}
				
			} else if (/^\-[0-9]+$/.test(pos)) {
				position = settings.index - (parseInt(pos.substr(1), 10) * settings.span);
				
				if (position < 0) {
					position = 0;
				}
			} else if (pos === 'last') {
				position = settings.$slides.length - 1;
			} else if (pos === 'first') {
				position = 0;
			} else {
				return false;
			}

			var $target = settings.$slides.eq(position);

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

					if ($element.data('ansSlider')) {
						return;
					}

					//Widget events
					if ($.isFunction(settings.beforeLoad)) {
						$element.bind('ansSliderBeforeLoad', settings.beforeLoad);
					}

					if ($.isFunction(settings.load)) {
						$element.bind('ansSliderLoad', settings.load);
					}

					if ($.isFunction(settings.changeSlide)) {
						$element.bind('ansSliderChangeSlide', settings.changeSlide);
					}

					if ($.isFunction(settings.beforeChangeSlide)) {
						$element.bind('ansSliderBeforeChangeSlide', settings.beforeChangeSlide);
					}

					if ($.isFunction(settings.firstSlide)) {
						$element.bind('ansSliderFirstSlide', settings.firstSlide);
					}

					if ($.isFunction(settings.lastSlide)) {
						$element.bind('ansSliderLastSlide', settings.lastSlide);
					}
					
					if ($.isFunction(settings.loadSlide)) {
						$element.bind('ansSliderLoadSlide', settings.loadSlide);
					}

					if ($.isFunction(settings.beforeLoadSlide)) {
						$element.bind('ansSliderBeforeLoadSlide', settings.beforeLoadSlide);
					}

					$element.trigger('ansSliderBeforeLoad');

					//$slides
					var w = 0;
					
					settings.$slides = $('> ' + settings.filter, this).each(function () {
						$(this).css({'float': 'left'});
						w += $(this).outerWidth(true);
					});

					//Create html tree
					settings.$slides.wrapAll('<div><div></div></div>');
					settings.$tray = settings.$slides.parent().addClass('ansSlider-tray');
					settings.$window = settings.$tray.parent().addClass('ansSlider-window');

					//$tray css properties
					settings.$tray.width(w).css({
						'float': 'left',
						'position': 'relative'
					});

					
					//$element css properties
					$element.css({
						'float': 'left',
						'position': 'relative',
						'overflow': 'visible'
					});

					if (settings.width) {
						$element.css('width', settings.width);
					}

					//$window css properties
					settings.$window.css({
						'float': 'left',
						'overflow': 'hidden',
						'width': '100%',
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

					$element.trigger('ansSliderLoad');
					
					
					$element.bind('touchstart', function(event) {
						
						var changed = event.originalEvent.changedTouches;
						
						$(this).data('origx', changed[0].pageX);
						$(this).data('origy', changed[0].pageY);
					});
					
					$element.bind('touchmove', function(event) {
						
						if (!$(this).data('moving')) {
							var changed = event.originalEvent.changedTouches;
							var touches = event.originalEvent.touches;
							
							var x1 = changed[0].pageX;
							var y1 = changed[0].pageY;
							
							var x2 = $(this).data('origx');
							var y2 = $(this).data('origy');
								
	
							var x3 = x2 - x1;
							var y3 = y2 - y1;
							
							var theta = Math.atan2(-y3, x3);
							if (theta < 0) {
								theta += 2 * Math.PI;
							}
							
							var grados = Math.round(theta * (180 / Math.PI));
							
							if (grados <= 45 || (grados >= 135 && grados <= 225) || grados > 315) {
								
								if (x2 !== x1) {
									
									var step = (x2 < x1) ? '-1' : '+1';
									
									$element.ansSlider('goto', step);
									
									$(this).data('moving', true);
									
									event.preventDefault();
									event.stopPropagation();
								}
							}
						}
					});
					
					$element.bind('touchend', function(event) {
						$(this).data('moving', false);
					});
					
					$(window).resize(function(){
						$element.ansSlider('goto', $element.data('ansSlider').index);
					})
				});
			},

			goto: function (position) {
				var pos = position;

				return this.each(function () {
					var $element = $(this);
					var	settings = $element.data('ansSlider');
					var	$target = helpers.getTarget($element, pos);

					if ($target) {
						var target_index = $target.index();
						var offset = settings.offset;

						if (offset === 'center') {
							offset = (settings.$window.width() - $target.width()) / 2;
						}

						var left = (($target.position().left * -1) + offset - parseInt($target.css('marginLeft'), 10));

						if (settings.fitToLimits) {
							if (left > 0) {
								left = 0;
							} else if (left < (settings.$tray.width() - settings.$window.width()) * -1) {
								left = (settings.$tray.width() - settings.$window.width()) * -1;
							}
						}

						$element.trigger('ansSliderBeforeChangeSlide', [$target]);

						settings.$tray.delay(settings.delay).animate({
							'left': left + 'px'
						},{
							duration: settings.duration,
							duration: settings.easing,
							queue: false,
							complete: function () {
								if (settings.$buttons) {
									settings.$buttons.removeClass('selected').filter('[data-anssliderindex=' + target_index + ']').addClass('selected');
								}

								settings.index = target_index;

								$element.trigger('ansSliderChangeSlide', [$target]);

								if ($element.ansSlider('currentSlideIs', 'first')) {
									$element.trigger('ansSliderFirstSlide', [$target]);
								}

								if ($element.ansSlider('currentSlideIs', 'last')) {
									$element.trigger('ansSliderLastSlide', [$target]);
								}
							}
						});
					}
				});
			},

			currentSlideIs: function (position) {
				var settings = this.eq(0).data('ansSlider');

				if (typeof position === "object" && position.jquery && position.parent().is(settings.$tray)) {
					return (settings.index === position.index()) ? true : false;
				}
				if (typeof position === 'number') {
					return (settings.index === position) ? true : false;
				}
				if (position === 'first') {
					return (settings.index === 0) ? true : false;
				}
				if (position === 'last') {
					return (settings.index === (settings.$slides.length - 1)) ? true : false;
				}

				return false;
			},

			getSlide: function (position) {
				var settings = this.eq(0).data('ansSlider');

				if (!position && position !== 0) {
					position = settings.index;
				}

				return helpers.getTarget($(this), position);
			},

			slideIsVisible: function (position) {
				var settings = this.eq(0).data('ansSlider');
				var $slide = $(this).ansSlider('getSlide', position);

				var slidePointLeft = Math.round($slide.position().left + settings.$tray.position().left + parseInt($slide.css('marginLeft')));
				var slidePointRight = Math.round(slidePointLeft + $slide.outerWidth(true));
				var window_width = settings.$window.width();

				var left_is_visible = (slidePointLeft >= 0) && slidePointLeft <= window_width;
				var right_is_visible = (slidePointRight >= 0) && slidePointRight <= window_width;

				if (left_is_visible && right_is_visible) {
					return true;
				}

				if ((left_is_visible || right_is_visible) && window_width < $slide.outerWidth(true)) {
					return true;
				}

				return false;
			},

			load: function (ajax_settings, position) {
				if (typeof ajax_settings != 'object' || !ajax_settings.url) {
					return this;
				}

				var pos = (position == undefined) ? -1 : position;
				var callback = ajax_settings.success;
				var escaped_url = ajax_settings.url.replace(/[^\w-]/, '');

				return this.each(function () {
					var $element = $(this);
					var settings = $element.data('ansSlider');
					var	$target = settings.$slides.filter('[data-anssliderurl="' + escaped_url + '"]');

					if ($target.length) {
						if ($.isFunction(callback)) {
							$.proxy(callback, $element)($target);
						}
					}

					$element.trigger('ansSliderBeforeLoadSlide', [ajax_settings, position]);

					var ajax = $.extend({}, ajax_settings, {
						success: function (html) {
							$target = helpers.getTarget($element, pos);

							var $slide = $(html, {'data-anssliderurl': escaped_url}).css({'float': 'left'});

							if (pos < 0) {
								$slide.insertAfter($target);
							} else {
								$slide.insertBefore($target);
							}

							settings.$tray.width(settings.$tray.width() + $slide.outerWidth(true));
							settings.$slides = settings.$tray.children();

							if ($.isFunction(callback)) {
								$.proxy(callback, $element)($slide);
							}

							$element.trigger('ansSliderLoadSlide', [$slide]);
						}
					});

					$.ajax(ajax);
				});
			},

			play: function () {
				return this.each(function () {
					var $element = $(this),
						settings = $element.data('ansSlider'),
						index = '+1';

					var interval = function () {
						if ($element.ansSlider('slideIsVisible', 'last')) {
							index = '-1';
						} else if ($element.ansSlider('slideIsVisible', 'first')) {
							index = '+1';
						}

						$element.ansSlider('goto', index);

						settings.timeout = setTimeout(interval, settings.interval);
					}

					settings.timeout = setTimeout(interval, settings.interval);
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
		width: false,
		scroll: false,
		duration: 1000,
		easing: 'swing',
		interval: 5000,
		offset: 0,
		fitToLimits: false,
		buttons: '',
		index: 0,
		delay: 0,
		span: 1,
		filter: '*',

		beforeLoad: null,
		load: null,

		beforeChangeSlide: null,
		changeSlide: null,
		beforeLoadSlide: null,
		loadSlide: null,
		firstSlide: null,
		lastSlide: null
	};
})(jQuery);