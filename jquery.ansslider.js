(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
	var pluginName = "ansSlider", defaults = {
		interval: 5000,
		offset: 0,
		fitToLimits: false,
		buttons: '',
		index: 0,
		filter: '*'
	};

	function Plugin (element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);

		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this.$element = $(this.element);
			this.$tray = this.$element.children();
			this.$slides = this.$tray.children(this.settings.filter);

			//Events
			if (this.settings.enter) {
				this.$slides.on('enter.' + pluginName, this.settings.enter);
			}

			if (this.settings.leave) {
				this.$slides.on('leave.' + pluginName, this.settings.leave);
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

				var that = this;
				this.$buttons.on('click.' + pluginName, function () {
					that['goto']($(this).attr('data-anssliderindex'));
					return false;
				});
			}
			
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
							
							$element[pluginName]('goto', step);
							
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
		},

		goto: function (position) {
			var that = this;
			var	$target = this.getSlide(position);

			if ($target && $target.length) {
				this.getSlide('current').trigger('leave');

				this.index = $target.index();				
				var x = 0;

				$target.prevAll().each(function () {
					x -= $(this).outerWidth(true);
				});

				//offset
				if (this.settings.offset === 'center') {
					x += (this.$element.width() - $target.width()) / 2;
				} else {
					x += this.settings.offset || 0;
				}

				//fitToLimits
				if (this.settings.fitToLimits) {
					var lastx = this.$element.width();

					this.getSlide('last').prevAll().addBack().each(function () {
						lastx -= $(this).outerWidth(true);
					});

					if (x < lastx) {
						x = lastx;
					}

					if (x > 0) {
						x = 0;
					}
				}

				$target.trigger('enter');

				this.$tray.css('transform', 'translateX(' + x + 'px)');
			}
		},

		getSlides: function () {
			return this.$slides;
		},

		getSlide: function (position) {
			if (position === undefined || position === 'current') {
				return this.$slides.eq(this.index);
			}

			if (typeof position === "object" && position.jquery && position.parent().is(this.$tray)) {
				return position;
			}

			if (position === 'first') {
				return this.$slides.first();
			}

			if (position === 'last') {
				return this.$slides.last();
			}

			if (typeof position === 'number') {
				return this.$slides.eq(position);
			}

			if (/^[0-9]+$/.test(position)) {
				return this.$slides.eq(parseInt(position, 10));
			}

			if (/^\+[0-9]+$/.test(position)) {
				position = this.index + (parseInt(position.substr(1), 10));

				return this.$slides.eq(position);
			}

			if (/^\-[0-9]+$/.test(position)) {
				position = this.index - (parseInt(position.substr(1), 10));

				return this.$slides.eq(position);
			}
		},

		play: function () {
			var that = this,
				index = '+1';

			var interval = function () {
				if (that.getSlide('last').index() === that.index) {
					index = '-1';
				} else if (that.index === 0) {
					index = '+1';
				}

				that['goto'](index);

				that.timeout = setTimeout(interval, that.settings.interval);
			}

			this.timeout = setTimeout(interval, this.settings.interval);
		},

		stop: function () {
			clearTimeout(this.timeout);
		},

		destroy: function () {
			this.$slides.off('.' + pluginName);

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

}));
