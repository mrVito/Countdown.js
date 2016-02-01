var Countdown = (function () {
    "use strict";

    function Countdown(elements, options) {
        this.defaults = {
            endTimeAttr: 'data-time',
            secondsAttr: 'data-seconds',
            dayTextAttr: 'data-text',
            useDayTextAttr: true,
            initText: '---',
            endedText: '---',
            usePlurals: false,
            showZeroDays: true,
            showZeroHours: true,
            daySingle: ' d. ',
            dayPlural: ' d. ',
            dayGenitive: ' d. ',
            hourSingle: ':',
            hourPlural: ':',
            hourGenitive: ':',
            minuteSingle: ':',
            minutePlural: ':',
            minuteGenitive: ':',
            secondSingle: '',
            secondPlural: '',
            secondGenitive: '',
            callback: null
        };

        this.options = $.extend({}, this.defaults, options);

        this.counters = [];
        this.removeQueue = [];
        this.stopped = true;

        this.init(elements);
    }

    /**
     * Initialize Countdown
     * Create Counter instances and push to collection
     *
     * @param elements DOM elements to be used with Counter
     */
    Countdown.prototype.init = function (elements) {
        var _this = this;

        elements.each(function (index, el) {
            var counter = new Counter(index, $(el), _this);

            counter.changeText(_this.options.initText);

            _this.counters.push(counter);
        });

        this.startTimer();
    };

    /**
     * Start a countdown timer
     */
    Countdown.prototype.startTimer = function () {
        this.stopped = false;

        setTimeout(this.doTick.bind(this), 1000);
    };

    /**
     * Stop the countdown timer
     */
    Countdown.prototype.stopTimer = function () {
        this.stopped = true;
    };

    /**
     * Check if we need another tick then
     * call a tick handler and set next timeout
     */
    Countdown.prototype.doTick = function () {
        if(this.stopped) {
            return;
        }

        if( ! this.counters.length) {
            this.stopTimer();

            return;
        }

        this.tick();
        this.startTimer();
    };

    /**
     * Tick handler
     * Invoked every second
     */
    Countdown.prototype.tick = function () {
        var timeNow = this.getTimeNow();

        this.counters.forEach(function (counter) {
            counter.countDown(timeNow);
        });

        this.removeQueued();
    };

    /**
     * Remove queued Counters
     */
    Countdown.prototype.removeQueued = function () {
        var _this = this;

        this.removeQueue.forEach(function (id) {
            _this.counters.removeWhere('id', id);
        });

        this.removeQueue = [];
    };

    /**
     * Queue an id of Counter to remove
     *
     * @param id
     */
    Countdown.prototype.addToRemoveQueue = function (id) {
        this.removeQueue.push(id);
    };

    /**
     * Get current time from UNIX epoch in seconds.
     *
     * @returns {number}
     */
    Countdown.prototype.getTimeNow = function () {
        return Math.floor(Date.now() / 1000);
    };

    var Counter = (function () {
        function Counter(id, element, parent) {
            this.parent = parent;
            this.$element = element;
            this.id = id;
            this.timeDiff = 0;
            this.dayText = this.parseDayText();
            this.useSeconds = false;
            this.endTime = this.parseEndTime();

            if( ! this.endTime) {
                this.useSeconds = true;
                this.seconds = this.parseSeconds();
            }
        }

        /**
         * Parse day text from DOM element's attribute
         *
         * @returns {string|null}
         */
        Counter.prototype.parseDayText = function () {
            if(this.parent.options.useDayTextAttr) {
                return this.$element.attr(this.parent.options.dayTextAttr);
            }

            return null;
        };

        /**
         * Parse end time from DOM element's attribute
         *
         * @returns {string|Number}
         */
        Counter.prototype.parseEndTime = function () {
            return this.$element.attr(this.parent.options.endTimeAttr);
        };

        /**
         * Parse seconds from DOM element's attribute
         *
         * @returns {string|Number}
         */
        Counter.prototype.parseSeconds = function () {
            return this.$element.attr(this.parent.options.secondsAttr);
        };

        /**
         * Recalculate time diff
         * Invoked on every tick from parent
         *
         * @param timeNow Current time from UNIX epoch in seconds.
         */
        Counter.prototype.countDown = function (timeNow) {
            if(this.useSeconds) {
                this.seconds -= 1;
                this.timeDiff = this.seconds;
            } else {
                this.timeDiff = this.endTime - timeNow;
            }

            this.check();
        };

        /**
         * Check current status after tick
         * and invoke appropriate methods
         */
        Counter.prototype.check = function () {
            if(this.timeDiff <= 0) {
                this.invokeCallback();
                this.setEnded();
                this.remove();

                return;
            }

            this.renderText();
        };

        /**
         * Set ended text to an element
         */
        Counter.prototype.setEnded = function () {
            this.changeText(this.parent.options.endedText);
        };

        /**
         * Invoke a callback function after time is up
         */
        Counter.prototype.invokeCallback = function () {
            if(typeof this.parent.options.callback === 'function') {
                this.parent.options.callback(this.$element);
            }
        };

        /**
         * Render current time remaining text
         */
        Counter.prototype.renderText = function () {
            var days, hours, minutes, seconds;
            var count = this.timeDiff;

            seconds = this.formatNumber(count % 60);
            count = Math.floor(count / 60);
            minutes = this.formatNumber(count % 60);
            count = Math.floor(count / 60);
            hours = this.formatNumber(count % 24);
            count = Math.floor(count / 24);
            days = count;

            if(days <= 0 && ! this.parent.options.showZeroDays) {
                days = '';
            } else {
                days = this.getNumberText(days, 'day');
            }

            if(hours <= 0 && ! this.parent.options.showZeroHours) {
                hours = '';
            } else {
                hours = this.getNumberText(hours, 'hour');
            }

            minutes = this.getNumberText(minutes, 'minute');
            seconds = this.getNumberText(seconds, 'second');

            var timeText = days + hours + minutes + seconds;

            this.changeText(timeText);
        };

        /**
         * Get text for number by unit
         *
         * @param {Number} number
         * @param {string} unit Number unit (day, hour, minute, second)
         * @returns {string}
         */
        Counter.prototype.getNumberText = function (number, unit) {
            if(unit === 'day') {
                if(this.parent.options.useDayTextAttr) {
                    return number + this.dayText;
                }
            }

            if(this.parent.options.usePlurals) {
                return number + this.pluralText(number, unit);
            } else {
                return number + this.getText(unit);
            }
        };

        /**
         * Get plural text for number
         *
         * @param number
         * @param {string} unit Number unit (day, hour, minute, second)
         */
        Counter.prototype.pluralText = function (number, unit) {
            var strNumber = String(number);
            var lastDigit = Number(strNumber.substr(strNumber.length - 1));

            if(lastDigit === 1) {
                return this.getText(unit, 'Single');
            }

            if(number >= 10 && number <= 20) {
                return this.getText(unit, 'Genitive');
            }

            if(number % 10 === 0) {
                return this.getText(unit, 'Genitive');
            }

            return this.getText(unit, 'Plural');
        };

        /**
         * Get text from configuration by unit and variant
         *
         * @param unit Unit (day, hour, minute, second)
         * @param [variant] Variant of string (Single, Plural, Genitive)
         * @returns {string}
         */
        Counter.prototype.getText = function (unit, variant) {
            if(variant === void 0) {
                variant = 'Single';
            }

            return this.parent.options[unit + variant];
        };

        /**
         * Change text of DOM element
         *
         * @param {string} text Text to be set
         */
        Counter.prototype.changeText = function (text) {
            if( ! document.contains(this.$element[0])) {
                this.remove();

                return;
            }

            this.$element.text(text);
        };

        /**
         * Remove self from parent collection
         */
        Counter.prototype.remove = function () {
            this.parent.addToRemoveQueue(this.id);
        };

        /**
         * Format number to two digit string
         *
         * @param number
         * @returns {string}
         */
        Counter.prototype.formatNumber = function (number) {
            if (number < 10) {
                return '0' + number;
            }

            return number;
        };

        return Counter;
    })();

    return Countdown;
})();
