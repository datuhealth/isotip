/* global isotip */

'use strict'

function eventFire (el, evtType) {
  if (el.fireEvent) {
    el.fireEvent('on' + evtType)
  } else {
    var evtObj = document.createEvent('Events')

    evtObj.initEvent(evtType, true, false)
    el.dispatchEvent(evtObj)
  }
}

describe('tooltip markup', function () {
  beforeEach(function () {
    var tooltip = document.querySelector('.tooltip')

    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip)
    }
  })

  it('should have a class of tooltip', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.classList.contains('tooltip')).to.be.ok
  })

  it('should have a custom class is specified', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.classList.contains('top-edge')).to.be.ok
  })

  it('should have a tooltip accent element', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.childNodes[0].tagName).to.equal('DIV')
    expect(tooltipTmp.childNodes[0].classList.contains('tooltip-accent')).to.be.ok
  })

  it('should have a p tag containing the content', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.childNodes[1].tagName).to.equal('P')
  })

  it('should have content matching the data-tooltip-content attribute', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)
    var content = trigger.getAttribute('data-tooltip-content')

    expect(tooltipTmp.childNodes[1].innerText).to.equal(content)
  })

  it('should have a title if specified', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-title')
    var tooltipTmp = isotip.open(trigger)
    var title = trigger.getAttribute('data-tooltip-title')

    expect(tooltipTmp.childNodes.length).to.equal(3)
    expect(tooltipTmp.childNodes[1].tagName).to.equal('P')
    expect(tooltipTmp.childNodes[1].innerText).to.equal(title)
  })

  it('should use custom markup for the tooltip container if specified', function () {
    isotip.init({
      template: '<div class="custom-markup tooltip" data-tooltip-target="tooltip"></div>'
    })

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.tagName).to.equal('DIV')
    expect(tooltipTmp.classList.contains('custom-markup')).to.be.ok
  })

  it('should use custom markup for the content if specified', function () {
    isotip.init()

    var trigger = document.querySelector('.tooltip-html')
    var tooltipTmp = isotip.open(trigger)

    expect(tooltipTmp.childNodes[1].tagName).to.equal('SPAN')
    expect(tooltipTmp.childNodes[1] instanceof window.Element).to.be.ok
  })

  it('should accept a DOM Element', function () {
    isotip.init()

    var selector = '.tooltip-empty-insert-point'
    var el = document.createElement('p')
    var config = { html: true, content: el }
    var tooltipTmp = isotip.open(selector, config)
    expect(tooltipTmp.childNodes[1].tagName).to.equal('P')
  })
})

describe('tooltip options', function () {
  it('should be able to be overwritten', function () {
    isotip.init({
      placement: 'right'
    })

    expect(isotip.options.placement).to.equal('right')
  })

  it('should be able ovwerwrite only one windowPadding property', function () {
    isotip.init({
      windowPadding: {
        top: 50
      }
    })

    expect(isotip.options.windowPadding.top).to.equal(50)
    expect(isotip.options.windowPadding.bottom).to.equal(10)
  })
})

describe('tooltip position', function () {
  it('should be on top by default', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })

  it('should be on the right if specified', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-right')
    var tooltipTmp = isotip.open(trigger)
    var triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth

    expect(parseInt(tooltipTmp.style.left, 10)).to.be.above(triggerX)
    expect(parseInt(tooltipTmp.style.left, 10)).to.equal(triggerX + isotip.options.tooltipOffset)
  })

  it('should be on the bottom if specified', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-bottom')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight

    expect(parseInt(tooltipTmp.style.top, 10)).to.be.above(triggerY)
    expect(parseInt(tooltipTmp.style.top, 10)).to.equal(triggerY + isotip.options.tooltipOffset)
  })

  it('should be on the left if specified', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-left')
    var tooltipTmp = isotip.open(trigger)
    var triggerX = trigger.getBoundingClientRect().left

    expect(parseInt(tooltipTmp.style.left, 10)).to.be.above(isotip.options.windowPadding.left)
    expect(parseInt(tooltipTmp.style.left, 10) + tooltipTmp.offsetWidth).to.equal(triggerX - isotip.options.tooltipOffset)
  })

  it("should go to the bottom if it's too close to the top", function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-top-edge')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.top, 10)).to.be.above(triggerY)
  })

  it("should go to the top if there isn't enough room on the right", function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-right-edge')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top
    var triggerX = trigger.getBoundingClientRect().left + trigger.offsetWidth

    expect(parseInt(tooltipTmp.style.left, 10)).to.be.below(triggerX)
    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })

  it("should be on the top if there isn't enough room on the bottom", function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-bottom-edge')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top + trigger.offsetHeight

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.be.above(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })

  it("should be on the bottom if there isn't enough room on the top", function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-top-edge')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.top + tooltipTmp.offsetHeight, 10)).to.be.above(triggerY)
    expect(parseInt(tooltipTmp.style.left, 10)).to.be.above(isotip.options.windowPadding.left)
  })

  it('should keep up with a click trigger as the page scrolls', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)

    document.body.scrollTop = 40

    triggerY = trigger.getBoundingClientRect().top

    isotip.positionTooltip(tooltipTmp, trigger)

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })

  it('should keep up with a focus trigger as the page scrolls', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-focus')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)

    document.body.scrollTop = 40

    triggerY = trigger.getBoundingClientRect().top

    isotip.positionTooltip(tooltipTmp, trigger)

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })

  it('should keep up with a click trigger as a scrollable element scrolls', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-scroll-container')
    var scrollContainer = document.querySelector('.scroll-container')
    var tooltipTmp = isotip.open(trigger)
    var triggerY = trigger.getBoundingClientRect().top

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)

    scrollContainer.scrollTop = 10

    triggerY = trigger.getBoundingClientRect().top

    isotip.positionTooltip(tooltipTmp, trigger)

    expect(parseInt(tooltipTmp.style.bottom, 10)).to.equal(window.innerHeight - triggerY + isotip.options.tooltipOffset)
  })
})

