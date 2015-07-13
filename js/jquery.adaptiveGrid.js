/*
 Mullen Adaptive Grid Framework by Marcus Hodges mullennc.com
 by Marcus Hodges @clodpated

 Uses Syze v1.1.1 MIT/GPL2 @rezitech http://rezitech.github.com/syze/
 (minified version at bottom of this file)

 MIT License
 -----------------------------------------------------------------------------
 Copyright (c) 2012 Marcus Hodges, @clodpated, http://clodpated.com
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Usage:
 -----------------------------------------------------------------------------
 Overwrite any options you wish to change.
 If you plan to use the default value of a property, you can delete that line

 $(document).ready(function() {
     $.adaptiveGrid({
        align        : 'center', // The alignment of your layout. Accepts 'center' (default) or 'left'
        columnColor  : 'black', // The background style of each column. Accepts any CSS background properties (using the shorthand syntax)
        columnWidth  : 60, // The width of each column, in pixels
        throttleRate : 250, // How long to wait after a resize event before resetting the columns, in milliseconds
        gutterColor  : 'transparent', // The background style of each gutter. Accepts any CSS background properties (using the shorthand syntax)
        gutterWidth  : 20, // The width of each gutter, in pixels
        hints        : false, // Whether to display a text hint of "Grid width: Npx" when overlay is visible
        marginColor  : '#e68e02', // The background style of each margin. Accepts any CSS background properties (using the shorthand syntax)
        opacity      : 0.3, // CSS opacity of the overlay and button
        open         : false, // Whether the overlay should be open when the page loads
        sizes        : [320, 480, 720, 960, 1200] // An array of your target viewport widths. Each value should be divisible by (columnWidth + gutterWidth)
    });
 });
 */

