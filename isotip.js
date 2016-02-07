'use strict'

module.exports = {
  /**
   * Setup global options
   * These can and will be overwriteen if a config object is passed into this.init()
   */
  options: {
    html: false,
    placement: 'top',
    container: 'body',
    scrollContainer: window,
    template: '<div class="tooltip" data-tooltip-target="tooltip"></div>',
    removalDelay: 200,
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
   * @example
   * tooltips.init()
   * @param  {object} (config) - Congifuration object that is used to overwrite the defaults in this.options
   * @return {void}
   */
  init: function initializeTooltips (config) {
    var self = this

    // Check to see if we should use document.body or document.documentElement
    document.documentElement.scrollTop = 1
    this.documentElement = document.documentElement.scrollTop === 1 ? document.documentElement : document.body

    // Test for browser support
    var div = document.createElement('div')

    div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>'
    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    this.innerHTMLBug = !div.getElementsByTagName('link').length
    div = undefined

    // touch event testing
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
      document.body.style.cursor = 'pointer'
    }

    // Wrap map from jquery.
    this.map = {
      legend: [ 1, '<fieldset>', '</fieldset>' ],
      tr: [ 2, '<table><tbody>', '</tbody></table>' ],
      col: [ 2, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
      // for script/link/style tags to work in IE6-8, you have to wrap
      // in a div with a non-whitespace character in front, ha!
      defaultTag: this.innerHTMLBug ? [ 1, 'X<div>', '</div>' ] : [ 0, '', '' ]
    }

    this.map.td = this.map.th = [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ]
    this.map.option = this.map.optgroup = [ 1, '<select multiple="multiple">', '</select>' ]
    this.map.thead = this.map.tbody = this.map.colgroup = this.map.caption = this.map.tfoot = [ 1, '<table>', '</table>' ]
    this.map.text = this.map.circle = this.map.ellipse = this.map.line = this.map.path = this.map.polygon = this.map.polyline = this.map.rect = [ 1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>' ]

    // Copy over ininitialization options to options object
    if (config instanceof Object) {
      for (var option in config) {
        if (window.Object.hasOwnProperty.call(config, option) && window.Object.hasOwnProperty.call(this.options, option)) {
          // If it's a nested object, loop through that one too
          if (typeof config[ option ] === 'object' && !Array.isArray(config[ option ])) {
            for (var subkey in config[ option ]) {
              if (window.Object.hasOwnProperty.call(config[ option ], subkey) && window.Object.hasOwnProperty.call(this.options[ option ], subkey)) {
                this.options[ option ][ subkey ] = config[ option ][ subkey ]
              }
            }
          } else {
            this.options[ option ] = config[ option ]
          }
        }
      }
    }

    // Logic for handling a click event
    function clickHandler (evt) {
      if (!evt) {
        evt = window.event
      }

      var trigger = evt.target || evt.srcElement

      // If there's already a tooltip open, close that one...
      if (self.currentTooltip) {
        // ...unless the user is clicking on the tooltip itself...
        if (trigger === self.currentTooltip) {
          return
        // ...or if the tooltip shouldn't automatically close
        } else if (self.currentTooltip.getAttribute('data-autoclose') === 'false') {
          return
        // ...or if the user if clicking on the original trigger for that tooltip
        } else if (trigger === self.currentTrigger) {
          self.close(self.currentTooltip)

          return
        } else {
          // loop through the child elements in the tooltip to see if one of them has been clicked
          if (self.hasParent(trigger, self.currentTooltip)) {
            return false
          }

          self.close(self.currentTooltip)
        }
      }

      // If the element the user is clicking on isn't supposed to trigger a tooltip, bail
      if (!self.hasClass(trigger, 'tooltip-click')) {
        return
      }

      // Open the tooltip!
      self.open(trigger)
    }

    // Logic for handling a mouseover event
    function mouseoverHandler (evt) {
      if (!evt) {
        evt = window.event
      }

      var trigger = evt.target || evt.srcElement

      // If the element the user is hovering over isn't supposed to trigger a tooltip, bail
      if (!self.hasClass(trigger, 'tooltip-hover')) {
        return
      }

      // If there's already a tooltip open, close that one...
      if (self.currentTooltip) {
        // ...unless the user is hovering over the tooltip itself...
        if (trigger === self.currentTooltip) {
          return
        // ...or if the tooltip shouldn't autoclose
        } else if (self.currentTooltip.getAttribute('data-autoclose') === 'false') {
          return
        } else {
          // loop through the child elements in the tooltip to see if one of them has been clicked
          if (self.hasParent(trigger, self.currentTooltip)) {
            return false
          }

          self.close(self.currentTooltip)
        }
      }

      // Logic for handling the mouseout event
      function mouseoutHandler (moEvt) {
        if (!moEvt) {
          moEvt = window.event
        }

        var moTrigger = evt.target || evt.srcElement

        if (self.hasClass(moTrigger)) {
          return
        }

        // If the tooltip shouldn't autoclose, bail
        if (self.currentTooltip && self.currentTooltip.getAttribute('data-autoclose') === 'false') {
          return
        }

        self.close(self.currentTooltip)

        // Remove self event to keep things clean
        self.removeEventListener(trigger, 'mouseout', mouseoutHandler)

        return
      }

      self.open(trigger)

      // Add an event to remove the tooltip when the user moves their cursor away
      self.addEventListener(trigger, 'mouseout', mouseoutHandler)

      return
    }

    // Logic for handling a focus event
    function focusHandler (evt) {
      if (!evt) {
        evt = window.event
      }

      var trigger = evt.target || evt.srcElement

      // If the element the user is focusing on isn't supposed to trigger a tooltip, bail
      if (!self.hasClass(trigger, 'tooltip-focus')) {
        return
      }

      // If there's already a tooltip open, close that one...
      if (self.currentTooltip && self.currentTooltip.getAttribute('data-autoclose') !== 'false') {
        self.close(self.currentTooltip)
      }

      // Logic for handling the blur event
      function blurHandler () {
        // If the tooltip shouldn't automatically close, bail
        if (self.currentTooltip && self.currentTooltip.getAttribute('data-autoclose') === 'false') {
          return
        }

        self.close(self.currentTooltip)

        // Remove self event to keep things clean
        self.removeEventListener(trigger, 'blur', blurHandler)

        return
      }

      self.open(trigger)

      // Add an event to remove the tooltip when the user blurs from the element
      self.addEventListener(trigger, 'blur', blurHandler)

      return
    }

    this.windowChangeHandler = function windowChangeHandler () {
      if (self.currentTooltip && self.currentTrigger) {
        self.positionTooltip(self.currentTooltip, self.currentTrigger)
      }

      return
    }

    // Add the global click handler
    this.addEventListener(document.body, 'click', clickHandler)

    // Add the global mouseover handler
    this.addEventListener(document.body, 'mouseover', mouseoverHandler)

    // Add the global focus handler
    this.addEventListener(document.body, 'focus', focusHandler, true)

    // If a tooltip is open and the user scrolls, isotip needs to keep up with the trigger
    this.addEventListener(window, 'scroll', this.windowChangeHandler)

    // If a tooltip is open and the user resizes the page, isotip needs to keep up with the trigger
    this.addEventListener(window, 'resize', this.windowChangeHandler)
  },

  /**
   * openTooltip - Main open function to prepare and insert the tooltip
   * @example
   * tooltip.open( document.body.querySelector( '#tooltip-trigger' ))
   * @param  {string|element} trigger - The element that serves as the trigger for the tooltip
   * @param  {object} (options) - An object that corresponds to the possible options using data-tooltip attributes
   * @return {element} - Returns the tooltip that was inserted into the DOM
   */
  open: function openTooltip (trigger, options) {
    // We need a DOM element, so make it one if it isn't already
    if (typeof trigger === 'string') {
      trigger = document.body.querySelector(trigger)
    }

    // If no options are passed in, setup a blank object to prevent errors
    if (!options) {
      options = {}
    }

    // Setup tooltip variables, starting with the config object if there is one
    var className = options.className || trigger.getAttribute('data-tooltip-classname')
    var content = options.content || trigger.getAttribute('data-tooltip-content')
    var title = options.title || trigger.getAttribute('data-tooltip-title')
    var html = options.html || trigger.getAttribute('data-tooltip-html')
    var placement = options.placement || trigger.getAttribute('data-tooltip-placement')
    var container = options.container || trigger.getAttribute('data-tooltip-container')
    var scrollContainer = options.container || trigger.getAttribute('data-tooltip-scrollContainer')
    var autoClose = options.autoClose || trigger.getAttribute('data-tooltip-autoclose') !== 'false'
    var preExistingTooltip = document.querySelector('.tooltip')
    var tooltip = this.createDOMElement(this.options.template)
    var tooltipTitle
    var tooltipContent

    // If there isn't any content to be displayed, bail
    if (!content) {
      return
    }

    tooltip.appendChild(this.createDOMElement('<div class="tooltip-accent"></div>'))

    // If there should be an added class name, add it
    if (className) {
      this.addClass(tooltip, className)
    }

    // If there's a title to be displayed, create the title element
    if (title) {
      tooltipTitle = this.createDOMElement('<p class="tooltip-title">' + title + '</p>')

      tooltip.appendChild(tooltipTitle)
    }

    // If the supplied string should be interpreted as html, make an element for it...
    if ((this.options.html || html) && content) {
      if (this.isElement(content)) {
        tooltipContent = content
      } else if (this.getTagName(content)) {
        tooltipContent = this.createDOMElement(content)
      } else {
        tooltipContent = this.createDOMElement('<p class="tooltip-content">' + content + '</p>')
      }
    // ...or create a default p instead
    } else {
      tooltipContent = this.createDOMElement('<p class="tooltip-content">' + content + '</p>')
    }

    tooltip.appendChild(tooltipContent)

    // If the a container was supplied and it's not also the body element, store that element
    if (container && container !== this.options.container) {
      if (typeof container === 'string') {
        this.currentContainer = document.querySelector(container)
      }
    // If they initialized tooltips and set a different global container, store that element
    } else {
      this.currentContainer = document.querySelector(this.options.container)
    }

    // If a scrollContainer was supplied and it's also not the window element, store that element
    if (scrollContainer && scrollContainer !== this.options.scrollContainer) {
      if (typeof scrollContainer === 'string') {
        this.currentScrollContainer = document.querySelector(scrollContainer)
      }
    // If they initialized tooltips and incase they set a different global container, store that element
    } else {
      this.currentScrollContainer = this.options.scrollContainer
    }

    // If autoClose is set to false, add an attribute for the event handler to look for
    if (!autoClose) {
      tooltip.setAttribute('data-autoclose', 'false')
    }

    if (preExistingTooltip) {
      this.currentTooltip = preExistingTooltip.parentNode.insertBefore(tooltip, preExistingTooltip)
    } else {
      this.currentTooltip = this.currentContainer.appendChild(tooltip)
    }

    this.currentTrigger = trigger

    // Position the tooltip on the page
    this.positionTooltip(this.currentTooltip, this.currentTrigger, placement)

    // If a tooltip is open and the user scrolls, isotip needs to keep up with the trigger
    if (this.currentScrollContainer !== window) {
      this.addEventListener(this.currentScrollContainer, 'scroll', this.windowChangeHandler)
    }

    return this.currentTooltip
  },

  /**
   * closeTooltip - Main close function to close a specific tooltip
   * @example
   * tooltip.close( document.body.querySelector( '.tooltip' ))
   * @param  {string|element} tooltip - The tooltip that needs to be closed
   * @return {void}
   */
  close: function closeTooltip (tooltip) {
    // We need a DOM element, so make it one if it isn't already
    if (typeof tooltip === 'string') {
      tooltip = document.body.querySelector(tooltip)
    }

    if (this.currentScrollContainer !== window) {
      this.removeEventListener(this.currentScrollContainer, 'scroll', this.windowChangeHandler)
    }

    this.removeClass(tooltip, 'visible')

    this.currentTooltip = null
    this.currentTrigger = null
    this.currentScrollContainer = null

    // We should assume that there will be some sort of tooltip animation with CSS or JS
    // So we can only remove the element after a certain period of time
    window.setTimeout(function removeElementFromDOM () {
      if (tooltip && tooltip instanceof window.Element && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip)
      } else {
        tooltip = document.body.querySelector('.tooltip')

        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip)
        }
      }
    }, this.options.removalDelay)
  },

  /**
   * positionTooltip - Logic for positioning the tooltip on the page
   * @example
   * this.positionTooltip( this.currentTooltip, this.currentTrigger, 'top' )
   * @param  {string|element} tooltip - The tooltip that needs to be positioned
   * @param  {string|element} trigger - The element that triggered the tooltip
   * @param  {string} (placement) - The position that the tooltip needs to be placed in in relation to the trigger
   * @return {element} - Returns the tooltip that was positioned
   * @api private
   */
  positionTooltip: function positionTooltip (tooltip, trigger, placement) {
    if (typeof tooltip === 'string') {
      tooltip = document.body.querySelector(tooltip)
    }

    if (typeof trigger === 'string') {
      trigger = document.body.querySelector(trigger)
    }

    // Since we support this being done on scroll, we need a way to get the placement if it isn't specified
    if (!placement) {
      placement = trigger.getAttribute('data-tooltip-placement') || this.options.placement
    }

    var self = this
    var tooltipAccent = tooltip.querySelector('.tooltip-accent')
    var triggerPosition = trigger.getBoundingClientRect()
    var triggerWidth = Math.floor(triggerPosition.width)
    var triggerHeight = Math.floor(triggerPosition.height)
    var triggerX = triggerPosition.left
    var triggerY = triggerPosition.top
    var windowTop = this.options.windowPadding.top
    var windowRight = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - this.options.windowPadding.right
    var windowBottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - this.options.windowPadding.bottom
    var windowLeft = this.options.windowPadding.left
    var containerTop
    var containerRight
    var containerBottom
    var containerLeft
    var tooltipX
    var tooltipY
    var tooltipWidth
    var tooltipHeight
    var tooltipRight
    var tooltipBottom
    var tooltipAccentWidth
    var tooltipAccentHeight

    if (this.currentScrollContainer.getBoundingClientRect) {
      var scrollContainerPosition = this.currentScrollContainer.getBoundingClientRect()

      if (scrollContainerPosition.top >= 0) {
        containerTop = scrollContainerPosition.top + this.options.windowPadding.top
      }

      if (scrollContainerPosition.right <= windowRight) {
        containerRight = scrollContainerPosition.right - this.options.windowPadding.right
      }

      if (scrollContainerPosition.bottom <= windowBottom) {
        containerBottom = scrollContainerPosition.bottom - this.options.windowPadding.bottom
      }

      if (scrollContainerPosition.left >= windowLeft) {
        containerLeft = scrollContainerPosition.left + this.options.windowPadding.left
      }
    }

    /**
     * We sometimes need to re-position the tooltip (I.E. switch from top to bottom)
     * Which is why these are separate functions
     */
    function positionTop () {
      tooltipX = (triggerX - (tooltipWidth / 2)) + (triggerWidth / 2)
      tooltipY = triggerY - tooltipHeight - self.options.tooltipOffset
      tooltipRight = tooltipX + tooltipWidth

      self.addClass(tooltip, 'tooltip-top')

      if (!tooltipAccentWidth) {
        tooltipAccentWidth = parseInt(tooltipAccent.offsetWidth, 10)
      }

      if (!tooltipAccentHeight) {
        tooltipAccentHeight = parseInt(tooltipAccent.offsetHeight, 10)
      }

      if (triggerY + triggerHeight <= containerTop) {
        if (self.hasClass(tooltip, 'visible')) {
          self.removeClass(tooltip, 'visible')
        }
      }

      // If the tooltip extends beyond the right edge of the window...
      if (tooltipRight > windowRight || tooltipRight > containerRight) {
        tooltip.style.top = 'auto'
        tooltip.style.bottom = (windowBottom + self.options.windowPadding.bottom - triggerY + self.options.tooltipOffset) + 'px'
        tooltip.style.right = self.options.windowPadding.right + 'px'
        tooltipAccent.style.left = 'auto'
        tooltipAccent.style.right = ((triggerWidth / 2) - (tooltipAccentWidth / 2)) + (windowRight - triggerX - triggerWidth) + 'px'
      // ...or if the tooltip extends beyond the top of the window...
      } else if (tooltipY < windowTop || tooltipY < containerTop) {
        self.removeClass(tooltip, 'tooltip-top')

        return positionBottom()
      // ...or if the tooltip extends beyond the left edge of the window...
      } else if (tooltipX < windowLeft || tooltipX < containerLeft) {
        tooltip.style.top = 'auto'
        tooltip.style.bottom = (windowBottom + self.options.windowPadding.bottom - triggerY + self.options.tooltipOffset) + 'px'
        tooltip.style.left = self.options.windowPadding.left + 'px'
        tooltipAccent.style.right = 'auto'
        tooltipAccent.style.left = ((triggerWidth / 2) - (tooltipAccentWidth / 2)) + (triggerX - windowLeft) + 'px'
      // ...or it fits inside the window
      } else {
        tooltip.style.top = 'auto'
        tooltip.style.bottom = (windowBottom + self.options.windowPadding.bottom - triggerY + self.options.tooltipOffset) + 'px'
        tooltip.style.left = tooltipX + 'px'
        tooltipAccent.style.top = ''
        tooltipAccent.style.bottom = ''
        tooltipAccent.style.right = ''
        tooltipAccent.style.left = ((tooltipWidth / 2) - (tooltipAccentWidth / 2)) + 'px'
      }
    }

    function positionRight () {
      tooltipX = triggerX + triggerWidth + self.options.tooltipOffset
      tooltipY = (triggerY - (tooltipHeight / 2)) + (triggerHeight / 2)
      tooltipRight = tooltipX + tooltipWidth

      self.addClass(tooltip, 'tooltip-right')

      if (!tooltipAccentHeight) {
        tooltipAccentHeight = parseInt(tooltipAccent.offsetHeight, 10)
      }

      // If the tooltip extends beyond the right edge of the screen...
      if (tooltipRight > windowRight || tooltipRight > containerRight) {
        self.removeClass(tooltip, 'tooltip-right')

        return positionTop()
      // ...or if it fits to the right of the trigger element
      } else {
        tooltip.style.top = tooltipY + 'px'
        tooltip.style.left = tooltipX + 'px'
        tooltipAccent.style.right = ''
        tooltipAccent.style.bottom = ''
        tooltipAccent.style.left = ''
        tooltipAccent.style.top = ((tooltipHeight / 2) - (tooltipAccentHeight / 2)) + 'px'
      }
    }

    function positionBottom () {
      tooltipX = (triggerX - (tooltipWidth / 2)) + (triggerWidth / 2)
      tooltipY = triggerY + triggerHeight + self.options.tooltipOffset
      tooltipRight = tooltipX + tooltipWidth
      tooltipBottom = tooltipY + tooltipHeight

      self.addClass(tooltip, 'tooltip-bottom')

      if (!tooltipAccentWidth) {
        tooltipAccentWidth = parseInt(tooltipAccent.offsetWidth, 10)
      }

      if (triggerY >= containerBottom) {
        if (self.hasClass(tooltip, 'visible')) {
          self.removeClass(tooltip, 'visible')
        }
      }

      // If the tooltip extends beyond the right edge of the window...
      if (tooltipRight > windowRight || tooltipRight > containerRight) {
        tooltip.style.top = tooltipY + 'px'
        tooltip.style.right = self.options.windowPadding.right + 'px'
        tooltipAccent.style.left = 'auto'
        tooltipAccent.style.right = ((triggerWidth / 2) - (tooltipAccentWidth / 2)) + (windowRight - triggerX - triggerWidth) + 'px'
      // ...or if the tooltip extends beyond the top of the window...
      } else if (tooltipBottom > windowBottom || tooltipBottom > containerBottom) {
        self.removeClass(tooltip, 'tooltip-bottom')

        return positionTop()
      // ...or if the tooltip extends beyond the left edge of the window...
      } else if (tooltipX < windowLeft || tooltipX < windowLeft) {
        tooltip.style.top = tooltipY + 'px'
        tooltip.style.left = self.options.windowPadding.left + 'px'
        tooltipAccent.style.right = 'auto'
        tooltipAccent.style.left = ((triggerWidth / 2) - (tooltipAccentWidth / 2)) + (triggerX - windowLeft) + 'px'
      // ...or it fits inside the window
      } else {
        tooltip.style.top = tooltipY + 'px'
        tooltip.style.bottom = 'auto'
        tooltip.style.left = tooltipX + 'px'
        tooltipAccent.style.top = ''
        tooltipAccent.style.bottom = ''
        tooltipAccent.style.right = ''
        tooltipAccent.style.left = ((tooltipWidth / 2) - (tooltipAccentWidth / 2)) + 'px'
      }
    }

    function positionLeft () {
      tooltipX = triggerX - tooltipWidth - self.options.tooltipOffset
      tooltipY = (triggerY - (tooltipHeight / 2)) + (triggerHeight / 2)

      self.addClass(tooltip, 'tooltip-left')

      if (!tooltipAccentHeight) {
        tooltipAccentHeight = parseInt(tooltipAccent.offsetHeight, 10)
      }

      // If the tooltip extends beyond the right edge of the screen...
      if (tooltipX < windowLeft || tooltipX < containerLeft) {
        self.removeClass(tooltip, 'tooltip-left')

        return positionTop()
      // ...or if it fits to the left of the trigger element
      } else {
        tooltip.style.top = tooltipY + 'px'
        tooltip.style.left = tooltipX + 'px'
        tooltipAccent.style.right = ''
        tooltipAccent.style.bottom = ''
        tooltipAccent.style.left = ''
        tooltipAccent.style.top = ((tooltipHeight / 2) - (tooltipAccentHeight / 2)) + 'px'
      }
    }

    tooltip.style.position = 'fixed'

    tooltipWidth = parseInt(tooltip.offsetWidth, 10)
    tooltipHeight = parseInt(tooltip.offsetHeight, 10)
    tooltipAccentWidth = parseInt(tooltipAccent.offsetWidth, 10)
    tooltipAccentHeight = parseInt(tooltipAccent.offsetHeight, 10)

    // clear any classes set before hand
    self.removeClass(tooltip, 'tooltip-top')
    self.removeClass(tooltip, 'tooltip-right')
    self.removeClass(tooltip, 'tooltip-bottom')
    self.removeClass(tooltip, 'tooltip-left')

    // position the tooltip
    if (placement === 'top') {
      positionTop()
    } else if (placement === 'right') {
      positionRight()
    } else if (placement === 'bottom') {
      positionBottom()
    } else if (placement === 'left') {
      positionLeft()
    }

    // try and give the tooltip enough time to position itself
    if (!self.hasClass(tooltip, 'visible') && (containerTop === undefined || (triggerY + triggerHeight > containerTop && triggerY < containerBottom))) {
      window.setTimeout(function () {
        self.addClass(tooltip, 'visible')
      }, 50)
    } else if (triggerY + triggerHeight <= containerTop || triggerY >= containerBottom) {
      self.removeClass(tooltip, 'visible')
    }

    return tooltip
  },

  /**
   * addEventListener - Small function to add an event listener. Should be compatible with IE8+
   * @example
   * this.addEventListener( document.body, 'click', this.open( this.currentTooltip ))
   * @param  {element} el - The element node that needs to have the event listener added
   * @param  {string} eventName - The event name (sans the "on")
   * @param  {function} handler - The function to be run when the event is triggered
   * @return {element} - The element that had an event bound
   * @api private
   */
  addEventListener: function addEventListener (el, eventName, handler, useCapture) {
    if (!useCapture) {
      useCapture = false
    }

    if (el.addEventListener) {
      el.addEventListener(eventName, handler, useCapture)

      return el
    } else {
      if (eventName === 'focus') {
        eventName = 'focusin'
      }

      el.attachEvent('on' + eventName, function () {
        handler.call(el)
      })

      return el
    }
  },

  /**
   * removeEventListener - Small function to remove and event listener. Should be compatible with IE8+
   * @example
   * this.removeEventListener( document.body, 'click', this.open( this.currentTooltip ))
   * @param  {element} el - The element node that needs to have the event listener removed
   * @param  {string} eventName - The event name (sans the "on")
   * @param  {function} handler - The function that was to be run when the event is triggered
   * @return {element} - The element that had an event removed
   * @api private
   */
  removeEventListener: function removeEventListener (el, eventName, handler, useCapture) {
    if (!useCapture) {
      useCapture = false
    }

    if (!el) {
      return
    }

    if (el.removeEventListener) {
      el.removeEventListener(eventName, handler, useCapture)
    } else {
      if (eventName === 'focus') {
        eventName = 'focusin'
      }

      el.detachEvent('on' + eventName, function () {
        handler.call(el)
      })
    }

    return el
  },

  /**
   * hasClass - Small function to see if an element has a specific class. Should be compatible with IE8+
   * @example
   * this.hasClass( this.currentTooltip, 'visible' )
   * @param  {element} el - The element to check the class existence on
   * @param  {string} className - The class to check for
   * @return {boolean} - True or false depending on if the element has the class
   * @api private
   */
  hasClass: function hasClass (el, className) {
    if (el.classList) {
      return el.classList.contains(className)
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
    }
  },

  /**
   * addClass - Small function to add a class to an element. Should be compatible with IE8+
   * @example
   * this.addClass( this.currentTooltip, 'visible' )
   * @param  {element} el - The element to add the class to
   * @param  {string} className - The class name to add to the element
   * @return {element} - The element that had the class added to it
   * @api private
   */
  addClass: function addClass (el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      el.className += ' ' + className
    }

    return el
  },

  /**
   * removeClass - Small function to remove a class from an element. Should be compatible with IE8+
   * @example
   * this.removeClass( this.currentTooltip, 'visible' )
   * @param  {element} el - The element to remove the class from
   * @param  {string} className - The class name to remove from the element
   * @return {element} - The element that had the class removed from it
   * @api private
   */
  removeClass: function removeClass (el, className) {
    if (el) {
      if (el.classList) {
        el.classList.remove(className)
      } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
      }
    }

    return el
  },

  /**
   * setInnerText - Small function to set the inner text of an element. Should be compatible with IE8+
   * @example
   * this.setInnerText( this.currentTooltip, 'Hello world' )
   * @param  {element} el - The element to have the text inserted into
   * @param  {string} text - The text to insert into the element
   * @return {element} - The element with the new inner text
   * @api private
   */
  setInnerText: function setInnerText (el, text) {
    if (el.textContent !== undefined) {
      el.textcontent = text
    } else {
      el.innerText = text
    }

    return el
  },

  /**
   * getTagName - Small function to get the tag name of an html string.
   * @example
   * this.getTagName( '<div></div>' )
   * @param  {string} html - The string of html to check for the tag
   * @return {object} - The object containing the tag of the root element in the html string as well as some other basic info
   * @api private
   */
  getTagName: function getTagName (html) {
    return /<([\w:]+)/.exec(html)
  },

  /**
   * isElement - Small function to determine if object is a DOM element.
   * @example
   * this.isElement( '<div></div>' );  # false
   * @example
   * this.isElement( this.createElement('div') );  # true
   * @param  {string} obj - The object to check
   * @return {boolean} - Whether or not the object is a DOM element.
   * @api private
   */
  isElement: function getTagName (obj) {
    return !!(obj && obj.nodeType === 1)
  },

  /**
   * createDOMElement - Small function to transform an html string into an element
   * @example
   * this.createDOMElement( '<div class="new-element">Hello world</div>' )
   * @param  {string} html - The string of html to turn into html
   * @return {element} - The element created from the string of html
   * @api private
   */
  createDOMElement: function createDOMElement (html) {
    // Remove whitespace
    html = html.replace(/^\s+|\s+$/g, '')

    // Get the tag name and match it to this.map incase it needs more nodes
    var templateTag = this.getTagName(html)[ 1 ]
    var wrap = this.map[ templateTag ] || this.map.defaultTag
    var depth = wrap[ 0 ]
    var prefix = wrap[ 1 ]
    var suffix = wrap[ 2 ]
    var el = document.createElement('div')

    el.innerHTML = prefix + html + suffix

    while (depth--) {
      el = el.lastChild
    }

    // Extract the fresh element
    return el.removeChild(el.firstChild)
  },

  /**
   * hasParent - Small element to find the closest parent to an element
   * @example
   * element.closest('.tooltip')
   * @param {Element} el - The element to start with
   * @param {Element} parent - The parent element to match against/search for
   * @return {bool} - Whether or not the element has the parent
   */
  hasParent: function hasParent (el, parent) {
    if (!el || !parent) {
      return false
    }

    var match = false

    while (el.parentNode && !match) {
      el = el.parentNode

      if (el === parent) {
        match = true
      }
    }

    return match
  }
}
