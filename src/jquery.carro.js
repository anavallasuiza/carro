(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var pluginName = "carro", defaults = {
        autoPlay: false,
        buttons: '',
        fitToLimits: false,
        fluid: false,
        index: 0,
        interval: 5000,
        offset: 0,
        slideActiveClass: '',
        buttonActiveClass: '',
        slidesFilter: '*',
        trayFilter: '*'
    };

    function Plugin (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var self = this;

            this.$element = $(this.element);
            this.$tray = this.$element.children(this.settings.trayFilter).first();
            this.$slides = this.$tray.children(this.settings.slidesFilter);

            //Events
            if (this.settings.enter) {
                this.$slides.on('enter.' + pluginName, this.settings.enter);
            }

            if (this.settings.leave) {
                this.$slides.on('leave.' + pluginName, this.settings.leave);
            }

            if (this.settings.slideActiveClass) {
                this.$slides.on('leave.' + pluginName, function () {
                    $(this).removeClass(self.settings.slideActiveClass);
                });
                this.$slides.on('enter.' + pluginName, function () {
                    $(this).addClass(self.settings.slideActiveClass);
                });
            }

            //Buttons
            if (this.settings.buttons) {
                if ($.isFunction(this.settings.buttons)) {
                    this.$buttons = $.proxy(this.settings.buttons, this.$element)();
                } else {
                    this.$buttons = $(this.settings.buttons);
                }

                this.$buttons.on('click.' + pluginName, function () {
                    self['goto']($(this).attr('data-carro'));
                    return false;
                });

                if (this.settings.buttonActiveClass) {
                    this.$slides.on('enter.' + pluginName, function () {
                        self.$buttons.filter('[data-carro="' + $(this).index() + '"]').addClass(self.settings.buttonActiveClass);
                    });

                    this.$slides.on('leave.' + pluginName, function () {
                        self.$buttons.filter('[data-carro="' + $(this).index() + '"]').removeClass(self.settings.buttonActiveClass);
                    });
                }
            }

            //Go to
            this.index = this.settings.index || 0;
            this['goto'](this.index);

            //Autoplay
            if (this.settings.autoPlay) {
                this.play();
            }
        },

        goto: function (position) {
            var that = this;
            var $target = this.getSlide(position);

            if ($target && $target.length) {
                this.getSlide('current').trigger('leave');

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

                    if (!this.settings.fluid) {
                        this.index = $target.index();
                    }

                    if (x < lastx) {
                        x = lastx;
                    } else if (x > 0) {
                        x = 0;
                    } else {
                        this.index = $target.index();
                    }
                } else {
                    this.index = $target.index();
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
                return this._eq(this.index);
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
                return this._eq(position);
            }

            if (/^[0-9]+$/.test(position)) {
                return this._eq(parseInt(position));
            }

            if (/^\+[0-9]+$/.test(position)) {
                position = this.index + (parseInt(position.substr(1), 10));

                return this._eq(position);
            }

            if (/^\-[0-9]+$/.test(position)) {
                position = this.index - (parseInt(position.substr(1), 10));

                return this._eq(position);
            }
        },

        _eq: function (position) {
            if (position < 0) {
                return this.$slides.first();
            }

            if (position >= this.$slides.length) {
                return this.$slides.last();
            }

            return this.$slides.eq(position);
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
