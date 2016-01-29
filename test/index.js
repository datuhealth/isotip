var isotipJS = require( '../isotip' ),
    chai = require( 'chai' ),
    expect = chai.expect;

function eventFire( el, evtType ) {
    if ( el.fireEvent ) {
        el.fireEvent( 'on' + evtType );
    } else {
        var evtObj = document.createEvent( 'Events' );

        evtObj.initEvent( evtType, true, false );
        el.dispatchEvent( evtObj );
    }
}

describe( 'tooltip markup', function() {
    it( 'should have a class of tooltip', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = isotipJS.open( trigger );

        expect( tooltipTmp.classList.contains( 'tooltip' )).to.equal( true );
    });

    it( 'should have a tooltip accent element', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = isotipJS.open( trigger );

        expect( tooltipTmp.childNodes[ 0 ].tagName ).to.equal( 'DIV' );
        expect( tooltipTmp.childNodes[ 0 ].classList.contains( 'tooltip-accent' )).to.equal( true );
    });

    it( 'should have a p tag containing the content', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = isotipJS.open( trigger );

        expect( tooltipTmp.childNodes[ 1 ].tagName ).to.equal( 'P' );
    });

    it( 'should have content matching the data-tooltip-content attribute', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = isotipJS.open( trigger ),
            content = trigger.getAttribute( 'data-tooltip-content' );

        expect( tooltipTmp.childNodes[ 1 ].innerText ).to.equal( content );
    });

    it( 'should have a title if specified', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-title' ),
            tooltipTmp = isotipJS.open( trigger ),
            title = trigger.getAttribute( 'data-tooltip-title' );

        expect( tooltipTmp.childNodes.length ).to.equal( 3 );
        expect( tooltipTmp.childNodes[ 1 ].tagName ).to.equal( 'P' );
        expect( tooltipTmp.childNodes[ 1 ].innerText ).to.equal( title );
    });

    it( 'should use custom markup for the tooltip container if specified', function() {
        isotipJS.init({
            template: '<div class="custom-markup tooltip" data-tooltip-target="tooltip"></div>'
        });

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = isotipJS.open( trigger );

        expect( tooltipTmp.tagName ).to.equal( 'DIV' );
        expect( tooltipTmp.classList.contains( 'custom-markup' )).to.equal( true );
    });

    it( 'should use custom markup for the content if specified', function() {
        isotipJS.init();

        var trigger = document.querySelector( '.tooltip-html' ),
            tooltipTmp = isotipJS.open( trigger );

        expect( tooltipTmp.childNodes[ 1 ].tagName ).to.equal( 'SPAN' );
        expect( tooltipTmp.childNodes[ 1 ] instanceof Element ).to.equal( true );
    });

    it( 'should accept a DOM Element', function() {
        isotipJS.init();

        var selector = '.tooltip-empty-insert-point',
            el = document.createElement( 'p' ),
            config = { html: true, content: el },
            tooltipTmp = isotipJS.open( selector, config );
        expect( tooltipTmp.childNodes[ 1 ].tagName ).to.equal( 'P' );
    });
});

describe( 'tooltip options', function() {
    it( 'should be able to be overwritten', function() {
        isotipJS.init({
            placement: 'right'
        });

        expect( isotipJS.options.placement ).to.equal( 'right' );
    });

    it( 'should be able ovwerwrite only one windowPadding property', function() {
        isotipJS.init({
            windowPadding: {
                top: 50
            }
        });

        expect( isotipJS.options.windowPadding.top ).to.equal( 50 );
        expect( isotipJS.options.windowPadding.bottom ).to.equal( 10 );
    });
});

