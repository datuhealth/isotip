!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.isotip=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* global DocumentTouch */

module.exports = {
    /**
     * Setup global options
     * These can and will be overwriteen if a config object is passed into this.init()
     */
    options: {
        html: false,
        placement: 'top',
        container: 'body',
        template: '<div class="tooltip" data-tooltip-target="tooltip"></div>',
        removalDelay: 1200,
        tooltipOffset: 10,
        windowPadding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
    },

    /**
     * initializeTooltips - Initialize function to bind events and set any global data
     * @version 1.0.0
     * @example
     * tooltips.init();
     * @param  {object} (config) - Congifuration object that is used to overwrite the defaults in this.options
     * @return {void}
     */
    init: function initializeTooltips( config ) {
        'use strict';

        var self = this;

        // Check to see if we should use document.body or document.documentElement
        document.documentElement.scrollTop = 1;
        this.documentElement = document.documentElement.scrollTop === 1 ? document.documentElement : document.body;

        // Test for browser support
        var div = document.createElement( 'div' );

        div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        this.innerHTMLBug = !div.getElementsByTagName( 'link' ).length;
        div = undefined;

        // touch event testing
        if ( ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch ) {
            document.body.style.cursor = 'pointer';
        }

        // Wrap map from jquery.
        this.map = {
            legend: [ 1, '<fieldset>', '</fieldset>' ],
            tr: [ 2, '<table><tbody>', '</tbody></table>' ],
            col: [ 2, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
            // for script/link/style tags to work in IE6-8, you have to wrap
            // in a div with a non-whitespace character in front, ha!
            defaultTag: this.innerHTMLBug ? [ 1, 'X<div>', '</div>' ] : [ 0, '', '' ]
        };

        this.map.td = this.map.th = [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ];
        this.map.option = this.map.optgroup = [ 1, '<select multiple="multiple">', '</select>' ];
        this.map.thead = this.map.tbody = this.map.colgroup = this.map.caption = this.map.tfoot = [ 1, '<table>', '</table>' ];
        this.map.text = this.map.circle = this.map.ellipse = this.map.line = this.map.path = this.map.polygon = this.map.polyline = this.map.rect = [ 1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>' ];

        // Copy over ininitialization options to options object
        if ( config instanceof Object ) {
            for ( var option in config ) {
                if ( window.Object.hasOwnProperty.call( config, option ) && window.Object.hasOwnProperty.call( this.options, option )) {
                    // If it's a nested object, loop through that one too
                    if ( typeof config[ option ] === 'object' && !Array.isArray( config[ option ] )) {
                        for ( var subkey in config[ option ] ) {
                            if ( window.Object.hasOwnProperty.call( config[ option ], subkey ) && window.Object.hasOwnProperty.call( this.options[ option ], subkey )) {
                                this.options[ option ][ subkey ] = config[ option ][ subkey ];
                            }
                        }
                    } else {
                        this.options[ option ] = config[ option ];
                    }
                }
            }
        }

        // Logic for handling a click event
        function clickHandler( evt ) {
            if ( !evt ) {
                evt = window.event;
            }

            var trigger = evt.target || evt.srcElement;

            // If there's already a tooltip open, close that one...
            if ( self.currentTooltip ) {
                // ...unless the user is clicking on the tooltip itself...
                if ( trigger === self.currentTooltip ) {
                    return;
                // ...or if the user if clicking on the original trigger for that tooltip
                } else if ( trigger === self.currentTrigger ) {
                    self.close( self.currentTooltip );

                    return;
                } else {
                    var children = self.currentTooltip.childNodes;

                    // loop through the child elements in the tooltip to see if one of them has been clicked
                    for ( var childNode in children ) {
                        if ( window.Object.hasOwnProperty( children, childNode )) {
                            if ( children[ childNode ] === trigger ) {
                                return;
                            }
                        }
                    }

                    self.close( self.currentTooltip );
                }
            }

            // If the element the user is clicking on isn't supposed to trigger a tooltip, bail
            if ( !self.hasClass( trigger, 'tooltip-click' )) {
                return;
            }

            // Store the trigger element
            self.currentTrigger = trigger;

            // Open the tooltip!
            self.open( trigger );
        }

        // Logic for handling a mouseover event
        function mouseoverHandler( evt ) {
            if ( !evt ) {
                evt = window.event;
            }

            var trigger = evt.target || evt.srcElement;

            // If the element the user is hovering over isn't supposed to trigger a tooltip, bail
            if ( !self.hasClass( trigger, 'tooltip-hover' )) {
                return;
            }

            // If there's already a tooltip open, close that one...
            if ( self.currentTooltip ) {
                // ...unless the user is hovering over the tooltip itself...
                if ( trigger === self.currentTooltip ) {
                    return;
                } else {
                    var children = self.currentTooltip.childNodes;

                    // loop through the child elements in the tooltip to see if one of them has been hovered
                    for ( var childNode in children ) {
                        if ( window.Object.hasOwnProperty.call( children, childNode )) {
                            if ( children[ childNode ] === trigger ) {
                                return;
                            }
                        }
                    }

                    self.close( self.currentTooltip );
                }
            }

            // Logig for handling the mouseout event
            function mouseoutHandler( moEvt ) {
                if ( !moEvt ) {
                    moEvt = window.event;
                }

                var moTrigger = evt.target || evt.srcElement;

                if ( self.hasClass( moTrigger )) {
                    return;
                }

                self.close( self.currentTooltip );

                // Remove self event to keep things clean
                self.removeEventListener( trigger, 'mouseout', mouseoutHandler );

                return;
            }

            self.open( trigger );

            // Store the trigger element
            self.currentTrigger = trigger;

            // Add an event to remove the tooltip when the user moves their cursor away
            self.addEventListener( trigger, 'mouseout', mouseoutHandler );

            return;
        }

        // Logic for handling a focus event
        function focusHandler( evt ) {
            if ( !evt ) {
                evt = window.event;
            }

            var trigger = evt.target || evt.srcElement;

            // If the element the user is focusing on isn't supposed to trigger a tooltip, bail
            if ( !self.hasClass( trigger, 'tooltip-focus' )) {
                return;
            }

            // If there's already a tooltip open, close that one...
            if ( self.currentTooltip ) {
                self.close( self.currentTooltip );
            }

            // Logic for handling the blur event
            function blurHandler() {
                self.close( self.currentTooltip );

                // Remove self event to keep things clean
                self.removeEventListener( trigger, 'blur', blurHandler );

                return;
            }

            self.open( trigger );

            // Store the trigger element
            self.currentTrigger = trigger;

            // Add an event to remove the tooltip when the user blurs from the element
            self.addEventListener( trigger, 'blur', blurHandler );

            return;
        }

        function windowChangeHandler() {
            if ( self.currentTooltip && self.currentTrigger ) {
                self.positionTooltip( self.currentTooltip, self.currentTrigger );
            }

            return;
        }

        // Add the global click handler
        this.addEventListener( document.body, 'click', clickHandler );

        // Add the global mouseover handler
        this.addEventListener( document.body, 'mouseover', mouseoverHandler );

        // Add the global focus handler
        this.addEventListener( document.body, 'focus', focusHandler, true );

        // If a tooltip is open and the user scrolls, isotip needs to keep up with them
        this.addEventListener( window, 'scroll', windowChangeHandler );

        // If a tooltip is open and the user resizes the page, isotip needs to keep up with them
        this.addEventListener( window, 'resize', windowChangeHandler );
    },

    /**
     * openTooltip - Main open function to prepare and insert the tooltip
     * @version 1.0.0
     * @example
     * tooltip.open( document.body.querySelector( '#tooltip-trigger' ));
     * @param  {string|element} trigger - The element that serves as the trigger for the tooltip
     * @param  {object} (options) - An object that corresponds to the possible options using data-tooltip attributes
     * @return {element} - Returns the tooltip that was inserted into the DOM
     */
    open: function openTooltip( trigger, options ) {
        'use strict';

        // We need a DOM element, so make it one if it isn't already
        if ( typeof trigger === 'string' ) {
            trigger = document.body.querySelector( trigger );
        }

        // If no options are passed in, setup a blank object to prevent errors
        if ( !options ) {
            options = {};
        }

        // Setup tooltip variables, starting with the config object if there is one
        var content = options.content || trigger.getAttribute( 'data-tooltip-content' ),
            title = options.title || trigger.getAttribute( 'data-tooltip-title' ),
            html = options.html || trigger.getAttribute( 'data-tooltip-html' ),
            placement = options.placement || trigger.getAttribute( 'data-tooltip-placement' ),
            container = options.container || trigger.getAttribute( 'data-tooltip-container' ),
            preExistingTooltip = document.querySelector( '.tooltip' ),
            tooltip = this.createDOMElement( this.options.template ),
            tooltipTitle,
            tooltipContent;

        // If there isn't any content to be displayed, bail
        if ( !content ) {
            return;
        }

        tooltip.appendChild( this.createDOMElement( '<div class="tooltip-accent"></div>' ));

        // If there's a title to be displayed, create the title element
        if ( title ) {
            tooltipTitle = this.createDOMElement( '<p class="tooltip-title">' + title + '</p>' );

            tooltip.appendChild( tooltipTitle );
        }

        // If the supplied string should be interpreted as html, make an element for it...
        if ( ( this.options.html || html ) && content ) {
            if ( this.getTagName( content )) {
                tooltipContent = this.createDOMElement( content );
            } else {
                tooltipContent = this.createDOMElement( '<p class="tooltip-content">' + content + '</p>' );
            }
        // ...or create a default p instead
        } else {
            tooltipContent = this.createDOMElement( '<p class="tooltip-content">' + content + '</p>' );
        }

        tooltip.appendChild( tooltipContent );

        // If the a container was supplied and it's not also the body element, store that element
        if ( container && container !== this.options.container ) {
            if ( typeof container === 'string' ) {
                this.currentContainer = document.querySelector( container );
            }
        // If they initialized tooltips and set a different global container, store that element
        } else {
            this.currentContainer = document.querySelector( this.options.container );
        }

        if ( preExistingTooltip ) {
            this.currentTooltip = this.currentContainer.insertBefore( tooltip, preExistingTooltip );
        } else {
            this.currentTooltip = this.currentContainer.appendChild( tooltip );
        }

        // Position the tooltip on the page
        this.positionTooltip( this.currentTooltip, trigger, placement );

        return this.currentTooltip;
    },

    /**
     * closeTooltip - Main close function to close a specific tooltip
     * @version 1.0.0
     * @example
     * tooltip.close( document.body.querySelector( '.tooltip' ));
     * @param  {string|element} tooltip - The tooltip that needs to be closed
     * @return {void}
     */
    close: function closeTooltip( tooltip ) {
        'use strict';

        // We need a DOM element, so make it one if it isn't already
        if ( typeof tooltip === 'string' ) {
            tooltip = document.body.querySelector( tooltip );
        }

        this.removeClass( tooltip, 'visible' );

        this.currentTooltip = null;
        this.currentTrigger = null;

        // We should assume that there will be some sort of tooltip animation with CSS or JS
        // So we can only remove the element after a certain period of time
        window.setTimeout(function removeElementFromDOM() {
            if ( tooltip && tooltip instanceof Element ) {
                tooltip.parentNode.removeChild( tooltip );
            } else {
                document.body.removeChild( document.body.querySelector( '.tooltip' ));
            }
        }, this.options.removalDelay );
    },

    /**
     * positionTooltip - Logic for positioning the tooltip on the page
     * @version 1.0.0
     * @example
     * this.positionTooltip( this.currentTooltip, this.currentTrigger, 'top' );
     * @param  {string|element} tooltip - The tooltip that needs to be positioned
     * @param  {string|element} trigger - The element that triggered the tooltip
     * @param  {string} (placement) - The position that the tooltip needs to be placed in in relation to the trigger
     * @return {element} - Returns the tooltip that was positioned
     * @api private
     */
    positionTooltip: function positionTooltip( tooltip, trigger, placement ) {
        'use strict';

        if ( typeof tooltip === 'string' ) {
            tooltip = document.body.querySelector( tooltip );
        }

        if ( typeof trigger === 'string' ) {
            trigger = document.body.querySelector( trigger );
        }

        // Since we support this being done on scroll, we need a way to get the placement if it isn't specified
        if ( !placement ) {
            placement = trigger.getAttribute( 'data-tooltip-placement' ) || this.options.placement;
        }

        var self = this,
            tooltipAccent = tooltip.querySelector( '.tooltip-accent' ),
            triggerWidth = parseInt( trigger.offsetWidth ),
            triggerHeight = parseInt( trigger.offsetHeight ),
            triggerPosition = trigger.getBoundingClientRect(),
            triggerX = triggerPosition.left,
            triggerY = triggerPosition.top,
            windowTop = this.options.windowPadding.top,
            windowRight = ( window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ) - this.options.windowPadding.right,
            windowBottom = ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ) - this.options.windowPadding.bottom,
            windowLeft = this.options.windowPadding.left,
            tooltipX,
            tooltipY,
            tooltipWidth,
            tooltipHeight,
            tooltipRight,
            tooltipBottom,
            tooltipAccentWidth,
            tooltipAccentHeight;

        /**
         * We sometimes need to re-position the tooltip (I.E. switch from top to bottom)
         * Which is why these are separate functions
         */
        function positionTop() {
            tooltipX = ( triggerX - ( tooltipWidth / 2 )) + ( triggerWidth / 2 );
            tooltipY = triggerY - tooltipHeight - self.options.tooltipOffset;
            tooltipRight = tooltipX + tooltipWidth;

            self.addClass( tooltip, 'tooltip-top' );

            if ( !tooltipAccentWidth ) {
                tooltipAccentWidth = parseInt( tooltipAccent.offsetWidth );
            }

            // If the tooltip extends beyond the right edge of the window...
            if ( tooltipRight > windowRight ) {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.right = self.options.windowPadding.right + 'px';
                tooltipAccent.style.left = 'auto';
                tooltipAccent.style.right = (( triggerWidth / 2 ) - ( tooltipAccentWidth / 2 )) + ( windowRight - triggerX - triggerWidth ) + 'px';
            // ...or if the tooltip extends beyond the top of the window...
            } else if ( tooltipY < windowTop ) {
                self.removeClass( tooltip, 'tooltip-top' );

                return positionBottom();
            // ...or if the tooltip extends beyond the left edge of the window...
            } else if ( tooltipX < self.options.windowPadding.left ) {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = self.options.windowPadding.left + 'px';
                tooltipAccent.style.right = 'auto';
                tooltipAccent.style.left = (( triggerWidth / 2 ) - ( tooltipAccentWidth / 2 )) + ( triggerX - windowLeft ) + 'px';
            // ...or it fits inside the window
            } else {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = tooltipX + 'px';
                tooltipAccent.style.top = '';
                tooltipAccent.style.bottom = '';
                tooltipAccent.style.right = '';
                tooltipAccent.style.left = (( tooltipWidth / 2 ) - ( tooltipAccentWidth / 2 )) + 'px';
            }
        }

        function positionRight() {
            tooltipX = triggerX + triggerWidth + self.options.tooltipOffset;
            tooltipY = ( triggerY - ( tooltipHeight / 2 )) + ( triggerHeight / 2 );
            tooltipRight = tooltipX + tooltipWidth;

            self.addClass( tooltip, 'tooltip-right' );

            if ( !tooltipAccentHeight ) {
                tooltipAccentHeight = parseInt( tooltipAccent.offsetHeight );
            }

            // If the tooltip extends beyond the right edge of the screen...
            if ( tooltipRight > windowRight ) {
                self.removeClass( tooltip, 'tooltip-right' );

                return positionTop();
            // ...or if it fits to the right of the trigger element
            } else {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = tooltipX + 'px';
                tooltipAccent.style.right = '';
                tooltipAccent.style.bottom = '';
                tooltipAccent.style.left = '';
                tooltipAccent.style.top = (( tooltipHeight / 2 ) - ( tooltipAccentHeight / 2 )) + 'px';
            }
        }

        function positionBottom() {
            tooltipX = ( triggerX - ( tooltipWidth / 2 )) + ( triggerWidth / 2 );
            tooltipY = triggerY + triggerHeight + self.options.tooltipOffset;
            tooltipRight = tooltipX + tooltipWidth;
            tooltipBottom = tooltipY + tooltipHeight;

            self.addClass( tooltip, 'tooltip-bottom' );

            if ( !tooltipAccentWidth ) {
                tooltipAccentWidth = parseInt( tooltipAccent.offsetWidth );
            }

            // If the tooltip extends beyond the right edge of the window...
            if ( tooltipRight > windowRight ) {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.right = self.options.windowPadding.right + 'px';
                tooltipAccent.style.left = 'auto';
                tooltipAccent.style.right = (( triggerWidth / 2 ) - ( tooltipAccentWidth / 2 )) + ( windowRight - triggerX - triggerWidth ) + 'px';
            // ...or if the tooltip extends beyond the top of the window...
            } else if ( tooltipBottom > windowBottom ) {
                self.removeClass( tooltip, 'tooltip-bottom' );

                return positionTop();
            // ...or if the tooltip extends beyond the left edge of the window...
            } else if ( tooltipX < self.options.windowPadding.left ) {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = self.options.windowPadding.left + 'px';
                tooltipAccent.style.right = 'auto';
                tooltipAccent.style.left = (( triggerWidth / 2 ) - ( tooltipAccentWidth / 2 )) + ( triggerX - windowLeft ) + 'px';
            // ...or it fits inside the window
            } else {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = tooltipX + 'px';
                tooltipAccent.style.top = '';
                tooltipAccent.style.bottom = '';
                tooltipAccent.style.right = '';
                tooltipAccent.style.left = (( tooltipWidth / 2 ) - ( tooltipAccentWidth / 2 )) + 'px';
            }
        }

        function positionLeft() {
            tooltipX = triggerX - tooltipWidth - self.options.tooltipOffset;
            tooltipY = ( triggerY - ( tooltipHeight / 2 )) + ( triggerHeight / 2 );

            self.addClass( tooltip, 'tooltip-left' );

            if ( !tooltipAccentHeight ) {
                tooltipAccentHeight = parseInt( tooltipAccent.offsetHeight );
            }

            // If the tooltip extends beyond the right edge of the screen...
            if ( tooltipX < windowLeft ) {
                self.removeClass( tooltip, 'tooltip-left' );

                return positionTop();
            // ...or if it fits to the left of the trigger element
            } else {
                tooltip.style.top = tooltipY + 'px';
                tooltip.style.left = tooltipX + 'px';
                tooltipAccent.style.right = '';
                tooltipAccent.style.bottom = '';
                tooltipAccent.style.left = '';
                tooltipAccent.style.top = (( tooltipHeight / 2 ) - ( tooltipAccentHeight / 2 )) + 'px';
            }
        }

        tooltip.style.position = 'fixed';

        tooltipWidth = parseInt( tooltip.offsetWidth );
        tooltipHeight = parseInt( tooltip.offsetHeight );
        tooltipAccentWidth = parseInt( tooltipAccent.offsetWidth );
        tooltipAccentHeight = parseInt( tooltipAccent.offsetHeight );

        // clear any classes set before hand
        self.removeClass( tooltip, 'tooltip-top' );
        self.removeClass( tooltip, 'tooltip-right' );
        self.removeClass( tooltip, 'tooltip-bottom' );
        self.removeClass( tooltip, 'tooltip-left' );

        // position the tooltip
        if ( placement === 'top' ) {
            positionTop();
        } else if ( placement === 'right' ) {
            positionRight();
        } else if ( placement === 'bottom' ) {
            positionBottom();
        } else if ( placement === 'left' ) {
            positionLeft();
        }

        // try and give the tooltip enough time to position itself
        window.setTimeout(function() {
            self.addClass( tooltip, 'visible' );
        }, 50 );

        return tooltip;
    },

    /**
     * addEventListener - Small function to add an event listener. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.addEventListener( document.body, 'click', this.open( this.currentTooltip ));
     * @param  {element} el - The element node that needs to have the event listener added
     * @param  {string} eventName - The event name (sans the "on")
     * @param  {function} handler - The function to be run when the event is triggered
     * @return {element} - The element that had an event bound
     * @api private
     */
    addEventListener: function addEventListener( el, eventName, handler, useCapture ) {
        'use strict';

        if ( !useCapture ) {
            useCapture = false;
        }

        if ( el.addEventListener ) {
            el.addEventListener( eventName, handler, useCapture );

            return el;
        } else {
            if ( eventName === 'focus' ) {
                eventName = 'focusin';
            }

            el.attachEvent( 'on' + eventName, function() {
                handler.call( el );
            });

            return el;
        }
    },

    /**
     * removeEventListener - Small function to remove and event listener. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.removeEventListener( document.body, 'click', this.open( this.currentTooltip ));
     * @param  {element} el - The element node that needs to have the event listener removed
     * @param  {string} eventName - The event name (sans the "on")
     * @param  {function} handler - The function that was to be run when the event is triggered
     * @return {element} - The element that had an event removed
     * @api private
     */
    removeEventListener: function removeEventListener( el, eventName, handler, useCapture ) {
        'use strict';

        if ( !useCapture ) {
            useCapture = false;
        }

        if ( el.removeEventListener ) {
            el.removeEventListener( eventName, handler, useCapture );
        } else {
            if ( eventName === 'focus' ) {
                eventName = 'focusin';
            }

            el.detachEvent( 'on' + eventName, function() {
                handler.call( el );
            });
        }

        return el;
    },

    /**
     * hasClass - Small function to see if an element has a specific class. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.hasClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to check the class existence on
     * @param  {string} className - The class to check for
     * @return {boolean} - True or false depending on if the element has the class
     * @api private
     */
    hasClass: function hasClass( el, className ) {
        'use strict';

        if ( el.classList ) {
            return el.classList.contains( className );
        } else {
            return new RegExp( '(^| )' + className + '( |$)', 'gi' ).test( el.className );
        }
    },

    /**
     * addClass - Small function to add a class to an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.addClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to add the class to
     * @param  {string} className - The class name to add to the element
     * @return {element} - The element that had the class added to it
     * @api private
     */
    addClass: function addClass( el, className ) {
        'use strict';

        if ( el.classList ) {
            el.classList.add( className );
        } else {
            el.className += ' ' + className;
        }

        return el;
    },

    /**
     * removeClass - Small function to remove a class from an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.removeClass( this.currentTooltip, 'visible' );
     * @param  {element} el - The element to remove the class from
     * @param  {string} className - The class name to remove from the element
     * @return {element} - The element that had the class removed from it
     * @api private
     */
    removeClass: function removeClass( el, className ) {
        'use strict';

        if ( el ) {
            if ( el.classList ) {
                el.classList.remove( className );
            } else {
                el.className = el.className.replace( new RegExp( '(^|\\b)' + className.split( ' ' ).join( '|' ) + '(\\b|$)', 'gi' ), ' ' );
            }
        }

        return el;
    },

    /**
     * setInnerText - Small function to set the inner text of an element. Should be compatible with IE8+
     * @version 1.0.0
     * @example
     * this.setInnerText( this.currentTooltip, 'Hello world' );
     * @param  {element} el - The element to have the text inserted into
     * @param  {string} text - The text to insert into the element
     * @return {element} - The element with the new inner text
     * @api private
     */
    setInnerText: function setInnerText( el, text ) {
        'use strict';

        if ( el.textContent !== undefined ) {
            el.textcontent = text;
        } else {
            el.innerText = text;
        }

        return el;
    },

    /**
     * getTagName - Small function to get the tag name of an html string.
     * @version 1.0.0
     * @example
     * this.getTagName( '<div></div>' );
     * @param  {string} html - The string of html to check for the tag
     * @return {object} - The object containing the tag of the root element in the html string as well as some other basic info
     * @api private
     */
    getTagName: function getTagName( html ) {
        'use strict';

        return /<([\w:]+)/.exec( html );
    },

    /**
     * createDOMElement - Small function to transform an html string into an element
     * @version 1.0.0
     * @example
     * this.createDOMElement( '<div class="new-element">Hello world</div>' );
     * @param  {string} html - The string of html to turn into html
     * @return {element} - The element created from the string of html
     * @api private
     */
    createDOMElement: function createDOMElement( html ) {
        'use strict';

        // Remove whitespace
        html = html.replace( /^\s+|\s+$/g, '' );

        // Get the tag name and match it to this.map incase it needs more nodes
        var templateTag = this.getTagName( html )[ 1 ],
            wrap = this.map[ templateTag ] || this.map.defaultTag,
            depth = wrap[ 0 ],
            prefix = wrap[ 1 ],
            suffix = wrap[ 2 ],
            el = document.createElement( 'div' );

        el.innerHTML = prefix + html + suffix;

        while ( depth-- ) {
            el = el.lastChild;
        }

        // Extract the fresh element
        return el.removeChild( el.firstChild );
    }
};

},{}]},{},[1])(1)
});