describe('tooltip triggers', function () {
  beforeEach(function () {
    isotip.currentTooltip && isotip.currentTooltip.parentNode.removeChild(isotip.currentTooltip)

    isotip.currentTooltip = null
    isotip.currentTrigger = null
  })

  it('should open a tooltip on click', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp

    eventFire(trigger, 'click')

    tooltipTmp = document.querySelector('.tooltip.default')

    expect(tooltipTmp).to.exist
  })

  it('should close a tooltip on click on the trigger again', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp = isotip.open(trigger)

    eventFire(trigger, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should close a tooltip on click outside of the tooltip', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp = isotip.open(trigger)

    eventFire(document.body, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on click on the toolip', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp = isotip.open(trigger)

    eventFire(tooltipTmp, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip if autoClose is set to false', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    eventFire(trigger, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip if autoClose is set to false programmatically', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    eventFire(trigger, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not open another tooltip if one with autoClose set to false is already open', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-click'))

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not open another tooltip programmatically if one with autoClose set to false is already open', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-default'))

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on click on a child element in toolip', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-html')
    var tooltipTmp = isotip.open(trigger)
    var tooltipContent = tooltipTmp.querySelector('.custom')

    eventFire(tooltipContent, 'click')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should only remove the tooltip after the removal delay time', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-default')
    var tooltipTmp

    eventFire(trigger, 'click')

    eventFire(trigger, 'click')

    tooltipTmp = document.querySelector('.tooltip.default')

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should open a tooltip on hover', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-hover')
    var tooltipTmp

    eventFire(trigger, 'mouseover')

    tooltipTmp = document.querySelector('.tooltip')

    expect(tooltipTmp).to.exist
  })

  it('should close a tooltip on mouseout', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-hover')
    var tooltipTmp

    eventFire(trigger, 'mouseover')
    eventFire(trigger, 'mouseout')

    window.setTimeout(function () {
      tooltipTmp = document.querySelector('.tooltip.hover')

      expect(tooltipTmp).to.not.exist

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on mouseout if hovered over the tooltip', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: -10
      }
    })

    var trigger = document.querySelector('.tooltip-hover')
    var tooltipTmp

    eventFire(trigger, 'mouseover')

    tooltipTmp = document.querySelector('.tooltip.hover')

    eventFire(tooltipTmp, 'mouseover')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on mouseout if autoClose is set to false', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: -10
      }
    })

    var trigger = document.querySelector('.tooltip-hover.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    eventFire(trigger, 'mouseout')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not open a new tooltip on mouseover if one with autoClose set to false exists', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: -10
      }
    })

    var trigger = document.querySelector('.tooltip-click.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-hover'))

    setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on mouseout if autoClose is set to false programmatically', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: -10
      }
    })

    var trigger = document.querySelector('.tooltip-hover.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    eventFire(trigger, 'mouseout')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not open a new tooltip on mouseover programmatically if one with autoClose set to false exists', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: -10
      }
    })

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-hover'))

    setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should open a tooltip on focus', function () {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-focus')
    var tooltipTmp

    eventFire(trigger, 'focus')

    tooltipTmp = document.querySelector('.tooltip.focus')

    expect(tooltipTmp).to.exist
  })

  it('should close a tooltip on blur', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-focus')
    var tooltipTmp

    eventFire(trigger, 'focus')
    eventFire(trigger, 'blur')

    window.setTimeout(function () {
      tooltipTmp = document.querySelector('.tooltip.focus')

      expect(document.documentElement.contains(tooltipTmp)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on blur if autoClose is set to false', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-focus.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    eventFire(trigger, 'blur')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should open a new tooltip on blur if one with autoClose set to false exists', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click.tooltip-no-close')
    var tooltipTmp = isotip.open(trigger)

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-focus'))

    setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should not close a tooltip on focus if autoClose is set to false programmatically', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-focus')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    eventFire(trigger, 'blur')

    window.setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should open a new tooltip programmatically on focus if one with autoClose set to false exists', function (done) {
    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      }
    })

    var trigger = document.querySelector('.tooltip-click')
    var tooltipTmp = isotip.open(trigger, { autoClose: false })

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    var tooltipTmp2 = isotip.open(document.querySelector('.tooltip-focus'))

    setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok
      expect(document.documentElement.contains(tooltipTmp2)).to.not.be.ok

      done()
    }, isotip.options.removalDelay + 1)
  })

  it('should close the tooltip after a certain amount of time', function (done) {
    var timeout = 500

    isotip.init({
      placement: 'top',
      windowPadding: {
        top: 10
      },
      removalDelay: 100
    })

    var trigger = document.querySelector('.tooltip-timeout')
    var tooltipTmp = isotip.open(trigger, {timeout: timeout})

    expect(document.documentElement.contains(tooltipTmp)).to.be.ok

    setTimeout(function () {
      expect(document.documentElement.contains(tooltipTmp)).to.be.ok

      setTimeout(function () {
        expect(document.documentElement.contains(tooltipTmp)).to.not.be.ok

        done()
      }, timeout / 2 + isotip.options.removalDelay + 1)
    }, timeout / 2)
  })
})