describe( 'tooltip position', function() {
    it( 'should be on top by default', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should be on the right if specified', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-right' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth;

        expect( parseInt( tooltipTmp.style.left )).to.be.above( triggerX );
        expect( parseInt( tooltipTmp.style.left )).to.equal( triggerX + isotipJS.options.tooltipOffset );
    });

    it( 'should be on the bottom if specified', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-bottom' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight;

        expect( parseInt( tooltipTmp.style.top )).to.be.above( triggerY );
        expect( parseInt( tooltipTmp.style.top )).to.equal( triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should be on the left if specified', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-left' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerX = trigger.getBoundingClientRect().left;

        expect( parseInt( tooltipTmp.style.left )).to.be.above( isotipJS.options.windowPadding.left );
        expect( parseInt( tooltipTmp.style.left ) + tooltipTmp.offsetWidth ).to.equal( triggerX - isotipJS.options.tooltipOffset );
    });

    it( 'should go to the bottom if it\'s too close to the top', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-top-edge' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top )).to.be.above( triggerY );
    });

    it( 'should go to the top if there isn\'t enough room on the right', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-right-edge' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top,
            triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth;

        expect( parseInt( tooltipTmp.style.left )).to.be.below( triggerX );
        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should be on the top if there isn\'t enough room on the bottom', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-bottom-edge' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight;

        expect( parseInt( tooltipTmp.style.bottom )).to.be.above( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should be on the bottom if there isn\'t enough room on the top', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-top-edge' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top + tooltipTmp.offsetHeight )).to.be.above( triggerY );
        expect( parseInt( tooltipTmp.style.left )).to.be.above( isotipJS.options.windowPadding.left );
    });

    it( 'should keep up with a click trigger as the page scrolls', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );

        document.body.scrollTop = 40;

        triggerY = trigger.getBoundingClientRect().top;

        isotipJS.positionTooltip( tooltipTmp, trigger );

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should keep up with a focus trigger as the page scrolls', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-focus' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );

        document.body.scrollTop = 40;

        triggerY = trigger.getBoundingClientRect().top;

        isotipJS.positionTooltip( tooltipTmp, trigger );

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });

    it( 'should keep up with a click trigger as a scrollable element scrolls', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-scroll-container' ),
            tooltipContainer = document.querySelector( '.tooltip-container' ),
            scrollContainer = document.querySelector( '.scroll-container' ),
            tooltipTmp = isotipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );

        scrollContainer.scrollTop = 10;

        triggerY = trigger.getBoundingClientRect().top;

        isotipJS.positionTooltip( tooltipTmp, trigger );

        expect( parseInt( tooltipTmp.style.bottom )).to.equal( window.innerHeight - triggerY + isotipJS.options.tooltipOffset );
    });
});

describe( 'tooltip triggers', function() {
    it( 'should open a tooltip on click', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'click' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;
    });

    it( 'should close a tooltip on click on the trigger again', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'click' );
        eventFire( trigger, 'click' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should close a tooltip on click outside of the tooltip', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'click' );
        eventFire( document.body, 'click' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should not close a tooltip on click on the toolip', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'click' );

        tooltipTmp = document.querySelector( '.tooltip' );

        eventFire( tooltipTmp, 'click' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should not close a tooltip on click on a child element in toolip', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp,
            tooltipContent;

        eventFire( trigger, 'click' );

        tooltipTmp = document.querySelector( '.tooltip' );
        tooltipContent = tooltipTmp.querySelector( '.tooltip-content' );

        eventFire( tooltipContent, 'click' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should only remove the tooltip after the removal delay time', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'click' );

        eventFire( trigger, 'click' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should open a tooltip on hover', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-hover' ),
            tooltipTmp;

        eventFire( trigger, 'mouseover' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;
    });

    it( 'should close a tooltip on mouseout', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-hover' ),
            tooltipTmp;

        eventFire( trigger, 'mouseover' );
        eventFire( trigger, 'mouseout' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, isotipJS.options.removalDelay );
    });

    it( 'should not close a tooltip on mouseout if hovered over the tooltip', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: -10
            }
        });

        var trigger = document.querySelector( '.tooltip-hover' ),
            tooltipTmp;

        eventFire( trigger, 'mouseover' );

        tooltipTmp = document.querySelector( '.tooltip' );

        eventFire( tooltipTmp, 'mouseover' );

        window.setTimeout(function() {
            expect( tooltipTmp.parentNode.nodeName ).to.equal( 'BODY' );
        }, isotipJS.options.removalDelay );
    });

    it( 'should open a tooltip on focus', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-focus' ),
            tooltipTmp;

        eventFire( trigger, 'focus' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;
    });

    it( 'should close a tooltip on blur', function() {
        isotipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-focus' ),
            tooltipTmp;

        eventFire( trigger, 'focus' );
        eventFire( trigger, 'blur' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, isotipJS.options.removalDelay );
    });
});
