var tooltipJS = require( '../isotip' ),
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
        tooltipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = tooltipJS.open( trigger );

        expect( tooltipTmp.classList.contains( 'tooltip' )).to.equal( true );
    });

    it( 'should have a p tag containing the content', function() {
        tooltipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = tooltipJS.open( trigger );

        expect( tooltipTmp.childNodes[ 0 ].tagName ).to.equal( 'P' );
    });

    it( 'should have content matching the data-tooltip-content attribute', function() {
        tooltipJS.init();

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = tooltipJS.open( trigger ),
            content = trigger.getAttribute( 'data-tooltip-content' );

        expect( tooltipTmp.childNodes[ 0 ].innerText ).to.equal( content );
    });

    it( 'should have a title if specified', function() {
        tooltipJS.init();

        var trigger = document.querySelector( '.tooltip-title' ),
            tooltipTmp = tooltipJS.open( trigger ),
            title = trigger.getAttribute( 'data-tooltip-title' );

        expect( tooltipTmp.childNodes.length ).to.equal( 2 );
        expect( tooltipTmp.childNodes[ 0 ].tagName ).to.equal( 'P' );
        expect( tooltipTmp.childNodes[ 0 ].innerText ).to.equal( title );
    });

    it( 'should use custom markup for the tooltip container if specified', function() {
        tooltipJS.init({
            template: '<div class="custom-markup tooltip" data-tooltip-target="tooltip"></div>'
        });

        var trigger = document.querySelector( '.tooltip-click' ),
            tooltipTmp = tooltipJS.open( trigger );

        expect( tooltipTmp.tagName ).to.equal( 'DIV' );
        expect( tooltipTmp.classList.contains( 'custom-markup' )).to.equal( true );
    });

    it( 'should use custom markup for the content if specified', function() {
        tooltipJS.init();

        var trigger = document.querySelector( '.tooltip-html' ),
            tooltipTmp = tooltipJS.open( trigger );

        expect( tooltipTmp.childNodes[ 0 ].tagName ).to.equal( 'SPAN' );
        expect( tooltipTmp.childNodes[ 0 ] instanceof Element ).to.equal( true );
    });
});

describe( 'tooltip options', function() {
    it( 'should be able to be overwritten', function() {
        tooltipJS.init({
            placement: 'right'
        });

        expect( tooltipJS.options.placement ).to.equal( 'right' );
    });

    it( 'should be able ovwerwrite only one windowPadding property', function() {
        tooltipJS.init({
            windowPadding: {
                top: 50
            }
        });

        expect( tooltipJS.options.windowPadding.top ).to.equal( 50 );
        expect( tooltipJS.options.windowPadding.bottom ).to.equal( 10 );
    });
});

describe( 'tooltip position', function() {
    it( 'should be on top by default', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top )).to.be.below( triggerY );
        expect( parseInt( tooltipTmp.style.top ) + tooltipTmp.offsetHeight ).to.equal( triggerY - tooltipJS.options.tooltipOffset );
    });

    it( 'should be on the right if specified', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-right' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth;

        expect( parseInt( tooltipTmp.style.left )).to.be.above( triggerX );
        expect( parseInt( tooltipTmp.style.left )).to.equal( triggerX + tooltipJS.options.tooltipOffset );
    });

    it( 'should be on the bottom if specified', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-bottom' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight;

        expect( parseInt( tooltipTmp.style.top )).to.be.above( triggerY );
        expect( parseInt( tooltipTmp.style.top )).to.equal( triggerY + tooltipJS.options.tooltipOffset );
    });

    it( 'should be on the left if specified', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-left' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerX = trigger.getBoundingClientRect().left;

        expect( parseInt( tooltipTmp.style.left )).to.be.above( tooltipJS.options.windowPadding.left );
        expect( parseInt( tooltipTmp.style.left ) + tooltipTmp.offsetWidth ).to.equal( triggerX - tooltipJS.options.tooltipOffset );
    });

    it( 'should go to the bottom if it\'s too close to the top', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-top-edge' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top )).to.be.above( triggerY );
    });

    it( 'should go to the top if there isn\'t enough room on the right', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-right-edge' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top,
            triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth;

        expect( parseInt( tooltipTmp.style.left )).to.be.below( triggerX );
        expect( parseInt( tooltipTmp.style.top )).to.be.below( triggerY );
    });

    it( 'should be on the top if there isn\'t enough room on the bottom', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-bottom-edge' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight;

        expect( parseInt( tooltipTmp.style.top )).to.be.below( triggerY );
    });

    it( 'should be on the top if there isn\'t enough room on the top', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-left-edge' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top + tooltipTmp.offsetHeight )).to.be.below( triggerY );
        expect( parseInt( tooltipTmp.style.left )).to.be.above( tooltipJS.options.windowPadding.left );
    });

    it( 'should keep up with the trigger as the page scrolls', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top + tooltipTmp.offsetHeight )).to.be.below( triggerY );

        document.body.scrollTop = 40;

        triggerY = trigger.getBoundingClientRect().top;

        tooltipJS.positionTooltip( tooltipTmp, trigger );

        expect( parseInt( tooltipTmp.style.top + tooltipTmp.offsetHeight )).to.be.below( triggerY );
    });

    it( 'should reposition the tooltip as needed when the page scrolls', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp = tooltipJS.open( trigger ),
            triggerY = trigger.getBoundingClientRect().top;

        expect( parseInt( tooltipTmp.style.top + tooltipTmp.offsetHeight )).to.be.below( triggerY );

        document.body.scrollTop = 100;

        triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight;

        tooltipJS.positionTooltip( tooltipTmp, trigger );

        expect( parseInt( tooltipTmp.style.top )).to.be.above( triggerY );
    });
});

describe( 'tooltip triggers', function() {
    it( 'should open a tooltip on click', function() {
        tooltipJS.init({
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
        tooltipJS.init({
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
        }, tooltipJS.options.removalDelay );
    });

    it( 'should close a tooltip on click outside of the tooltip', function() {
        tooltipJS.init({
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
        }, tooltipJS.options.removalDelay );
    });

    it( 'should not close a tooltip on click on the toolip', function() {
        tooltipJS.init({
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
        }, tooltipJS.options.removalDelay );
    });

    it( 'should only remove the tooltip after the removal delay time', function() {
        tooltipJS.init({
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
        }, tooltipJS.options.removalDelay );
    });

    it( 'should open a tooltip on hover', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'mouseover' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;
    });

    it( 'should close a tooltip on mouseout', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'mouseover' );
        eventFire( trigger, 'mouseout' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, tooltipJS.options.removalDelay );
    });

    it( 'should open a tooltip on focus', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'focus' );

        tooltipTmp = document.querySelector( '.tooltip' );

        expect( tooltipTmp ).to.exist;
    });

    it( 'should close a tooltip on blur', function() {
        tooltipJS.init({
            placement: 'top',
            windowPadding: {
                top: 10
            }
        });

        var trigger = document.querySelector( '.tooltip-default' ),
            tooltipTmp;

        eventFire( trigger, 'focus' );
        eventFire( trigger, 'blur' );

        window.setTimeout(function() {
            tooltipTmp = document.querySelector( '.tooltip' );

            expect( tooltipTmp ).to.not.exist;
        }, tooltipJS.options.removalDelay );
    });
});
