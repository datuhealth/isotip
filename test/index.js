var tooltipJS = require( '../tooltip' ),
    chai = require( 'chai' ),
    expect = chai.expect;

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
