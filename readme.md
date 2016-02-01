# Countdown.js

A very simple countdown timer

## Requirement

Requires jQuery

## Installation

Just download countdown.js or countdown.min.js from `dist` dir
and load it in your page.

## Usage

First, create an element with `data-time` or `data-seconds` attribute
(You can override attribute names through options if needded).

Like this:

    <div class="timer" data-seconds="60">

The attribute provided specifies the behavior of countdown:
 - `data-time` - Specify seconds from unix epoch.

   This mode counts down seconds till time specified is reached.

 - `data-seconds` - Specify number of seconds to count down

   This mode counts down from specified amount of seconds till 0.

**Note:** Don't specify both attributes. If you do,
the `data-seconds` attribute will be used.

And then just new-up the class, pass the elements and options
if needed and You're done.

Like this:

    // Let's query our elements
    var elements = $('.timer');
    // And start the countdown
    new Countdown(elements, {initText: 'Please wait...'});

## Available options

 - `endTimeAttr`: (default: `'data-time'`)

   The attribute name to parse end time from.

 - `secondsAttr`: (default: `'data-seconds'`)

   The attribute name to parse seconds from.

 - `dayTextAttr`: (default: `'data-text'`)

   Attribute to parse day text from.
   Overrides `daySingle` option.

   **Note:** Use this attribute with `usePlurals` option disabled.

 - `useDayTextAttr`: (default: `true`)

   Enable to use day text attribute.
   If disabled day text will be parsed from `daySingle` option.

 - `initText`: (default: `'---'`)

   Text to be displayed on the element while the first tick is hit.

 - `endedText`: (default: `'---'`)

   Text to be displayed on the element when the time is up.

 - `usePlurals`: (default: `false`)

   Use plural text for days, hours, minutes and seconds.
   I.e. when seconds is 20 the text after will be parsed from
   `secondPlural` option, while if seconds is 1 - the text after
   will be parsed from `secondSingle` option and so on.

   If this option is disabled Countdown will use Single form
   for all texts (i.e. from option `hourSingle` for hours).

 - `showZeroDays`: (default: `true`)

   Show or hide day portion of the output when days is 0.

 - `showZeroHours`: (default: `true`)

   Show or hide hour portion of the output when hours is 0.

 - `daySingle`: (default: `' d. '`)

   Text to be displayed after days portion of output
   when days count is 1 or i.e. 21 ("diena" in lithuanian)

 - `dayPlural`: (default: `' d. '`)

   Text to be displayed after days portions of output
   when days count is more than 1 or i.e. 23 ("dienos" in lithuanian)

   **Note:** `usePlurals` must be enabled for this to work.

 - `dayGenitive`: (default: `' d. '`)

   Text to be displayed after days portions of output
   when days count is more than 1 or i.e. 20 ("dienų" in lithuanian)

   **Note:** `usePlurals` must be enabled for this to work.

 - `hourSingle`: (default: `':'`)

   See `daySingle`.

 - `hourPlural`: (default: `':'`)

   See `dayPlural`.

 - `hourGenitive`: (default: `':'`)

   See `dayGenitive`.

 - `minuteSingle`: (default: `':'`)

   See `daySingle`.

 - `minutePlural`: (default: `':'`)

   See `dayPlural`.

 - `minuteGenitive`: (default: `':'`)

   See `dayGenitive`.

 - `secondSingle`: (default: `''`)

   See `daySingle`.

 - `secondPlural`: (default: `''`)

   See `dayPlural`.

 - `secondGenitive`: (default: `''`)

   See `dayGenitive`.

 - `callback`: (default: `null`)

   Callback function to call after time has ended.
   The jQuery DOM element is passed as a first argument.

   **Note:** If you initialized countdown with more than one element
   the callback function will be invoked on each element after it's
   time has ended