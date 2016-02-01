$(document).ready(function () {
    "use strict";

    // Testing time countdown

    var timers = $('.timer');

    new Countdown(timers, {endedText: 'It`s time!'});

    // Testing seconds countdown

    var secTimers = $('.sec-timer');

    new Countdown(secTimers, {
        showZeroDays: false,
        showZeroHours: false,
        initText: 'Wait for it...',
        endedText: '00:00',
        callback: function ($el) {
            $el.css({color: '#dd1100'});
        }
    });
});
