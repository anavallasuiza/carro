/**
* ansSlider jQuery plugin - v.0.1 - http://idc.anavallasuiza.com/ansslider/
*
* ansSlider is released under the GNU Affero GPL version 3
*
* More information at http://www.gnu.org/licenses/agpl-3.0.html
*/
(function($) {
	$.fn.extend({
		ansSlider: function (options, value) {
			var default_options = {
				'buttons': '.ansslider-button',
				'select_class': 'active',
				'duration': 2000,
				'autoplay': 0,
				'beforeChange': '',
				'afterChange': '',
				'delayBeforeChange': 0
			};

			//Init ansSlider
			var init = function (options) {
				this.ansSlider = options;
				this.ansSlider.slide_main = this;
				this.ansSlider.slides = $('> *', this);
				this.ansSlider.slide_buttons = $(options.buttons);
				this.ansSlider.current_slide_index = 0;
				this.ansSlider.current_slide = this.ansSlider.slides[this.ansSlider.current_slide_index];

				$(this.ansSlider.slides).wrapAll('<div><div></div></div>');

				this.ansSlider.slide_window = $('> div', this);
				this.ansSlider.slide_tray = $('> div', this.ansSlider.slide_window);

				//slide_main properties
				$(this.ansSlider.slide_main).css({
					'float': 'left',
					'width': $(this.ansSlider.slide_main).width() + 'px',
					'position': 'relative',
					'overflow': 'visible'
				});

				//slide_tray properties
				var tray_width = 0;

				//Slides properties
				$(this.ansSlider.slides).each(function () {
					tray_width += $(this).width() + parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
					$(this).css('float', 'left');
				});

				$(this.ansSlider.slide_tray).width(tray_width).css({
					'float': 'left',
					'position': 'relative'
				});

				//slide_window properties
				$(this.ansSlider.slide_window).css({
					'float': 'left',
					'overflow': 'hidden',
					'width': '100%',
					'padding': '0',
					'position': 'relative'
				});

				//Buttons events
				$(this.ansSlider.slide_buttons).click(function () {
					$.proxy(goto, this)($(this).attr('rel'));

					return false;
				});

				//Autoplay
				if (this.ansSlider.autoplay) {
					$(this.ansSlider.slide_window).data('hover', false);

					var direction = 'next';

					var interval = function () {
						if ($(this.ansSlider.slide_window).data('hover')) {
							this.ansSlider.autoplayTimeout = setTimeout($.proxy(interval, this), parseInt(this.ansSlider.autoplay));
							return;
						}
						
						if (direction == 'prev' && $(this.ansSlider.current_slide).index() == 0) {
							direction = 'next';
						} else if (direction == 'next' && $(this.ansSlider.current_slide).index() == ($(this.ansSlider.slides).length -1)) {
							direction = 'prev';
						}

						$.proxy(goto, this)(direction, function () {
							this.ansSlider.autoplayTimeout = setTimeout($.proxy(interval, this), parseInt(this.ansSlider.autoplay));
						});
					}

					this.ansSlider.autoplayTimeout = setTimeout($.proxy(interval, this), parseInt(this.ansSlider.autoplay));

					$(this.ansSlider.slide_window).bind('mouseenter', function () {
						$(this).data('hover', true);
					});
					
					$(this.ansSlider.slide_window).bind('mouseleave', function () {
						$(this).data('hover', false);
					});
				}
			}
			
			var goto = function (index, fn) {
				switch (index) {
					case 'next':
						var index = $(this.ansSlider.current_slide).index() + 1;
						break;

					case 'prev':
						var index = $(this.ansSlider.current_slide).index() - 1;
						break;

					default:
						index = parseInt(index);
				}

				var target_slide = $(this.ansSlider.slides).eq(index);

				if ($(target_slide).length) {
					this.ansSlider.current_slide_index = index;
					this.ansSlider.current_slide = target_slide;

					$(this.ansSlider.slide_buttons).removeClass(this.ansSlider.select_class);
					$(this.ansSlider.slide_buttons).filter('[rel=' + index + ']').addClass(this.ansSlider.select_class);

					var position = $(target_slide).position();

					if (position == null) {
						position = '0px';
					} else {
						position = '-' + position.left + 'px';
					}

					var that = this;

					if ($.isFunction(that.ansSlider.beforeChange)) {
						$.proxy(that.ansSlider.beforeChange, that)();
					}

					$(this.ansSlider.slide_tray).delay(that.ansSlider.delayBeforeChange).animate({
						'left': position
					}, this.ansSlider.duration, function () {
						if ($.isFunction(that.ansSlider.afterChange)) {
							$.proxy(that.ansSlider.afterChange, that)();
						}
						if ($.isFunction(fn)) {
							$.proxy(fn, that)();
						}
					});
				}
			}

			$(this).each(function () {
				switch (options) {
					case 'goto':
					$.proxy(goto, this)(value);
					break;
					
					default:
					this.ansSlider = {};
					options = $.extend(default_options, options);

					$.proxy(init, this)(options);
				}
			});
			
			return this;
		}
	});
})(jQuery);