;(function ($) {

    $.adaptiveGrid = function (args) {

        var init = function (elem, args) {

            // Define Vars
            // ===============================================

            var i,

                // Define API defaults
                defaults = {
                    devMode      : false,
                    align        : 'center', // The alignment of your layout. Accepts 'center' (default) or 'left'
                    columnColor  : 'black', // The background style of each column. Accepts any CSS background properties (using the shorthand syntax)
                    columnWidth  : 60, // The width of each column, in pixels
                    throttleRate : 250, // How long to wait after a resize event before resetting the columns, in milliseconds
                    gutterColor  : 'transparent', // The background style of each gutter. Accepts any CSS background properties (using the shorthand syntax)
                    gutterWidth  : 20, // The width of each gutter, in pixels
                    hints        : false, // Whether to display a text hint of "Grid width: Npx" when overlay is visible
                    marginColor  : '#e68e02', // The background style of each margin. Accepts any CSS background properties (using the shorthand syntax)
                    opacity      : 0.3, // CSS opacity of the overlay and button
                    open         : true, // Whether the overlay should be open when the page loads
                    sizes        : [320, 480, 720, 960, 1200], // An array of your target viewport widths. Each value should be divisible by (columnWidth + gutterWidth)
                    syzeCallback : function(){}
                },

                // Set user options
                opts = (args) ? $.extend(defaults, args) : defaults,

                // Is the overlay open or shut?
                overlayIsOpen = (opts.open) ? true : false,

                // Define namespace
                namespace = 'ag-',

                // Define HTML class names for overlay columns
                columnClassName = {

                    column : namespace + 'column',
                    gutter : namespace + 'gutter',
                    margin : namespace + 'margin'

                },

                // Create overlay element and set defaults
                overlay = $('<div />', {

                    css : {
                        'overflow'       : 'hidden',
                        'pointer-events' : 'none',
                        'position'       : 'absolute',
                        'top'            : 0,
                        'z-index'        : 10001
                    },

                    id  : namespace + 'overlay'

                }),

                // Set default button dimensions
                buttonHeight = {

                    closed : 8,
                    open   : 30

                },

                // Create button element and set defaults
                button = $('<a />', {

                    click : function (ev) {

                        // If the overlay is closed
                        if (!overlayIsOpen) {

                            // Open it
                            openOverlay(elem);

                        // If the overlay was open already
                        } else {

                            // Close it
                            closeOverlay();

                        }

                        // Don't follow the link
                        ev.preventDefault();

                    },

                    css   : {
                        'display'     : 'block',
                        'height'      : (overlayIsOpen) ? buttonHeight.open : buttonHeight.closed,
                        'opacity'     : opts.opacity,
                        'overflow'    : 'hidden',
                        'position'    : 'fixed',
                        'right'       : 15,
                        'text-indent' : -9999,
                        'top'         : 15,
                        'width'       : 30,
                        'z-index'     : 10002
                    },

                    href  : '#',
                    id    : namespace + 'button',
                    text  : 'Toggle Overlay'

                }),

                // Create hint element and set defaults
                hint = $('<h6 />', {

                    css : {
                        'background'     : 'white',
                        'color'          : 'black',
                        'display'        : 'none',
                        'font'           : '16px/24px Arial, sans-serif',
                        'opacity'        : 0.7,
                        'padding'        : '0 0.25em',
                        'pointer-events' : 'none',
                        'position'       : 'fixed',
                        'top'            : 0,
                        'z-index'        : 10003
                    },

                    id  : namespace + 'hint'

                }),

                // Define Functions
                // ===============================================

                // Confirm that each size is divisible by the sum of (opts.columnWidth + opts.gutterWidth)
                checkMath = function (array) {

                    var alertError;

                    // Look at each size given
                    $.each(array, function (index, value) {

                        // Make sure it's cleanly divisible by the sum of opts.columnWidth + opts.gutterWidth
                        if (value % (opts.columnWidth + opts.gutterWidth) !== 0) {

                            // If it's your first time to the rodeo
                            if (!alertError) {

                                // We're going to set some default text and then add the first value
                                alertError = 'It seems your column and gutter widths do not cleanly add up for the following width(s): ' + value;

                            // If alertError already has a value
                            } else {

                                // Just add the new one to it
                                alertError += ', ' + value;

                            }

                        }

                    });

                    // If an error was generated, let somebody know
                    if (alertError) {
                        alert(alertError);
                    }

                    return true;

                },

                // Generate HTML for overlay columns
                generateColumns = function (columnCount) {

                    // Initialize what you do
                    var columns = '',

                        // Set HTML options
                        spanOpen  = '<span class="',
                        spanClose = '"></span>',
                        html = {};

                        for (key in columnClassName) {

                        	html[key] = spanOpen + columnClassName[key] + spanClose;

                        }

                    // Add left margin
                    columns += html.margin;

                    // Add columns and gutters
                    for (i = 1; i <= columnCount; i++) {

                        columns += html.column;

                        // Don't add a gutter after the last column
                        if (i !== columnCount) {

                            columns += html.gutter;

                        }

                    }

                    // Add right margin
                    columns += html.margin;

                    // Return the HTML
                    return columns;

                },

                // Set column styles based on options
                setColumnStyles = function (elem) {

                    // Set styles for all columns, regardless of context
                    elem.find('span').css({

                        'display' : 'block',
                        'float'   : 'left',
                        'height'  : '100%'

                    }).each(function () {

                        // If this is a margin, style it appropriately
                        if ($(this).hasClass(columnClassName.margin)) {

                            $(this).css({
                                'background' : opts.marginColor,
                                'width'      : opts.gutterWidth / 2
                            });

                        // If this is a gutter, style it appropriately
                        } else if ($(this).hasClass(columnClassName.gutter)) {

                            $(this).css({
                                'background' : opts.gutterColor,
                                'width'      : opts.gutterWidth
                            });

                        // If this is a column, style it appropriately
                        } else {

                            $(this).css({
                                'background' : opts.columnColor,
                                'width'      : opts.columnWidth
                            });

                        }

                    });

                },

                // Generate HTML for button columns
                createButtonColumns = function (elem) {

                    // Create and style a single baby column
                    var span = $('<span />', {
                        css: {
                            'background'   : opts.columnColor,
                            'display'      : 'block',
                            'float'        : 'left',
                            'height'       : '100%',
                            'margin-right' : 2,
                            'width'        : 8
                        }
                    });

                    // Future America allows up to three clone baby columns per real vagina-born baby column, and frankly they are dispensible
                    for (i = 0; i < 3; i++) {

                        // Add the clone babies
                        elem.prepend(span.clone());

                    }

                    return elem;

                },

                // Open the overlay
                openOverlay = function (elem, speed, easing) {

                    // Set defaults
                    if (!speed) {

                        speed = 300;

                    }

                    if (!easing) {

                        easing = 'swing';

                    }

                    // Grab the current body height
                    var bodyHeight = elem.height();

                    // Let the world know you're open for business
                    overlayIsOpen = true;

                    // Increase the height of the button
                    button.animate({
                        height  : buttonHeight.open
                    }, speed, easing);

                    // Open the overlay
                    overlay.animate({
                        height  : bodyHeight,
                        opacity : opts.opacity
                    }, speed, easing);

                    // If hints are enabled
                    if (opts.hints === true) {

                        // Fade in the hint
                        hint.fadeIn(speed, easing);

                    }

                },

                // Open the overlay
                closeOverlay = function (speed, easing) {

                    // Set defaults
                    if (!speed) {

                        speed = 300;

                    }

                    if (!easing) {

                        easing = 'swing';

                    }

                    // Let the world know you've closed up shop
                    overlayIsOpen = false;

                    // Decrease the height of the button
                    button.animate({
                        height  : buttonHeight.closed
                    }, speed, easing);

                    // Close the overlay
                    overlay.animate({
                        height  : '0%',
                        opacity : 0
                    }, speed, easing);

                    // If hints are enabled
                    if (opts.hints === true) {

                        // Fade out the hint
                        hint.fadeOut(speed, easing);

                    }

                },

                // Listen for the esc key
                escKeyPress = function () {

                    // When someone lets off a character
                    $(window).keyup(function (ev) {

                        // If it happened to be the escape key
                        if (ev.keyCode === 27) {

                            // And the overlay was open
                            if (overlayIsOpen === true) {

                                // Close the overlay
                                closeOverlay();

                            }

                        }

                    });

                },

                // Listen for and react to changes in width or height
                resize = function (elem) {

                    // Create a variable to cache the layout width
                    var cachedLayoutWidth = 0;

                    // See http://rezitech.github.com/syze/ for documentation on syze()
                    syze.sizes(opts.sizes)
                        .debounceRate(opts.throttleRate)
                        .callback(function (layoutWidth) {

                            if( cachedLayoutWidth != layoutWidth ){

                                // Update the cached layout width
                                cachedLayoutWidth = layoutWidth;

                                // Call the user defined syze callback
                                opts.syzeCallback( layoutWidth );

                                // Only change columns if in dev mode
                                if(opts.devMode) {

                                    // Set overlay styles according to dimensions
                                    overlay.css({
                                        'height'      : (overlayIsOpen) ? $('body').height() : '0%',
                                        'left'        : (opts.align === 'left') ? 0 : '50%',
                                        'margin-left' : (opts.align === 'left') ? 0 : (layoutWidth / -2),
                                        'opacity'     : (overlayIsOpen) ? opts.opacity : 0,
                                        'width'       : layoutWidth
                                    })
                                        // Remove any current columns
                                        .find('span')
                                        .each(function () {
                                            $(this).remove();
                                        })
                                        .end()
                                        // Generate new columns
                                        .prepend(generateColumns(layoutWidth / (opts.columnWidth + opts.gutterWidth)));

                                    // Style the new columns
                                    setColumnStyles(overlay);

                                    // If we're showing hints
                                    if (opts.hints === true) {

                                        // Define what our hint will say
                                        var text = 'Grid width: ' + layoutWidth;

                                        // Update hint text
                                        hint.text(text);

                                        // If the hint isn't on the page yet
                                        if (!$('#' + namespace + 'hint').length) {

                                            // By all means add it
                                            elem.prepend(hint);

                                        }

                                    }

                                }

                            }

                        });

                }

            ;

            // Run shit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // ===============================================

            if( opts.devMode ) {

                // Confirm that each size is divisible by the sum of (opts.columnWidth + opts.gutterWidth)
                checkMath(opts.sizes);

                // Add the grid and button to the page
                elem.prepend(overlay).append(createButtonColumns(button));

                // Listen for the esc key
                escKeyPress();

            }

            // Listen for and react to changes in width or height
            resize(elem);

        };

        // Initialize the plugin
        // ===============================================
        init($('body'), args);

    };

})(jQuery);

