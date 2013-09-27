/**
 * ansSlider jQuery plugin - v.1.0.0 - http://idc.anavallasuiza.com/project/ansslider/
 *
 * ansSlider is released under the GNU Affero GPL version 3
 *
 * More information at http://www.gnu.org/licenses/agpl-3.0.html
 */
;(function ($, window, document, undefined) {
	var pluginName = "ansSlider", defaults = {
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
		filter: '*',

		beforeLoad: null,
		afterLoad: null,

		beforeChangeSlide: null,
		afterChangeSlide: null,
		beforeLoadSlide: null,
		afterLoadSlide: null,
		firstSlide: null,
		lastSlide: null
	};

	function Plugin (element, options) {
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend({}, defaults, options);

		this.init();
	}

	Plugin.prototype = {
		_bind: function (event, callback) {
			this.$element.on(event + '.' + pluginName, callback);
		},
		init: function () {
			var that = this;

			//Widget events
			if ($.isFunction(this.settings.beforeLoad)) {
				this._bind('beforeLoad', this.settings.beforeLoad);
			}

			if ($.isFunction(this.settings.afterLoad)) {
				this._bind('afterLoad', this.settings.afterLoad);
			}

			if ($.isFunction(this.settings.beforeChangeSlide)) {
				this._bind('beforeChangeSlide', this.settings.beforeChangeSlide);
			}

			if ($.isFunction(this.settings.afterChangeSlide)) {
				this._bind('afterChangeSlide', this.settings.afterChangeSlide);
			}

			if ($.isFunction(this.settings.beforeLoadSlide)) {
				this._bind('beforeLoadSlide', this.settings.beforeLoadSlide);
			}

			if ($.isFunction(this.settings.afterLoadSlide)) {
				this._bind('afterLoadSlide', this.settings.afterLoadSlide);
			}

			if ($.isFunction(this.settings.firstSlide)) {
				this._bind('firstSlide', this.settings.firstSlide);
			}

			if ($.isFunction(this.settings.lastSlide)) {
				this._bind('lastSlide', this.settings.lastSlide);
			}

			this.$element.trigger('beforeLoad');

			//$slides
			var w = 0;
			
			this.$slides = $('> ' + this.settings.filter, this.$element).each(function () {
				w += $(this).css({'float': 'left'}).outerWidth(true);
			});

			//Create html tree
			this.$slides.wrapAll('<div><div></div></div>');
			this.$tray = this.$slides.parent().addClass('ansSlider-tray');
			this.$window = this.$tray.parent().addClass('ansSlider-window');

			//$tray css properties
			this.$tray.width(w).css({
				'float': 'left',
				'position': 'relative'
			});

			
			//$element css properties
			this.$element.css({
				'float': 'left',
				'position': 'relative',
				'overflow': 'visible'
			});

			if (this.settings.width) {
				this.$element.css('width', this.settings.width);
			}

			//$window css properties
			this.$window.css({
				'float': 'left',
				'overflow': 'hidden',
				'width': '100%',
				'padding': '0',
				'position': 'relative'
			});

			if (this.settings.scroll) {
				this.settings.$window.css('overflow-x', 'scroll');
			}

			//Go to
			this.index = this.settings.index || 0;
			this['goto'](this.index);

			//Buttons
			if (this.settings.buttons) {
				if ($.isFunction(this.settings.buttons)) {
					this.$buttons = $.proxy(this.settings.buttons, this.$element)();
				} else {
					this.$buttons = $(this.settings.buttons);
				}

				this.$buttons.on('click.' + pluginName, function () {
					that['goto']($(this).attr('data-anssliderindex'));
					return false;
				});
			}

			this.$element.trigger('afterLoad');
			
			this.$element.bind('touchstart', function(event) {
				var changed = event.originalEvent.changedTouches;

				$(this).data('origx', changed[0].pageX);
				$(this).data('origy', changed[0].pageY);
			});
			
			this.$element.bind('touchmove', function(event) {
				
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
			
			this.$element.bind('touchend', function(event) {
				$(this).data('moving', false);
			});
			
			$(window).resize(function(){
				that['goto'](that.index);
			});
		},
		goto: function (position) {
			var that = this;
			var	$target = this.getSlide(position);

			if ($target) {
				var target_index = $target.index();
				var offset = this.settings.offset;

				if (offset === 'center') {
					offset = (this.settings.$window.width() - $target.width()) / 2;
				}

				var left = (($target.position().left * -1) + offset - parseInt($target.css('marginLeft'), 10));

				if (this.settings.fitToLimits) {
					if (left > 0) {
						left = 0;
					} else if (left < (this.$tray.width() - this.$window.width()) * -1) {
						left = (this.$tray.width() - this.$window.width()) * -1;
					}
				}

				this.$element.trigger('beforeChangeSlide', [$target]);

				this.$tray.delay(this.settings.delay).animate({
					'left': left + 'px'
				},{
					duration: this.settings.duration,
					easing: this.settings.easing,
					queue: false,
					complete: function () {
						if (that.$buttons) {
							that.$buttons.removeClass('selected').filter('[data-anssliderindex=' + target_index + ']').addClass('selected');
						}

						that.index = target_index;

						that.$element.trigger('afterChangeSlide', [$target]);

						if (that.currentSlideIs('first')) {
							that.$element.trigger('firstSlide', [$target]);
						}

						if (that.settings.fitToLimits) {
							if (that.slideIsVisible('last')) {
								that.$element.trigger('lastSlide', [$target]);
							}
						} else if (that.currentSlideIs('last')) {
							that.$element.trigger('lastSlide', [$target]);
						}
					}
				});
			}
		},
		currentSlideIs: function (position) {
			if (typeof position === "object" && position.jquery && position.parent().is(this.$tray)) {
				return (this.index === position.index()) ? true : false;
			}
			if (typeof position === 'number') {
				return (this.index === position) ? true : false;
			}
			if (position === 'first') {
				return (this.index === 0) ? true : false;
			}
			if (position === 'last') {
				return (this.index === (this.$slides.length - 1)) ? true : false;
			}

			return false;
		},
		getSlide: function (pos) {
			var position;

			if (!pos && pos !== 0) {
				pos = this.index;
			}

			if (this.$window.width() > this.$tray.outerWidth(true)) {
				return false;
			}

			if (typeof pos === "object" && pos.jquery && pos.parent().is(this.$tray)) {
				position = pos.index();
			} else if (typeof pos === "number") {
				position = pos;
			} else if (/^[0-9]+$/.test(pos)) {
				position = parseInt(pos, 10);

				if (position > this.$slides.length - 1) {
					position = this.$slides.length - 1;
				}
			} else if (/^\+[0-9]+$/.test(pos)) {
				position = this.index + (parseInt(pos.substr(1), 10));

				if (position > this.$slides.length - 1) {
					return undefined;
				}

				if (this.slideIsVisible('last')) {
					position = this.index;
				}
				
			} else if (/^\-[0-9]+$/.test(pos)) {
				position = this.index - (parseInt(pos.substr(1), 10));
				
				if (position < 0) {
					return undefined;
				}
			} else if (pos === 'last') {
				position = this.$slides.length - 1;
			} else if (pos === 'first') {
				position = 0;
			} else {
				return false;
			}

			var $target = this.$slides.eq(position);

			if ($target.length) {
				return $target;
			}

			return false;
		},
		slideIsVisible: function (position) {
			var $slide = this.getSlide(position);

			var slidePointLeft = Math.round($slide.position().left + this.$tray.position().left + parseInt($slide.css('marginLeft')));
			var slidePointRight = Math.round(slidePointLeft + $slide.outerWidth());
			var window_width = this.$window.width();

			if ((slidePointLeft <= 0 && slidePointRight >= window_width) || (slidePointLeft >= 0 && slidePointLeft <= window_width && slidePointRight >= 0 && slidePointRight <= window_width)) {
				return true;
			}

			return false;
		},
		addAjaxSlide: function (ajax_settings, position) {
			if (typeof ajax_settings !== 'object' || !ajax_settings.url) {
				return this;
			}

			var that = this,
				pos = (position === undefined) ? -1 : position,
				callback = ajax_settings.success,
				escaped_url = ajax_settings.url.replace(/[^\w-]/, '');

			var	$target = this.$slides.filter('[data-anssliderurl="' + escaped_url + '"]');

			if ($target.length) {
				if ($.isFunction(callback)) {
					$.proxy(callback, this.$element)($target);
				}
			}

			this.$element.trigger('beforeLoadSlide', [ajax_settings, pos]);

			var ajax = $.extend({}, ajax_settings, {
				success: function (html) {
					$target = that.getSlide(pos);

					var $slide = $(html, {'data-anssliderurl': escaped_url}).css({'float': 'left'});

					if (pos < 0) {
						$slide.insertAfter($target);
					} else {
						$slide.insertBefore($target);
					}

					that.$tray.width(that.$tray.width() + $slide.outerWidth(true));
					that.$slides = that.$tray.children();

					if ($.isFunction(callback)) {
						$.proxy(callback, that.$element)($slide);
					}

					that.$element.trigger('afterLoadSlide', [$slide]);
				}
			});

			$.ajax(ajax);
		},
		loadAjaxSlides: function (ajax_settings) {
			var that = this;

			var ajax = $.extend({}, ajax_settings, {
				success: function (html) {
					that.destroy(html);
					that.$element.html(html);
					that.init();
				}
			});

			$.ajax(ajax);
		},
		play: function () {
			var that = this,
				index = '+1';

			var interval = function () {
				if (that.slideIsVisible('last')) {
					index = '-1';
				} else if (that.slideIsVisible('first')) {
					index = '+1';
				}

				that['goto'](index);

				that.timeout = setTimeout(interval, this.settings.interval);
			}

			this.timeout = setTimeout(interval, this.settings.interval);
		},

		stop: function () {
			clearTimeout(this.timeout);
		},

		destroy: function () {
			this.$element.off('.' + pluginName);
			this.$element.html(this.$slides);

			if (this.$buttons) {
				this.$buttons.off('.' + pluginName);
			}
		}
	};

	$.fn[pluginName] = function (options) {
		if ((options === undefined) || (typeof options === 'object')) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options));
				}
			});
		}

		if ((typeof options === 'string') && (options[0] !== '_') && (options !== 'init')) {
			var returns, args = arguments;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);

				if ((instance instanceof Plugin) && (typeof instance[options] === 'function')) {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}

				if (options === 'destroy') {
				  $.data(this, 'plugin_' + pluginName, null);
				}
			});

			return returns !== undefined ? returns : this;
		}
	};
})(jQuery, window, document);