/*
 * Things I'm not happy with:
 *
 * overlayIsOpen and columnClassName should be properties of overlay
 * generateColumns(), setColumnStyles(), openOverlay(), and closeOverlay() should be methods of overlay
 *
 * buttonHeight should be a property of button
 * createButtonColumns() should be a method of button
 *
 */

/*! syze v1.1.1 MIT/GPL2 @rezitech */
(function (win, docEl) {
	// syze variables
	var
	_sizes = [],
	_names = {},
	_from = 'browser',
	_debounceRate = 50,
	_callback;
	// add window event
	function addWinEvent(type, fn) {
		if (win.addEventListener) addEventListener(type, fn, false); else attachEvent('on' + type, fn);
	}
	// debouncer
	function debounce(fn) {
		var timeout;
		return function () {
			var obj = this, args = arguments;
			function delayed () {
				fn.apply(obj, args);
				timeout = null;
			}
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(delayed, _debounceRate);
		};
	}
	// resizer
	function onResize() {
		var
		currentSize =
			/^device$/i.test(String(_from)) ? !win.orientation || orientation == 180 ? screen.width : screen.height
			: /^browser$/i.test(String(_from)) ? docEl.clientWidth
			: (_from instanceof String) ? Function('return ' + _from)()
			: parseInt(_from, 10) || 0,
		docElClassNames = docEl.className.replace(/^\s+/, ' ').replace(/\s(gt|is|lt)[^\s]+/g, '').replace(/^\s+/, '').split(/\s+/),
		classNames = [], i = -1, e, arr = _sizes, len = arr.length;
		//
		arr.sort(function (a, b) { return(a - b); });
		//
		while (++i < len) if (currentSize < arr[i]) break;
		if (i > 0) currentSize = arr[Math.min(--i, len - 1)];
		//
		i = -1;
		while (++i < len) {
			classNames.push((currentSize > arr[i] ? 'gt' : currentSize < arr[i] ? 'lt' : 'is') + (_names[arr[i]] || arr[i]));
		}
		//
		docEl.className = (!docElClassNames[0] ? [] : docElClassNames).concat(classNames).join(' ');
		//
		if (_callback) _callback(currentSize);
	}
	// syze controls
	win.syze = {
		sizes: function (val) { _sizes = [].concat.apply([], arguments); onResize(); return this; },
		names: function (val) { if (val instanceof Object) { _names = val; onResize(); } return this; },
		from: function (val) { _from = val; onResize(); return this; },
		debounceRate: function (val) { _debounceRate = parseInt(val, 10) || 0; onResize(); return this; },
		callback: function (val) { if (val instanceof Function) { _callback = val; onResize(); } return this; }
	};
	// start syze
	addWinEvent('resize', debounce(onResize));
	addWinEvent('orientationchange', onResize);
	onResize();
}(this, document.documentElement));
