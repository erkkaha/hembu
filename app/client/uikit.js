/*! UIkit 2.8.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(core) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit", function(){

            var uikit = core(window, window.jQuery, window.document);

            uikit.load = function(res, req, onload, config) {

                var resources = res.split(','), load = [], i, base = (config.config && config.config.uikit && config.config.uikit.base ? config.config.uikit.base : "").replace(/\/+$/g, "");

                if (!base) {
                    throw new Error( "Please define base path to uikit in the requirejs config." );
                }

                for (i = 0; i < resources.length; i += 1) {
                    var resource = resources[i].replace(/\./g, '/');
                    load.push(base+'/js/addons/'+resource);
                }

                req(load, function() {
                    onload(uikit);
                });
            };

            return uikit;
        });
    }

    if (!window.jQuery) {
        throw new Error( "UIkit requires jQuery" );
    }

    if (window && window.jQuery) {
        core(window, window.jQuery, window.document);
    }


})(function(global, $, doc) {

    "use strict";

    var UI = $.UIkit || {}, $html = $("html"), $win = $(window), $doc = $(document);

    if (UI.fn) {
        return UI;
    }

    UI.version = '2.8.0';
    UI.$doc    = $doc;
    UI.$win    = $win;

    UI.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!UI[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };


    UI.support = {};
    UI.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    UI.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    UI.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ setTimeout(callback, 1000/60); };
    UI.support.touch                 = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (global.DocumentTouch && document instanceof global.DocumentTouch)  ||
        (global.navigator['msPointerEnabled'] && global.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (global.navigator['pointerEnabled'] && global.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    UI.support.mutationobserver      = (global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver || null);

    UI.Utils = {};

    UI.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
              _ref = document.styleSheets;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stylesheet = _ref[_i];
                idxs = [];
                stylesheet.cssRules = stylesheet.cssRules;
                for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                  if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                    idxs.unshift(idx);
                  }
                }
                for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                  stylesheet.deleteRule(idxs[_k]);
                }
              }
            } catch (_error) {}
        }, 0);
    };

    UI.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    };

    UI.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    UI.Utils.template = function(str, data) {

        var tokens = str.replace(/\n/g, '\\n').replace(/\{\{\{\s*(.+?)\s*\}\}\}/g, "{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),
            i=0, toc, cmd, prop, val, fn, output = [], openblocks = 0;

        while(i < tokens.length) {

            toc = tokens[i];

            if(toc.match(/\{\{\s*(.+?)\s*\}\}/)) {
                i = i + 1;
                toc  = tokens[i];
                cmd  = toc[0];
                prop = toc.substring(toc.match(/^(\^|\#|\!|\~|\:)/) ? 1:0);

                switch(cmd) {
                    case '~':
                        output.push("for(var $i=0;$i<"+prop+".length;$i++) { var $item = "+prop+"[$i];");
                        openblocks++;
                        break;
                    case ':':
                        output.push("for(var $key in "+prop+") { var $val = "+prop+"[$key];");
                        openblocks++;
                        break;
                    case '#':
                        output.push("if("+prop+") {");
                        openblocks++;
                        break;
                    case '^':
                        output.push("if(!"+prop+") {");
                        openblocks++;
                        break;
                    case '/':
                        output.push("}");
                        openblocks--;
                        break;
                    case '!':
                        output.push("__ret.push("+prop+");");
                        break;
                    default:
                        output.push("__ret.push(escape("+prop+"));");
                        break;
                }
            } else {
                output.push("__ret.push('"+toc.replace(/\'/g, "\\'")+"');");
            }
            i = i + 1;
        }

        fn  = [
            'var __ret = [];',
            'try {',
            'with($data){', (!openblocks ? output.join('') : '__ret = ["Not all blocks are closed correctly."]'), '};',
            '}catch(e){__ret = [e.message];}',
            'return __ret.join("").replace(/\\n\\n/g, "\\n");',
            "function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"
        ].join("\n");

        var func = new Function('$data', fn);
        return data ? func(data) : func;
    };

    UI.Utils.events       = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    $.UIkit = UI;
    $.fn.uk = UI.fn;

    $.UIkit.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        $doc.trigger("uk-domready");

        // custom scroll observer
        setInterval((function(){

            var memory = {x: window.scrollX, y:window.scrollY};

            var fn = function(){

                if (memory.x != window.scrollX || memory.y != window.scrollY) {
                    memory = {x: window.scrollX, y:window.scrollY};
                    $doc.trigger('uk-scroll', [memory]);
                }
            };

            if ($.UIkit.support.touch) {
                $doc.on('touchmove touchend MSPointerMove MSPointerUp', fn);
            }

            if(memory.x || memory.y) fn();

            return fn;

        })(), 15);


        // Check for dom modifications
        if(!UI.support.mutationobserver) return;

        try{

            var observer = new UI.support.mutationobserver(UI.Utils.debounce(function(mutations) {
                $doc.trigger("uk-domready");
            }, 150));

            // pass in the target node, as well as the observer options
            observer.observe(document.body, { childList: true, subtree: true });

        } catch(e) {}

        // remove css hover rules for touch devices
        if (UI.support.touch) {
            UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);
        }
    });

    // add touch identifier class
    $html.addClass(UI.support.touch ? "uk-touch" : "uk-notouch");

    // add uk-hover class on tap to support overlays on touch devices
    if (UI.support.touch) {

        var hoverset = false, selector = '.uk-overlay, .uk-overlay-toggle, .uk-has-hover', exclude;

        $doc.on('touchstart MSPointerDown', selector, function() {

            if(hoverset) $('.uk-hover').removeClass('uk-hover');

            hoverset = $(this).addClass('uk-hover');

        }).on('touchend MSPointerUp', function(e) {

            exclude = $(e.target).parents(selector);

            if (hoverset) hoverset.not(exclude).removeClass('uk-hover');
        });
    }

    return UI;
});

/**
 * Promises/A+ spec. polyfill
 * promiscuous - https://github.com/RubenVerborgh/promiscuous
 * @license MIT
 * Ruben Verborgh
 */

(function(global){

    global.Promise = global.Promise || (function (func, obj) {

        // Type checking utility function
        function is(type, item) { return (typeof item)[0] == type; }

        // Creates a promise, calling callback(resolve, reject), ignoring other parameters.
        function Promise(callback, handler) {
            // The `handler` variable points to the function that will
            // 1) handle a .then(resolved, rejected) call
            // 2) handle a resolve or reject call (if the first argument === `is`)
            // Before 2), `handler` holds a queue of callbacks.
            // After 2), `handler` is a finalized .then handler.
            handler = function pendingHandler(resolved, rejected, value, queue, then, i) {
                queue = pendingHandler.q;

                // Case 1) handle a .then(resolved, rejected) call
                if (resolved != is) {
                    return Promise(function (resolve, reject) {
                        queue.push({ p: this, r: resolve, j: reject, 1: resolved, 0: rejected });
                    });
                }

                // Case 2) handle a resolve or reject call
                // (`resolved` === `is` acts as a sentinel)
                // The actual function signature is
                // .re[ject|solve](<is>, success, value)

                // Check if the value is a promise and try to obtain its `then` method
                if (value && (is(func, value) | is(obj, value))) {
                    try { then = value.then; }
                    catch (reason) { rejected = 0; value = reason; }
                }
                // If the value is a promise, take over its state
                if (is(func, then)) {
                    var valueHandler = function (resolved) {
                        return function (value) { return then && (then = 0, pendingHandler(is, resolved, value)); };
                    };
                    try { then.call(value, valueHandler(1), rejected = valueHandler(0)); }
                    catch (reason) { rejected(reason); }
                }
                // The value is not a promise; handle resolve/reject
                else {
                    // Replace this handler with a finalized resolved/rejected handler
                    handler = function (Resolved, Rejected) {
                        // If the Resolved or Rejected parameter is not a function,
                        // return the original promise (now stored in the `callback` variable)
                        if (!is(func, (Resolved = rejected ? Resolved : Rejected))) return callback;
                        // Otherwise, return a finalized promise, transforming the value with the function
                        return Promise(function (resolve, reject) { finalize(this, resolve, reject, value, Resolved); });
                    };
                    // Resolve/reject pending callbacks
                    i = 0;
                    while (i < queue.length) {
                        then = queue[i++];
                        // If no callback, just resolve/reject the promise
                        if (!is(func, resolved = then[rejected])) {
                            (rejected ? then.r : then.j)(value);
                        // Otherwise, resolve/reject the promise with the result of the callback
                        } else {
                            finalize(then.p, then.r, then.j, value, resolved);
                        }
                    }
                }
            };

            // The queue of pending callbacks; garbage-collected when handler is resolved/rejected
            handler.q = [];

            // Create and return the promise (reusing the callback variable)
            callback.call(callback = {
                    then:  function (resolved, rejected) { return handler(resolved, rejected); },
                    catch: function (rejected)           { return handler(0,        rejected); }
                },
                function (value)  { handler(is, 1,  value); },
                function (reason) { handler(is, 0, reason); }
            );

            return callback;
        }

        // Finalizes the promise by resolving/rejecting it with the transformed value
        function finalize(promise, resolve, reject, value, transform) {
            setTimeout(function () {
                try {
                    // Transform the value through and check whether it's a promise
                    value = transform(value);
                    transform = value && (is(obj, value) | is(func, value)) && value.then;
                    // Return the result if it's not a promise
                    if (!is(func, transform))
                        resolve(value);
                    // If it's a promise, make sure it's not circular
                    else if (value == promise)
                        reject(TypeError());
                    // Take over the promise's state
                    else
                        transform.call(value, resolve, reject);
                }
                catch (error) { reject(error); }
            }, 0);
        }

        // Creates a resolved promise
        Promise.resolve = ResolvedPromise;
        function ResolvedPromise(value) { return Promise(function (resolve) { resolve(value); }); }

        // Creates a rejected promise
        Promise.reject = function (reason) { return Promise(function (resolve, reject) { reject(reason); }); };

        // Transforms an array of promises into a promise for an array
        Promise.all = function (promises) {
            return Promise(function (resolve, reject, count, values) {
                // Array of collected values
                values = [];
                // Resolve immediately if there are no promises
                count = promises.length || resolve(values);
                // Transform all elements (`map` is shorter than `forEach`)
                promises.map(function (promise, index) {
                    ResolvedPromise(promise).then(
                    // Store the value and resolve if it was the last
                    function (value) {
                        values[index] = value;
                        count = count -1;
                        if(!count) resolve(values);
                    },
                    // Reject if one element fails
                    reject);
                });
            });
        };

        return Promise;
    })('f', 'o');
})(this);

(function($, UI) {

    "use strict";

    UI.components = {};

    UI.component = function(name, def) {

        var fn = function(element, options) {

            var $this = this;

            this.element = element ? $(element) : null;
            this.options = $.extend(true, {}, this.defaults, options);
            this.plugins = {};

            if (this.element) {
                this.element.data(name, this);
            }

            this.init();

            (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

                if (fn.plugins[plugin].init) {
                    fn.plugins[plugin].init($this);
                    $this.plugins[plugin] = true;
                }

            });

            this.trigger('init', [this]);
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            init: function(){},

            on: function(){
                return $(this.element || this).on.apply(this.element || this, arguments);
            },

            one: function(){
                return $(this.element || this).one.apply(this.element || this, arguments);
            },

            off: function(evt){
                return $(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                return $(this.element || this).trigger(evt, params);
            },

            find: function(selector) {
                return this.element ? this.element.find(selector) : $([]);
            },

            proxy: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
                });
            },

            mixin: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = obj[method].bind($this);
                });
            },

        }, def);

        this.components[name] = fn;

        this[name] = function() {

            var element, options;

            if(arguments.length) {
                switch(arguments.length) {
                    case 1:

                        if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
                            element = $(arguments[0]);
                        } else {
                            options = arguments[0];
                        }

                        break;
                    case 2:

                        element = $(arguments[0]);
                        options = arguments[1];
                        break;
                }
            }

            if (element && element.data(name)) {
                return element.data(name);
            }

            return (new UI.components[name](element, options));
        };

        return fn;
    };

    UI.plugin = function(component, name, def) {
        this.components[component].plugins[name] = def;
    };

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange', stacks = [];

    UI.component('stackMargin', {

        defaults: {
            'cls': 'uk-margin-small-top'
        },

        init: function() {

            var $this = this;

            this.columns = this.element.children();

            if (!this.columns.length) return;

            win.on(event, (function() {
                var fn = function() {
                    $this.process();
                };

                $(function() {
                    fn();
                    win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 150);
            })());

            $(document).on("uk-domready", function(e) {
                $this.columns  = $this.element.children();
                $this.process();
            });

            stacks.push(this);
        },

        process: function() {

            var $this = this;

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? firstvisible.offset().top : false;

            if (offset === false) return;

            this.columns.each(function() {

                var column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass($this.options.cls);
                    } else {
                        if (column.offset().top != offset) {
                            column.addClass($this.options.cls);
                            skip = true;
                        }
                    }
                }
            });

            return this;
        },

        revert: function() {
            this.columns.removeClass(this.options.cls);
            return this;
        }
    });

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-margin]").each(function() {
            var ele = $(this), obj;

            if (!ele.data("stackMargin")) {
                obj = UI.stackMargin(ele, UI.Utils.options(ele.attr("data-uk-margin")));
            }
        });
    });


    $(document).on("uk-check-display", function(e) {
        stacks.forEach(function(item) {
            if(item.element.is(":visible")) item.process();
        });
    });

})(jQuery, jQuery.UIkit);

//  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture;

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      touch.el.trigger('longTap');
      touch = {};
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }

  function cancelAll() {
    if (touchTimeout)   clearTimeout(touchTimeout);
    if (tapTimeout)     clearTimeout(tapTimeout);
    if (swipeTimeout)   clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }

  function isPrimaryTouch(event){
    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary;
  }

  $(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch;

    if ('MSGesture' in window) {
      gesture = new MSGesture();
      gesture.target = document.body;
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe');
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity);
        }
      })
      .on('touchstart MSPointerDown', function(e){

        if(e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = e.type == 'MSPointerDown' ? e : e.originalEvent.touches[0];

        now      = Date.now();
        delta    = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

        if(touchTimeout) clearTimeout(touchTimeout);

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);

        // adds the current touch contact for IE gesture recognition
        if (gesture && e.type == 'MSPointerDown') gesture.addPointer(e.originalEvent.pointerId);
      })
      .on('touchmove MSPointerMove', function(e){

        if(e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = e.type == 'MSPointerMove' ? e : e.originalEvent.touches[0];

        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      })
      .on('touchend MSPointerUp', function(e){

        if(e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

        cancelLongTap();

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe');
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            touch = {};
          }, 0);

        // normal tap
        } else if ('last' in touch) {

          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (isNaN(deltaX) || (deltaX < 30 && deltaY < 30)) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap');
              event.cancelTouch = cancelAll;
              touch.el.trigger(event);

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap');
                touch = {};
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null;
                  touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
            }, 0);
          } else {
            touch = {};
          }
          deltaX = deltaY = 0;
        }
      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel', cancelAll);

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll);
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return $(this).on(eventName, callback); };
  });
})(jQuery);

(function($, UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element = this.trigger("close");

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height": 0,
                    "opacity": 0,
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "margin-top": 0,
                    "margin-bottom": 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }

            function removeElement() {
                element.trigger("closed").remove();
            }
        }

    });

    // init code
    $(document).on("click.alert.uikit", "[data-uk-alert]", function(e) {

        var ele = $(this);

        if (!ele.data("alert")) {

            var alert = UI.alert(ele, UI.Utils.options(ele.data("uk-alert")));

            if ($(e.target).is(ele.data("alert").options.trigger)) {
                e.preventDefault();
                alert.close();
            }
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "target": ".uk-button"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(this).removeClass("uk-active").blur();
                $this.trigger("change", [$(this).addClass("uk-active")]);
            });

        },

        getSelected: function() {
            this.find(".uk-active");
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "target": ".uk-button"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.trigger("change", [$(this).toggleClass("uk-active").blur()]);
            });

        },

        getSelected: function() {
            this.find(".uk-active");
        }
    });


    UI.component('button', {

        defaults: {},

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change", [$element.blur().hasClass("uk-active")]);
            });

        },

        toggle: function() {
            this.element.toggleClass("uk-active");
        }
    });


    // init code
    $(document).on("click.buttonradio.uikit", "[data-uk-button-radio]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonRadio")) {
            var obj = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-uk-button-radio")));

            if ($(e.target).is(obj.options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.buttoncheckbox.uikit", "[data-uk-button-checkbox]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonCheckbox")) {

            var obj = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-uk-button-checkbox"))), target=$(e.target);

            if (target.is(obj.options.target)) {
                ele.trigger("change", [target.toggleClass("uk-active").blur()]);
            }
        }
    });

    $(document).on("click.button.uikit", "[data-uk-button]", function(e) {
        var ele = $(this);

        if (!ele.data("button")) {

            var obj = UI.button(ele, UI.Utils.options(ele.attr("data-uk-button")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var active = false, hoverIdle;

    UI.component('dropdown', {

        defaults: {
           'mode'       : 'hover',
           'remaintime' : 800,
           'justify'    : false,
           'boundary'   : $(window),
           'delay'      : 0
        },

        remainIdle: false,

        init: function() {

            var $this = this;

            this.dropdown = this.find(".uk-dropdown");

            this.centered  = this.dropdown.hasClass("uk-dropdown-center");
            this.justified = this.options.justify ? $(this.options.justify) : false;

            this.boundary  = $(this.options.boundary);
            this.flipped   = this.dropdown.hasClass('uk-dropdown-flip');

            if(!this.boundary.length) {
                this.boundary = $(window);
            }

            if (this.options.mode == "click" || UI.support.touch) {

                this.on("click", function(e) {

                    var $target = $(e.target);

                    if (!$target.parents(".uk-dropdown").length) {

                        if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                            e.preventDefault();
                        }

                        $target.blur();
                    }

                    if (!$this.element.hasClass("uk-open")) {

                        $this.show();

                    } else {

                        if ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length) {
                            $this.element.removeClass("uk-open");
                            active = false;
                        }
                    }
                });

            } else {

                this.on("mouseenter", function(e) {

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);

                }).on("mouseleave", function() {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    $this.remainIdle = setTimeout(function() {

                        $this.element.removeClass("uk-open");
                        $this.remainIdle = false;

                        if (active && active[0] == $this.element[0]) active = false;

                    }, $this.options.remaintime);

                }).on("click", function(e){

                    var $target = $(e.target);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                        e.preventDefault();
                    }

                    $this.show();
                });
            }
        },

        show: function(){

            if (active && active[0] != this.element[0]) {
                active.removeClass("uk-open");
            }

            if (hoverIdle) {
                clearTimeout(hoverIdle);
            }

            this.checkDimensions();
            this.element.addClass("uk-open");
            this.trigger('uk.dropdown.show', [this]);
            active = this.element;

            this.registerOuterClick();
        },

        registerOuterClick: function(){

            var $this = this;

            $(document).off("click.outer.dropdown");

            setTimeout(function() {
                $(document).on("click.outer.dropdown", function(e) {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    var $target = $(e.target);

                    if (active && active[0] == $this.element[0] && ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length)) {
                        active.removeClass("uk-open");
                        $(document).off("click.outer.dropdown");
                    }
                });
            }, 10);
        },

        checkDimensions: function() {

            if(!this.dropdown.length) return;

            if (this.justified && this.justified.length) {
                this.dropdown.css("min-width", "");
            }

            var $this     = this,
                dropdown  = this.dropdown.css("margin-" + $.UIkit.langdirection, ""),
                offset    = dropdown.show().offset(),
                width     = dropdown.outerWidth(),
                boundarywidth  = this.boundary.width(),
                boundaryoffset = this.boundary.offset() ? this.boundary.offset().left:0;

            // centered dropdown
            if (this.centered) {
                dropdown.css("margin-" + $.UIkit.langdirection, (parseFloat(width) / 2 - dropdown.parent().width() / 2) * -1);
                offset = dropdown.offset();

                // reset dropdown
                if ((width + offset.left) > boundarywidth || offset.left < 0) {
                    dropdown.css("margin-" + $.UIkit.langdirection, "");
                    offset = dropdown.offset();
                }
            }

            // justify dropdown
            if (this.justified && this.justified.length) {

                var jwidth = this.justified.outerWidth();

                dropdown.css("min-width", jwidth);

                if ($.UIkit.langdirection == 'right') {

                    var right1   = boundarywidth - (this.justified.offset().left + jwidth),
                        right2   = boundarywidth - (dropdown.offset().left + dropdown.outerWidth());

                    dropdown.css("margin-right", right1 - right2);

                } else {
                    dropdown.css("margin-left", this.justified.offset().left - offset.left);
                }

                offset = dropdown.offset();

            }

            if ((width + (offset.left-boundaryoffset)) > boundarywidth) {
                dropdown.addClass("uk-dropdown-flip");
                offset = dropdown.offset();
            }

            if ((offset.left-boundaryoffset) < 0) {

                dropdown.addClass("uk-dropdown-stack");

                if (dropdown.hasClass("uk-dropdown-flip")) {

                    if (!this.flipped) {
                        dropdown.removeClass("uk-dropdown-flip");
                        offset = dropdown.offset();
                        dropdown.addClass("uk-dropdown-flip");
                    }

                    setTimeout(function(){

                        if ((dropdown.offset().left-boundaryoffset) < 0 || !$this.flipped && (dropdown.outerWidth() + (offset.left-boundaryoffset)) < boundarywidth) {
                            dropdown.removeClass("uk-dropdown-flip");
                        }
                    }, 0);
                }

                this.trigger('uk.dropdown.stack', [this]);
            }

            dropdown.css("display", "");
        }

    });

    var triggerevent = UI.support.touch ? "click" : "mouseenter";

    // init code
    $(document).on(triggerevent+".dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {

            var dropdown = UI.dropdown(ele, UI.Utils.options(ele.data("uk-dropdown")));

            if (triggerevent=="click" || (triggerevent=="mouseenter" && dropdown.options.mode=="hover")) {
                dropdown.element.trigger(triggerevent);
            }

            if(dropdown.element.find('.uk-dropdown').length) {
                e.preventDefault();
            }
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange', grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            "target" : false,
            "row"    : true
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            win.on(event, (function() {
                var fn = function() {
                    $this.match();
                };

                $(function() {
                    fn();
                    win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 150);
            })());

            $(document).on("uk-domready", function(e) {
                $this.columns  = $this.element.children();
                $this.elements = $this.options.target ? $this.find($this.options.target) : $this.columns;
                $this.match();
            });

            grids.push(this);
        },

        match: function() {

            this.revert();

            var firstvisible = this.columns.filter(":visible:first");

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100 ? true : false,
                max     = 0,
                $this   = this;

            if (stacked) return;

            if(this.options.row) {

                this.element.width(); // force redraw

                setTimeout(function(){

                    var lastoffset = false, group = [];

                    $this.elements.each(function(i) {
                        var ele = $(this), offset = ele.offset().top;

                        if(offset != lastoffset && group.length) {

                            $this.matchHeights($(group));
                            group  = [];
                            offset = ele.offset().top;
                        }

                        group.push(ele);
                        lastoffset = offset;
                    });

                    if(group.length) {
                        $this.matchHeights($(group));
                    }

                }, 0);

            } else {

                this.matchHeights(this.elements);
            }

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        },

        matchHeights: function(elements){

            if(elements.length < 2) return;

            var max = 0;

            elements.each(function() {
                max = Math.max(max, $(this).outerHeight());
            }).each(function(i) {

                var element = $(this),
                    height  = max - (element.outerHeight() - element.height());

                element.css('min-height', height + 'px');
            });
        }
    });

    UI.component('gridMargin', {

        defaults: {
            "cls": "uk-grid-margin"
        },

        init: function() {

            var $this = this;

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });


    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this), obj;

            if (grid.is("[data-uk-grid-match]") && !grid.data("gridMatchHeight")) {
                obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("gridMargin")) {
                obj = UI.gridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
            }
        });
    });

    $(document).on("uk-check-display", function(e) {
        grids.forEach(function(item) {
            if(item.element.is(":visible")) item.match();
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI, $win) {

    "use strict";

    var active = false, $html = $('html'), body;

    UI.component('modal', {

        defaults: {
            keyboard: true,
            bgclose: true,
            minScrollHeight: 150
        },

        scrollable: false,
        transition: false,

        init: function() {

            if (!body) body = $('body');

            var $this = this;

            this.transition = UI.support.transition;
            this.dialog     = this.find(".uk-modal-dialog");

            this.on("click", ".uk-modal-close", function(e) {
                e.preventDefault();
                $this.hide();

            }).on("click", function(e) {

                var target = $(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }

            });

        },

        toggle: function() {
            return this[this.isActive() ? "hide" : "show"]();
        },

        show: function() {

            var $this = this;

            if (this.isActive()) return;
            if (active) active.hide(true);

            this.element.removeClass("uk-open").show();
            this.resize();

            active = this;
            $html.addClass("uk-modal-page").height(); // force browser engine redraw

            this.element.addClass("uk-open").trigger("uk.modal.show");

            $(document).trigger("uk-check-display");

            return this;
        },

        hide: function(force) {

            if (!this.isActive()) return;

            if (!force && UI.support.transition) {

                var $this = this;

                this.one(UI.support.transition.end, function() {
                    $this._hide();
                }).removeClass("uk-open");

            } else {

                this._hide();
            }

            return this;
        },

        resize: function() {

            var paddingdir = "padding-" + (UI.langdirection == 'left' ? "left":"right"),
                margindir  = "margin-" + (UI.langdirection == 'left' ? "left":"right"),
                bodywidth  = body.width();

            this.scrollbarwidth = window.innerWidth - bodywidth;

            $html.css(margindir, this.scrollbarwidth * -1);

            this.element.css(paddingdir, "");

            if (this.dialog.offset().left > this.scrollbarwidth) {
                this.element.css(paddingdir, this.scrollbarwidth - (this.element[0].scrollHeight==window.innerHeight ? 0:this.scrollbarwidth ));
            }

            this.updateScrollable();

        },

        updateScrollable: function() {

            // has scrollable?

            var scrollable = this.dialog.find('.uk-overflow-container:visible:first');

            if (scrollable) {

                scrollable.css("height", 0);

                var offset = Math.abs(parseInt(this.dialog.css("margin-top"), 10)),
                    dh     = this.dialog.outerHeight(),
                    wh     = window.innerHeight,
                    h      = wh - 2*(offset < 20 ? 20:offset) - dh;

                scrollable.css("height", h < this.options.minScrollHeight ? "":h);
            }
        },

        _hide: function() {

            this.element.hide().removeClass("uk-open");

            $html.removeClass("uk-modal-page").css("margin-" + (UI.langdirection == 'left' ? "left":"right"), "");

            if(active===this) active = false;

            this.trigger("uk.modal.hide");
        },

        isActive: function() {
            return (active == this);
        }

    });

    UI.component('modalTrigger', {

        init: function() {

            var $this = this;

            this.options = $.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.modal = UI.modal(this.options.target, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                $this.show();
            });

            //methods
            this.proxy(this.modal, "show hide isActive");
        }
    });

    UI.modal.dialog = function(content, options) {

        var modal = UI.modal($(UI.modal.dialog.template).appendTo("body"), options);

        modal.on("uk.modal.hide", function(){
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data("modalPersistParent"));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    UI.modal.dialog.template = '<div class="uk-modal"><div class="uk-modal-dialog"></div></div>';

    UI.modal.alert = function(content, options) {

        UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary uk-modal-close">Ok</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options)).show();
    };

    UI.modal.confirm = function(content, onconfirm, options) {

        onconfirm = $.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary js-modal-confirm">Ok</button> <button class="uk-button uk-modal-close">Cancel</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options));

        modal.element.find(".js-modal-confirm").on("click", function(){
            onconfirm();
            modal.hide();
        });

        modal.show();
    };

    // init code
    $(document).on("click.modal.uikit", "[data-uk-modal]", function(e) {

        var ele = $(this);

        if(ele.is("a")) {
            e.preventDefault();
        }

        if (!ele.data("modalTrigger")) {
            var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr("data-uk-modal")));
            modal.show();
        }

    });

    // close modal on esc button
    $(document).on('keydown.modal.uikit', function (e) {

        if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
            e.preventDefault();
            active.hide();
        }
    });

    $win.on("resize orientationchange", UI.Utils.debounce(function(){
        if(active) active.resize();
    }, 150));


    // helper functions
    function setContent(content, modal){

        if(!modal) return;

        if (typeof content === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : $(content);

            if(content.parent().length) {
                modal.persist = content;
                modal.persist.data("modalPersistParent", content.parent());
            }
        }else if (typeof content === 'string' || typeof content === 'number') {
                // just insert the data as innerHTML
                content = $('<div></div>').html(content);
        }else {
                // unsupported data type!
                content = $('<div></div>').html('$.UIkitt.modal Error: Unsupported data type: ' + typeof content);
        }

        content.appendTo(modal.element.find('.uk-modal-dialog'));

        return modal;
    }

})(jQuery, jQuery.UIkit, jQuery(window));

(function($, UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = $(window),
        $doc      = $(document),
        $html     = $('html'),
        Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var $body     = $('body'),
                winwidth  = $win.width(),
                bar       = element.find(".uk-offcanvas-bar:first"),
                rtl       = ($.UIkit.langdirection == "right"),
                flip      = bar.hasClass("uk-offcanvas-bar-flip") ? -1:1,
                dir       = flip * (rtl ? -1 : 1);

            scrollpos = {x: window.scrollX, y: window.scrollY};

            element.addClass("uk-active");

            $body.css({"width": window.innerWidth, "height": $win.height()}).addClass("uk-offcanvas-page");
            //$body.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("uk-offcanvas-bar-show");

            element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

                var target = $(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("uk-offcanvas-close")) {
                        if (target.hasClass("uk-offcanvas-bar")) return;
                        if (target.parents(".uk-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            $doc.on('keydown.ukoffcanvas', function(e) {
                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

        hide: function(force) {

            var $body = $('body'),
                panel = $(".uk-offcanvas.uk-active"),
                rtl   = ($.UIkit.langdirection == "right"),
                bar   = panel.find(".uk-offcanvas-bar:first");

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {

                $body.one($.UIkit.support.transition.end, function() {
                    $body.removeClass("uk-offcanvas-page").css({"width": "", "height": ""});
                    panel.removeClass("uk-active");
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                }).css((rtl ? "margin-right" : "margin-left"), "");

                setTimeout(function(){
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 0);

            } else {
                $body.removeClass("uk-offcanvas-page").css({"width": "", "height": ""});
                panel.removeClass("uk-active");
                bar.removeClass("uk-offcanvas-bar-show");
                $html.css('margin-top', '');
                window.scrollTo(scrollpos.x, scrollpos.y);
            }

            panel.off(".ukoffcanvas");
            $doc.off(".ukoffcanvas");
        }
    };

    UI.component('offcanvasTrigger', {

        init: function() {

            var $this = this;

            this.options = $.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                Offcanvas.show($this.options.target);
            });
        }
    });

    UI.offcanvas = Offcanvas;

    // init code
    $doc.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvasTrigger")) {
            var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-offcanvas")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            "toggle": ">li.uk-parent > a[href='#']",
            "lists": ">li.uk-parent > ul",
            "multiple": false
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                var ele = $(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.find(this.options.lists).each(function() {
                var $ele   = $(this),
                    parent = $ele.parent(),
                    active = parent.hasClass("uk-active");

                $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                parent.data("list-container", $ele.parent());

                if (active) $this.open(parent, true);
            });

        },

        open: function(li, noanimation) {

            var element = this.element, $li = $(li);

            if (!this.options.multiple) {

                element.children(".uk-open").not(li).each(function() {
                    if ($(this).data("list-container")) {
                        $(this).data("list-container").stop().animate({height: 0}, function() {
                            $(this).parent().removeClass("uk-open");
                        });
                    }
                });
            }

            $li.toggleClass("uk-open");

            if ($li.data("list-container")) {
                if (noanimation) {
                    $li.data('list-container').stop().height($li.hasClass("uk-open") ? "auto" : 0);
                } else {
                    $li.data('list-container').stop().animate({
                        height: ($li.hasClass("uk-open") ? getHeight($li.data('list-container').find('ul:first')) : 0)
                    });
                }
            }
        }
    });


    // helper

    function getHeight(ele) {
        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-nav]").each(function() {
            var nav = $(this);

            if (!nav.data("nav")) {
                var obj = UI.nav(nav, UI.Utils.options(nav.attr("data-uk-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI, $win) {

    "use strict";

    var $tooltip,   // tooltip container
        tooltipdelay;

    UI.component('tooltip', {

        defaults: {
            "offset": 5,
            "pos": "top",
            "animation": false,
            "delay": 0, // in miliseconds
            "src": function() { return this.attr("title"); }
        },

        tip: "",

        init: function() {

            var $this = this;

            if (!$tooltip) {
                $tooltip = $('<div class="uk-tooltip"></div>').appendTo("body");
            }

            this.on({
                "focus"     : function(e) { $this.show(); },
                "blur"      : function(e) { $this.hide(); },
                "mouseenter": function(e) { $this.show(); },
                "mouseleave": function(e) { $this.hide(); }
            });

            this.tip = typeof(this.options.src) === "function" ? this.options.src.call(this.element) : this.options.src;

            // disable title attribute
            this.element.attr("data-cached-title", this.element.attr("title")).attr("title", "");
        },

        show: function() {

            if (tooltipdelay)     clearTimeout(tooltipdelay);
            if (!this.tip.length) return;

            $tooltip.stop().css({"top": -2000, "visibility": "hidden"}).show();
            $tooltip.html('<div class="uk-tooltip-inner">' + this.tip + '</div>');

            var $this      = this,
                bodyoffset = $('body').offset(),
                pos        = $.extend({}, this.element.offset(), {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}),
                width      = $tooltip[0].offsetWidth,
                height     = $tooltip[0].offsetHeight,
                offset     = typeof(this.options.offset) === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position   = typeof(this.options.pos) === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tmppos     = position.split("-"),
                tcss       = {
                    "display": "none",
                    "visibility": "visible",
                    "top": (pos.top + pos.height + height),
                    "left": pos.left
                };

            // prevent strange position
            // when tooltip is in offcanvas etc.
            pos.left -= bodyoffset.left;
            pos.top  -= bodyoffset.top;

            if ((tmppos[0] == "left" || tmppos[0] == "right") && $.UIkit.langdirection == 'right') {
                tmppos[0] = tmppos[0] == "left" ? "right" : "left";
            }

            var variants =  {
                "bottom"  : {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2},
                "top"     : {top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2},
                "left"    : {top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset},
                "right"   : {top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset}
            };

            $.extend(tcss, variants[tmppos[0]]);

            if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);

            var boundary = this.checkBoundary(tcss.left, tcss.top, width, height);

            if(boundary) {

                switch(boundary) {
                    case "x":

                        if (tmppos.length == 2) {
                            position = tmppos[0]+"-"+(tcss.left < 0 ? "left": "right");
                        } else {
                            position = tcss.left < 0 ? "right": "left";
                        }

                        break;

                    case "y":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom": "top")+"-"+tmppos[1];
                        } else {
                            position = (tcss.top < 0 ? "bottom": "top");
                        }

                        break;

                    case "xy":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom": "top")+"-"+(tcss.left < 0 ? "left": "right");
                        } else {
                            position = tcss.left < 0 ? "right": "left";
                        }

                        break;

                }

                tmppos = position.split("-");

                $.extend(tcss, variants[tmppos[0]]);

                if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);
            }


            tcss.left -= $("body").position().left;

            tooltipdelay = setTimeout(function(){

                $tooltip.css(tcss).attr("class", "uk-tooltip uk-tooltip-" + position);

                if ($this.options.animation) {
                    $tooltip.css({opacity: 0, display: 'block'}).animate({opacity: 1}, parseInt($this.options.animation, 10) || 400);
                } else {
                    $tooltip.show();
                }

                tooltipdelay = false;
            }, parseInt(this.options.delay, 10) || 0);
        },

        hide: function() {
            if(this.element.is("input") && this.element[0]===document.activeElement) return;

            if(tooltipdelay) clearTimeout(tooltipdelay);

            $tooltip.stop();

            if (this.options.animation) {
                $tooltip.fadeOut(parseInt(this.options.animation, 10) || 400);
            } else {
                $tooltip.hide();
            }
        },

        content: function() {
            return this.tip;
        },

        checkBoundary: function(left, top, width, height) {

            var axis = "";

            if(left < 0 || ((left-$win.scrollLeft())+width) > window.innerWidth) {
               axis += "x";
            }

            if(top < 0 || ((top-$win.scrollTop())+height) > window.innerHeight) {
               axis += "y";
            }

            return axis;
        }
    });


    // init code
    $(document).on("mouseenter.tooltip.uikit focus.tooltip.uikit", "[data-uk-tooltip]", function(e) {
        var ele = $(this);

        if (!ele.data("tooltip")) {
            var obj = UI.tooltip(ele, UI.Utils.options(ele.attr("data-uk-tooltip")));
            ele.trigger("mouseenter");
        }
    });

})(jQuery, jQuery.UIkit, jQuery(window));

(function($, UI) {

    "use strict";

    UI.component('switcher', {

        defaults: {
            connect : false,
            toggle  : ">*",
            active  : 0
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = $(this.options.connect).find(".uk-active").removeClass(".uk-active").end();

                var toggles = this.find(this.options.toggle),
                    active   = toggles.filter(".uk-active");

                if (active.length) {
                    this.show(active);
                } else {
                    active = toggles.eq(this.options.active);
                    this.show(active.length ? active : toggles.eq(0));
                }
            }

        },

        show: function(tab) {

            tab = isNaN(tab) ? $(tab) : this.find(this.options.toggle).eq(tab);

            var active = tab;

            if (active.hasClass("uk-disabled")) return;

            this.find(this.options.toggle).filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                var index = this.find(this.options.toggle).index(active);

                this.connect.children().removeClass("uk-active").eq(index).addClass("uk-active");
            }

            this.trigger("uk.switcher.show", [active]);
            $(document).trigger("uk-check-display");
        }
    });


    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-switcher]").each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";


    UI.component('tab', {

        defaults: {
            connect: false,
            active: 0
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {
                e.preventDefault();
                $this.find($this.options.target).not(this).removeClass("uk-active").blur();
                $this.trigger("change", [$(this).addClass("uk-active")]);
            });


            if (this.options.connect) {
                this.connect = $(this.options.connect);
            }

            if (location.hash && location.hash.match(/^#[a-z0-9_-]+$/)) {
                var active = this.element.children().filter(window.location.hash);

                if (active.length) {
                    this.element.children().removeClass('uk-active').filter(active).addClass("uk-active");
                }
            }

            var mobiletab = $('<li class="uk-tab-responsive uk-active"><a href="javascript:void(0);"></a></li>'),
                caption   = mobiletab.find("a:first"),
                dropdown  = $('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>'),
                ul        = dropdown.find("ul");

            caption.html(this.find("li.uk-active:first").find("a").text());

            if (this.element.hasClass("uk-tab-bottom")) dropdown.addClass("uk-dropdown-up");
            if (this.element.hasClass("uk-tab-flip")) dropdown.addClass("uk-dropdown-flip");

            this.find("a").each(function(i) {

                var tab  = $(this).parent(),
                    item = $('<li><a href="javascript:void(0);">' + tab.text() + '</a></li>').on("click", function(e) {
                        $this.element.data("switcher").show(i);
                    });

                if (!$(this).parents(".uk-disabled:first").length) ul.append(item);
            });

            this.element.uk("switcher", {"toggle": ">li:not(.uk-tab-responsive)", "connect": this.options.connect, "active": this.options.active});

            mobiletab.append(dropdown).uk("dropdown", {"mode": "click"});

            this.element.append(mobiletab).data({
                "dropdown": mobiletab.data("dropdown"),
                "mobilecaption": caption
            }).on("uk.switcher.show", function(e, tab) {
                mobiletab.addClass("uk-active");
                caption.html(tab.find("a").text());
            });

        }
    });

    $(document).on("uk-domready", function(e) {

        $("[data-uk-tab]").each(function() {
            var tab = $(this);

            if (!tab.data("tab")) {
                var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-uk-tab")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var $win           = $(window),
        $doc           = $(document),
        scrollspies    = [],
        checkScrollSpy = function() {
            for(var i=0; i < scrollspies.length; i++) {
                UI.support.requestAnimationFrame.apply(window, [scrollspies[i].check]);
            }
        };

    UI.component('scrollspy', {

        defaults: {
            "cls"        : "uk-scrollspy-inview",
            "initcls"    : "uk-scrollspy-init-inview",
            "topoffset"  : 0,
            "leftoffset" : 0,
            "repeat"     : false,
            "delay"      : 0
        },

        init: function() {

            var $this = this, idle, inviewstate, initinview,
                fn = function(){

                    var inview = UI.Utils.isInView($this.element, $this.options);

                    if(inview && !inviewstate) {

                        if(idle) clearTimeout(idle);

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.trigger("uk.scrollspy.init");
                        }

                        idle = setTimeout(function(){

                            if(inview) {
                                $this.element.addClass("uk-scrollspy-inview").addClass($this.options.cls).width();
                            }
                        }, $this.options.delay);

                        inviewstate = true;
                        $this.trigger("uk.scrollspy.inview");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("uk-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.trigger("uk.scrollspy.outview");
                    }
                };

            fn();

            this.check = fn;
            scrollspies.push(this);
        }
    });


    var scrollspynavs = [],
        checkScrollSpyNavs = function() {
            for(var i=0; i < scrollspynavs.length; i++) {
                UI.support.requestAnimationFrame.apply(window, [scrollspynavs[i].check]);
            }
        };

    UI.component('scrollspynav', {

        defaults: {
            "cls"          : 'uk-active',
            "closest"      : false,
            "topoffset"    : 0,
            "leftoffset"   : 0,
            "smoothscroll" : false
        },

        init: function() {

            var ids     = [],
                links   = this.find("a[href^='#']").each(function(){ ids.push($(this).attr("href")); }),
                targets = $(ids.join(","));

            var $this = this, inviews, fn = function(){

                inviews = [];

                for(var i=0 ; i < targets.length ; i++) {
                    if(UI.Utils.isInView(targets.eq(i), $this.options)) {
                        inviews.push(targets.eq(i));
                    }
                }

                if(inviews.length) {

                    var scrollTop = $win.scrollTop(),
                        target = (function(){
                            for(var i=0; i< inviews.length;i++){
                                if(inviews[i].offset().top >= scrollTop){
                                    return inviews[i];
                                }
                            }
                        })();

                    if(!target) return;

                    if($this.options.closest) {
                        links.closest($this.options.closest).removeClass($this.options.cls).end().filter("a[href='#"+target.attr("id")+"']").closest($this.options.closest).addClass($this.options.cls);
                    } else {
                        links.removeClass($this.options.cls).filter("a[href='#"+target.attr("id")+"']").addClass($this.options.cls);
                    }
                }
            };

            if(this.options.smoothscroll && UI["smoothScroll"]) {
                links.each(function(){
                    UI.smoothScroll(this, $this.options.smoothscroll);
                });
            }

            fn();

            this.element.data("scrollspynav", this);

            this.check = fn;
            scrollspynavs.push(this);

        }
    });


    var fnCheck = function(){
        checkScrollSpy();
        checkScrollSpyNavs();
    };

    // listen to scroll and resize
    $doc.on("uk-scroll", fnCheck);
    $win.on("resize orientationchange", UI.Utils.debounce(fnCheck, 50));

    // init code
    $doc.on("uk-domready", function(e) {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
            }
        });

        $("[data-uk-scrollspy-nav]").each(function() {

            var element = $(this);

            if (!element.data("scrollspynav")) {
                var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('smoothScroll', {

        defaults: {
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0,
            complete: function(){}
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                // get / set parameters
                var ele       = ($(this.hash).length ? $(this.hash) : $("body")),
                    target    = ele.offset().top - $this.options.offset,
                    docheight = $(document).height(),
                    winheight = $(window).height(),
                    eleheight = ele.outerHeight();

                if ((target + winheight) > docheight) {
                    target = docheight - winheight;
                }

                // animate to target, fire callback when done
                $("html,body").stop().animate({scrollTop: target}, $this.options.duration, $this.options.transition).promise().done($this.options.complete);

                // cancel default click action
                return false;
            });

        }
    });

    if (!$.easing['easeOutExpo']) {
        $.easing['easeOutExpo'] = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }

    // init code
    $(document).on("click.smooth-scroll.uikit", "[data-uk-smooth-scroll]", function(e) {
        var ele = $(this);

        if (!ele.data("smoothScroll")) {
            var obj = UI.smoothScroll(ele, UI.Utils.options(ele.attr("data-uk-smooth-scroll")));
            ele.trigger("click");
        }

        return false;
    });

})(jQuery, jQuery.UIkit);


(function(global, $, UI){


    UI.component('toggle', {

        defaults: {
            target: false,
            cls: 'uk-hidden'
        },

        init: function() {

            var $this = this;

            this.totoggle = this.options.target ? $(this.options.target):[];

            this.on("click", function(e) {
                if ($this.element.is('a[href="#"]')) e.preventDefault();
                $this.toggle();
            });
        },

        toggle: function() {

            if(!this.totoggle.length) return;

            this.totoggle.toggleClass(this.options.cls);

            if(this.options.cls == 'uk-hidden') {
                $(document).trigger("uk-check-display");
            }
        }
    });

    $(document).on("uk-domready", function(e) {

        $("[data-uk-toggle]").each(function() {
            var ele = $(this);

            if (!ele.data("toggle")) {
               var obj = UI.toggle(ele, UI.Utils.options(ele.attr("data-uk-toggle")));
            }
        });
    });

})(this, jQuery, jQuery.UIkit);

/*! UIkit 2.8.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-datepicker", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    // Datepicker

    var active = false, dropdown, moment;

    UI.component('datepicker', {

        defaults: {
            weekstart: 1,
            i18n: {
                months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                weekdays      : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            },
            format: "DD.MM.YYYY",
            offsettop: 5,
            maxDate: false,
            minDate: false,
            template: function(data, opts) {

                var content = '', maxDate, minDate;

                if (opts.maxDate!==false){
                    maxDate = isNaN(opts.maxDate) ? moment(opts.maxDate, opts.format) : moment().add('days', opts.maxDate);
                }

                if (opts.minDate!==false){
                    minDate = isNaN(opts.minDate) ? moment(opts.minDate, opts.format) : moment().add('days',opts.minDate-1);
                }

                content += '<div class="uk-datepicker-nav">';
                content += '<a href="" class="uk-datepicker-previous"></a>';
                content += '<a href="" class="uk-datepicker-next"></a>';

                if (UI.formSelect) {

                    var i, currentyear = (new Date()).getFullYear(), options = [], months, years, minYear, maxYear;

                    for (i=0;i<opts.i18n.months.length;i++) {
                        if(i==data.month) {
                            options.push('<option value="'+i+'" selected>'+opts.i18n.months[i]+'</option>');
                        } else {
                            options.push('<option value="'+i+'">'+opts.i18n.months[i]+'</option>');
                        }
                    }

                    months = '<span class="uk-form-select">'+ opts.i18n.months[data.month] + '<select class="update-picker-month">'+options.join('')+'</select></span>';

                    // --

                    options = [];

                    minYear = minDate ? minDate.year() : currentyear - 50;
                    maxYear = maxDate ? maxDate.year() : currentyear + 20;

                    for (i=minYear;i<=maxYear;i++) {
                        if (i == data.year) {
                            options.push('<option value="'+i+'" selected>'+i+'</option>');
                        } else {
                            options.push('<option value="'+i+'">'+i+'</option>');
                        }
                    }

                    years  = '<span class="uk-form-select">'+ data.year + '<select class="update-picker-year">'+options.join('')+'</select></span>';

                    content += '<div class="uk-datepicker-heading">'+ months + ' ' + years +'</div>';

                } else {
                    content += '<div class="uk-datepicker-heading">'+ opts.i18n.months[data.month] +' '+ data.year+'</div>';
                }

                content += '</div>';

                content += '<table class="uk-datepicker-table">';
                content += '<thead>';
                for(var i = 0; i < data.weekdays.length; i++) {
                    if (data.weekdays[i]) {
                        content += '<th>'+data.weekdays[i]+'</th>';
                    }
                }
                content += '</thead>';

                content += '<tbody>';
                for(var i = 0; i < data.days.length; i++) {
                    if (data.days[i] && data.days[i].length){
                        content += '<tr>';
                        for(var d = 0; d < data.days[i].length; d++) {
                            if (data.days[i][d]) {
                                var day = data.days[i][d],
                                    cls = [];

                                if(!day.inmonth) cls.push("uk-datepicker-table-muted");
                                if(day.selected) cls.push("uk-active");

                                if (maxDate && day.day > maxDate) cls.push('uk-datepicker-date-disabled uk-datepicker-table-muted');
                                if (minDate && minDate > day.day) cls.push('uk-datepicker-date-disabled uk-datepicker-table-muted');

                                content += '<td><a href="" class="'+cls.join(" ")+'" data-date="'+day.day.format()+'">'+day.day.format("D")+'</a></td>';
                            }
                        }
                        content += '</tr>';
                    }
                }
                content += '</tbody>';

                content += '</table>';

                return content;
            }
        },

        init: function() {

            var $this = this;

            this.current  = this.element.val() ? moment(this.element.val(), this.options.format) : moment();

            this.on("click", function(){
                if(active!==$this) $this.pick(this.value);
            }).on("change", function(){

                if($this.element.val() && !moment($this.element.val(), $this.options.format).isValid()) {
                   $this.element.val(moment().format($this.options.format));
                }

            });

            // init dropdown
            if (!dropdown) {

                dropdown = $('<div class="uk-dropdown uk-datepicker"></div>');

                dropdown.on("click", ".uk-datepicker-next, .uk-datepicker-previous, [data-date]", function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    var ele = $(this);

                    if (ele.hasClass('uk-datepicker-date-disabled')) return false;

                    if(ele.is('[data-date]')) {
                        active.element.val(moment(ele.data("date")).format(active.options.format)).trigger("change");
                        dropdown.hide();
                        active = false;
                    } else {
                       active.add("months", 1 * (ele.hasClass("uk-datepicker-next") ? 1:-1));
                    }
                });

                dropdown.on('change', '.update-picker-month, .update-picker-year', function(){

                    var select = $(this);
                    active[select.is('.update-picker-year') ? 'setYear':'setMonth'](Number(select.val()));
                });

                dropdown.appendTo("body");
            }
        },

        pick: function(initdate) {

            var offset = this.element.offset(),
                css    = {"top": offset.top + this.element.outerHeight() + this.options.offsettop, "left": offset.left, "right":""};

            this.current  = initdate ? moment(initdate, this.options.format):moment();
            this.initdate = this.current.format("YYYY-MM-DD");

            this.update();

            if (this.options.rtl) {
                css.right = window.innerWidth - (css.left + this.element.outerWidth());
                css.left  = "";
            }

            dropdown.css(css).show();

            active = this;
        },

        add: function(unit, value) {
            this.current.add(unit, value);
            this.update();
        },

        setMonth: function(month) {
            this.current.month(month);
            this.update();
        },

        setYear: function(year) {
            this.current.year(year);
            this.update();
        },

        update: function() {

            var data = this.getRows(this.current.year(), this.current.month()),
                tpl  = this.options.template(data, this.options);

            dropdown.html(tpl);
        },

        getRows: function(year, month) {

            var opts   = this.options,
                now    = moment().format('YYYY-MM-DD'),
                days   = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month],
                before = new Date(year, month, 1).getDay(),
                data   = {"month":month, "year":year,"weekdays":[],"days":[]},
                row    = [];

            data.weekdays = (function(){

                for (var i=0, arr=[]; i < 7; i++) {

                    var day = i + (opts.weekstart || 0);

                    while (day >= 7) {
                        day -= 7;
                    }

                    arr.push(opts.i18n.weekdays[day]);
                }

                return arr;
            })();

            if (opts.weekstart && opts.weekstart > 0) {
                before -= opts.weekstart;
                if (before < 0) {
                    before += 7;
                }
            }

            var cells = days + before, after = cells;

            while(after > 7) { after -= 7; }

            cells += 7 - after;

            var day, isDisabled, isSelected, isToday, isInMonth;

            for (var i = 0, r = 0; i < cells; i++) {

                day        = new Date(year, month, 1 + (i - before));
                isDisabled = (opts.mindate && day < opts.mindate) || (opts.maxdate && day > opts.maxdate);
                isInMonth  = !(i < before || i >= (days + before));

                day = moment(day);

                isSelected = this.initdate == day.format("YYYY-MM-DD");
                isToday    = now == day.format("YYYY-MM-DD");

                row.push({"selected": isSelected, "today": isToday, "disabled": isDisabled, "day":day, "inmonth":isInMonth});

                if (++r === 7) {
                    data.days.push(row);
                    row = [];
                    r = 0;
                }
            }

            return data;
        }
    });


    // init code
    $(document).on("focus.datepicker.uikit", "[data-uk-datepicker]", function(e) {

        var ele = $(this);
        if (!ele.data("datepicker")) {
            e.preventDefault();
            var obj = UI.datepicker(ele, UI.Utils.options(ele.attr("data-uk-datepicker")));
            ele.trigger("focus");
        }
    });

    $(document).on("click.datepicker.uikit", function(e) {

        var target = $(e.target);

        if (active && target[0] != dropdown[0] && !target.data("datepicker") && !target.parents(".uk-datepicker:first").length) {
            dropdown.hide();
            active = false;
        }
    });

    //! moment.js
    //! version : 2.5.1
    //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
    //! license : MIT
    //! momentjs.com

    moment = (function(B){function G(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function Z(a,b){return function(c){return l(a.call(this,c),b)}}function ta(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function $(){}function H(a){aa(a);v(this,a)}function I(a){a=ba(a);var b=a.year||0,c=a.month||0,d=a.week||0,f=a.day||0;this._milliseconds=+(a.millisecond||0)+1E3*(a.second||0)+6E4*(a.minute||
    0)+36E5*(a.hour||0);this._days=+f+7*d;this._months=+c+12*b;this._data={};this._bubble()}function v(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);b.hasOwnProperty("toString")&&(a.toString=b.toString);b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf);return a}function w(a){return 0>a?Math.ceil(a):Math.floor(a)}function l(a,b,c){for(var d=""+Math.abs(a);d.length<b;)d="0"+d;return(0<=a?c?"+":"":"-")+d}function J(a,b,c,d){var f=b._milliseconds,g=b._days;b=b._months;var m,h;f&&a._d.setTime(+a._d+
    f*c);if(g||b)m=a.minute(),h=a.hour();g&&a.date(a.date()+g*c);b&&a.month(a.month()+b*c);f&&!d&&e.updateOffset(a,g||b);if(g||b)a.minute(m),a.hour(h)}function K(a){return"[object Array]"===Object.prototype.toString.call(a)}function ca(a,b,c){var d=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0,e;for(e=0;e<d;e++)(c&&a[e]!==b[e]||!c&&h(a[e])!==h(b[e]))&&g++;return g+f}function n(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=ua[a]||va[b]||b}return a}function ba(a){var b={},c,d;for(d in a)a.hasOwnProperty(d)&&
    (c=n(d))&&(b[c]=a[d]);return b}function wa(a){var b,c;if(0===a.indexOf("week"))b=7,c="day";else if(0===a.indexOf("month"))b=12,c="month";else return;e[a]=function(d,f){var g,m,h=e.fn._lang[a],k=[];"number"===typeof d&&(f=d,d=B);m=function(a){a=e().utc().set(c,a);return h.call(e.fn._lang,a,d||"")};if(null!=f)return m(f);for(g=0;g<b;g++)k.push(m(g));return k}}function h(a){a=+a;var b=0;0!==a&&isFinite(a)&&(b=0<=a?Math.floor(a):Math.ceil(a));return b}function L(a,b){return(new Date(Date.UTC(a,b+1,0))).getUTCDate()}
    function da(a,b,c){return C(e([a,11,31+b-c]),b,c).week}function M(a){return 0===a%4&&0!==a%100||0===a%400}function aa(a){var b;a._a&&-2===a._pf.overflow&&(b=0>a._a[x]||11<a._a[x]?x:1>a._a[q]||a._a[q]>L(a._a[r],a._a[x])?q:0>a._a[p]||23<a._a[p]?p:0>a._a[y]||59<a._a[y]?y:0>a._a[D]||59<a._a[D]?D:0>a._a[E]||999<a._a[E]?E:-1,a._pf._overflowDayOfYear&&(b<r||b>q)&&(b=q),a._pf.overflow=b)}function ea(a){null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&0>a._pf.overflow&&!a._pf.empty&&!a._pf.invalidMonth&&
    !a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length));return a._isValid}function N(a){return a?a.toLowerCase().replace("_","-"):a}function O(a,b){return b._isUTC?e(a).zone(b._offset||0):e(a).local()}function s(a){var b=0,c,d,f,g,m=function(a){if(!z[a]&&xa)try{require("./lang/"+a)}catch(b){}return z[a]};if(!a)return e.fn._lang;if(!K(a)){if(d=m(a))return d;a=[a]}for(;b<a.length;){g=N(a[b]).split("-");
    c=g.length;for(f=(f=N(a[b+1]))?f.split("-"):null;0<c;){if(d=m(g.slice(0,c).join("-")))return d;if(f&&f.length>=c&&ca(g,f,!0)>=c-1)break;c--}b++}return e.fn._lang}function ya(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function za(a){var b=a.match(fa),c,d;c=0;for(d=b.length;c<d;c++)b[c]=u[b[c]]?u[b[c]]:ya(b[c]);return function(f){var g="";for(c=0;c<d;c++)g+=b[c]instanceof Function?b[c].call(f,a):b[c];return g}}function P(a,b){if(!a.isValid())return a.lang().invalidDate();
    b=ga(b,a.lang());Q[b]||(Q[b]=za(b));return Q[b](a)}function ga(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(F.lastIndex=0;0<=d&&F.test(a);)a=a.replace(F,c),F.lastIndex=0,d-=1;return a}function Aa(a,b){var c=b._strict;switch(a){case "DDDD":return ha;case "YYYY":case "GGGG":case "gggg":return c?Ba:Ca;case "Y":case "G":case "g":return Da;case "YYYYYY":case "YYYYY":case "GGGGG":case "ggggg":return c?Ea:Fa;case "S":if(c)return Ga;case "SS":if(c)return ia;case "SSS":if(c)return ha;case "DDD":return Ha;
    case "MMM":case "MMMM":case "dd":case "ddd":case "dddd":return Ia;case "a":case "A":return s(b._l)._meridiemParse;case "X":return Ja;case "Z":case "ZZ":return R;case "T":return Ka;case "SSSS":return La;case "MM":case "DD":case "YY":case "GG":case "gg":case "HH":case "hh":case "mm":case "ss":case "ww":case "WW":return c?ia:ja;case "M":case "D":case "d":case "H":case "h":case "m":case "s":case "w":case "W":case "e":case "E":return ja;case "Do":return Ma;default:var c=RegExp,d;d=Na(a.replace("\\","")).replace(/[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&");return new c(d)}}function ka(a){a=(a||"").match(R)||[];a=((a[a.length-1]||[])+"").match(Oa)||["-",0,0];var b=+(60*a[1])+h(a[2]);return"+"===a[0]?-b:b}function S(a){var b,c=[],d,f,g,m,k;if(!a._d){d=Pa(a);a._w&&null==a._a[q]&&null==a._a[x]&&(b=function(b){var c=parseInt(b,10);return b?3>b.length?68<c?1900+c:2E3+c:c:null==a._a[r]?e().weekYear():a._a[r]},f=a._w,null!=f.GG||null!=f.W||null!=f.E?b=la(b(f.GG),f.W||1,f.E,4,1):(g=s(a._l),m=null!=f.d?ma(f.d,g):null!=f.e?parseInt(f.e,10)+g._week.dow:
    0,k=parseInt(f.w,10)||1,null!=f.d&&m<g._week.dow&&k++,b=la(b(f.gg),k,m,g._week.doy,g._week.dow)),a._a[r]=b.year,a._dayOfYear=b.dayOfYear);a._dayOfYear&&(b=null==a._a[r]?d[r]:a._a[r],a._dayOfYear>(M(b)?366:365)&&(a._pf._overflowDayOfYear=!0),b=T(b,0,a._dayOfYear),a._a[x]=b.getUTCMonth(),a._a[q]=b.getUTCDate());for(b=0;3>b&&null==a._a[b];++b)a._a[b]=c[b]=d[b];for(;7>b;b++)a._a[b]=c[b]=null==a._a[b]?2===b?1:0:a._a[b];c[p]+=h((a._tzm||0)/60);c[y]+=h((a._tzm||0)%60);a._d=(a._useUTC?T:Qa).apply(null,c)}}
    function Pa(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function U(a){a._a=[];a._pf.empty=!0;var b=s(a._l),c=""+a._i,d,f,g,e,k=c.length,l=0;f=ga(a._f,b).match(fa)||[];for(b=0;b<f.length;b++){g=f[b];if(d=(c.match(Aa(g,a))||[])[0])e=c.substr(0,c.indexOf(d)),0<e.length&&a._pf.unusedInput.push(e),c=c.slice(c.indexOf(d)+d.length),l+=d.length;if(u[g]){d?a._pf.empty=!1:a._pf.unusedTokens.push(g);e=a;var n=void 0,t=e._a;
    switch(g){case "M":case "MM":null!=d&&(t[x]=h(d)-1);break;case "MMM":case "MMMM":n=s(e._l).monthsParse(d);null!=n?t[x]=n:e._pf.invalidMonth=d;break;case "D":case "DD":null!=d&&(t[q]=h(d));break;case "Do":null!=d&&(t[q]=h(parseInt(d,10)));break;case "DDD":case "DDDD":null!=d&&(e._dayOfYear=h(d));break;case "YY":t[r]=h(d)+(68<h(d)?1900:2E3);break;case "YYYY":case "YYYYY":case "YYYYYY":t[r]=h(d);break;case "a":case "A":e._isPm=s(e._l).isPM(d);break;case "H":case "HH":case "h":case "hh":t[p]=h(d);break;
    case "m":case "mm":t[y]=h(d);break;case "s":case "ss":t[D]=h(d);break;case "S":case "SS":case "SSS":case "SSSS":t[E]=h(1E3*("0."+d));break;case "X":e._d=new Date(1E3*parseFloat(d));break;case "Z":case "ZZ":e._useUTC=!0;e._tzm=ka(d);break;case "w":case "ww":case "W":case "WW":case "d":case "dd":case "ddd":case "dddd":case "e":case "E":g=g.substr(0,1);case "gg":case "gggg":case "GG":case "GGGG":case "GGGGG":g=g.substr(0,2),d&&(e._w=e._w||{},e._w[g]=d)}}else a._strict&&!d&&a._pf.unusedTokens.push(g)}a._pf.charsLeftOver=
    k-l;0<c.length&&a._pf.unusedInput.push(c);a._isPm&&12>a._a[p]&&(a._a[p]+=12);!1===a._isPm&&12===a._a[p]&&(a._a[p]=0);S(a);aa(a)}function Na(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,c,d,f,e){return c||d||f||e})}function Qa(a,b,c,d,f,e,h){b=new Date(a,b,c,d,f,e,h);1970>a&&b.setFullYear(a);return b}function T(a){var b=new Date(Date.UTC.apply(null,arguments));1970>a&&b.setUTCFullYear(a);return b}function ma(a,b){if("string"===typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!==
    typeof a)return null}else a=parseInt(a,10);return a}function Ra(a,b,c,d,f){return f.relativeTime(b||1,!!c,a,d)}function C(a,b,c){b=c-b;c-=a.day();c>b&&(c-=7);c<b-7&&(c+=7);a=e(a).add("d",c);return{week:Math.ceil(a.dayOfYear()/7),year:a.year()}}function la(a,b,c,d,f){var e=T(a,0,1).getUTCDay();b=7*(b-1)+((null!=c?c:f)-f)+(f-e+(e>d?7:0)-(e<f?7:0))+1;return{year:0<b?a:a-1,dayOfYear:0<b?b:(M(a-1)?366:365)+b}}function na(a){var b=a._i,c=a._f;if(null===b)return e.invalid({nullInput:!0});"string"===typeof b&&
    (a._i=b=s().preparse(b));if(e.isMoment(b)){a=b;var d={},f;for(f in a)a.hasOwnProperty(f)&&Sa.hasOwnProperty(f)&&(d[f]=a[f]);a=d;a._d=new Date(+b._d)}else if(c)if(K(c)){var b=a,g,h;if(0===b._f.length)b._pf.invalidFormat=!0,b._d=new Date(NaN);else{for(f=0;f<b._f.length;f++)if(c=0,d=v({},b),d._pf=G(),d._f=b._f[f],U(d),ea(d)&&(c+=d._pf.charsLeftOver,c+=10*d._pf.unusedTokens.length,d._pf.score=c,null==h||c<h))h=c,g=d;v(b,g||d)}}else U(a);else if(d=a,g=d._i,h=Ta.exec(g),g===B)d._d=new Date;else if(h)d._d=
    new Date(+h[1]);else if("string"===typeof g)if(b=d._i,f=Ua.exec(b)){d._pf.iso=!0;g=0;for(h=V.length;g<h;g++)if(V[g][1].exec(b)){d._f=V[g][0]+(f[6]||" ");break}g=0;for(h=W.length;g<h;g++)if(W[g][1].exec(b)){d._f+=W[g][0];break}b.match(R)&&(d._f+="Z");U(d)}else d._d=new Date(b);else K(g)?(d._a=g.slice(0),S(d)):"[object Date]"===Object.prototype.toString.call(g)||g instanceof Date?d._d=new Date(+g):"object"===typeof g?d._d||(g=ba(d._i),d._a=[g.year,g.month,g.day,g.hour,g.minute,g.second,g.millisecond],
    S(d)):d._d=new Date(g);return new H(a)}function oa(a,b){var c="date"===b||"month"===b||"year"===b;e.fn[a]=e.fn[a+"s"]=function(a,f){var g=this._isUTC?"UTC":"";null==f&&(f=c);return null!=a?(this._d["set"+g+b](a),e.updateOffset(this,f),this):this._d["get"+g+b]()}}function Va(a){e.duration.fn[a]=function(){return this._data[a]}}function pa(a,b){e.duration.fn["as"+a]=function(){return+this/b}}for(var e,A=Math.round,k,r=0,x=1,q=2,p=3,y=4,D=5,E=6,z={},Sa={_isAMomentObject:null,_i:null,_f:null,_l:null,
    _strict:null,_isUTC:null,_offset:null,_pf:null,_lang:null},xa="undefined"!==typeof module&&module.exports&&"undefined"!==typeof require,Ta=/^\/?Date\((\-?\d+)/i,Wa=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Xa=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,fa=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
    F=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,ja=/\d\d?/,Ha=/\d{1,3}/,Ca=/\d{1,4}/,Fa=/[+\-]?\d{1,6}/,La=/\d+/,Ia=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,R=/Z|[\+\-]\d\d:?\d\d/gi,Ka=/T/i,Ja=/[\+\-]?\d+(\.\d{1,3})?/,Ma=/\d{1,2}/,Ga=/\d/,ia=/\d\d/,ha=/\d{3}/,Ba=/\d{4}/,Ea=/[+-]?\d{6}/,Da=/[+-]?\d+/,Ua=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    V=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],W=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],Oa=/([\+\-]|\d\d)/gi,X=["Date","Hours","Minutes","Seconds","Milliseconds"],Y={Milliseconds:1,Seconds:1E3,Minutes:6E4,Hours:36E5,Days:864E5,Months:2592E6,Years:31536E6},ua={ms:"millisecond",s:"second",
    m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},va={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},Q={},qa="DDD w W M D d".split(" "),ra="MDHhmswW".split(""),u={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},
    DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return l(this.year()%100,2)},YYYY:function(){return l(this.year(),4)},YYYYY:function(){return l(this.year(),5)},YYYYYY:function(){var a=this.year();return(0<=a?"+":"-")+l(Math.abs(a),
    6)},gg:function(){return l(this.weekYear()%100,2)},gggg:function(){return l(this.weekYear(),4)},ggggg:function(){return l(this.weekYear(),5)},GG:function(){return l(this.isoWeekYear()%100,2)},GGGG:function(){return l(this.isoWeekYear(),4)},GGGGG:function(){return l(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),
    !1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return h(this.milliseconds()/100)},SS:function(){return l(h(this.milliseconds()/10),2)},SSS:function(){return l(this.milliseconds(),3)},SSSS:function(){return l(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";0>a&&(a=-a,b="-");return b+l(h(a/60),2)+":"+l(h(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";0>a&&(a=-a,b="-");
    return b+l(h(a/60),2)+l(h(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},sa=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];qa.length;)k=qa.pop(),u[k+"o"]=ta(u[k],k);for(;ra.length;)k=ra.pop(),u[k+k]=Z(u[k],2);u.DDDD=Z(u.DDD,3);v($.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"===typeof b?this[c]=b:this["_"+c]=b},_months:"January February March April May June July August September October November December".split(" "),
    months:function(a){return this._months[a.month()]},_monthsShort:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c;this._monthsParse||(this._monthsParse=[]);for(b=0;12>b;b++)if(this._monthsParse[b]||(c=e.utc([2E3,b]),c="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=RegExp(c.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun Mon Tue Wed Thu Fri Sat".split(" "),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su Mo Tu We Th Fr Sa".split(" "),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c;this._weekdaysParse||(this._weekdaysParse=[]);for(b=0;7>b;b++)if(this._weekdaysParse[b]||(c=e([2E3,1]).day(b),c="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,
    ""),this._weekdaysParse[b]=RegExp(c.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b);return b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},
    _meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return 11<a?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"===typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",
    y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var f=this._relativeTime[c];return"function"===typeof f?f(a,b,c,d):f.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[0<a?"future":"past"];return"function"===typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return C(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",
    invalidDate:function(){return this._invalidDate}});e=function(a,b,c,d){var f;"boolean"===typeof c&&(d=c,c=B);f={_isAMomentObject:!0};f._i=a;f._f=b;f._l=c;f._strict=d;f._isUTC=!1;f._pf=G();return na(f)};e.utc=function(a,b,c,d){var f;"boolean"===typeof c&&(d=c,c=B);f={_isAMomentObject:!0,_useUTC:!0,_isUTC:!0};f._l=c;f._i=a;f._f=b;f._strict=d;f._pf=G();return na(f).utc()};e.unix=function(a){return e(1E3*a)};e.duration=function(a,b){var c=a,d=null,f;if(e.isDuration(a))c={ms:a._milliseconds,d:a._days,
    M:a._months};else if("number"===typeof a)c={},b?c[b]=a:c.milliseconds=a;else if(d=Wa.exec(a))f="-"===d[1]?-1:1,c={y:0,d:h(d[q])*f,h:h(d[p])*f,m:h(d[y])*f,s:h(d[D])*f,ms:h(d[E])*f};else if(d=Xa.exec(a))f="-"===d[1]?-1:1,c=function(a){a=a&&parseFloat(a.replace(",","."));return(isNaN(a)?0:a)*f},c={y:c(d[2]),M:c(d[3]),d:c(d[4]),h:c(d[5]),m:c(d[6]),s:c(d[7]),w:c(d[8])};d=new I(c);e.isDuration(a)&&a.hasOwnProperty("_lang")&&(d._lang=a._lang);return d};e.version="2.5.1";e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";
    e.updateOffset=function(){};e.lang=function(a,b){if(!a)return e.fn._lang._abbr;if(b){var c=N(a);b.abbr=c;z[c]||(z[c]=new $);z[c].set(b)}else null===b?(delete z[a],a="en"):z[a]||s(a);return(e.duration.fn._lang=e.fn._lang=s(a))._abbr};e.langData=function(a){a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr);return s(a)};e.isMoment=function(a){return a instanceof H||null!=a&&a.hasOwnProperty("_isAMomentObject")};e.isDuration=function(a){return a instanceof I};for(k=sa.length-1;0<=k;--k)wa(sa[k]);e.normalizeUnits=
    function(a){return n(a)};e.invalid=function(a){var b=e.utc(NaN);null!=a?v(b._pf,a):b._pf.userInvalidated=!0;return b};e.parseZone=function(){return e.apply(null,arguments).parseZone()};v(e.fn=H.prototype,{clone:function(){return e(this)},valueOf:function(){return+this._d+6E4*(this._offset||0)},unix:function(){return Math.floor(+this/1E3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=
    e(this).utc();return 0<a.year()&&9999>=a.year()?P(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):P(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){return[this.year(),this.month(),this.date(),this.hours(),this.minutes(),this.seconds(),this.milliseconds()]},isValid:function(){return ea(this)},isDSTShifted:function(){return this._a?this.isValid()&&0<ca(this._a,(this._isUTC?e.utc(this._a):e(this._a)).toArray()):!1},parsingFlags:function(){return v({},this._pf)},invalidAt:function(){return this._pf.overflow},
    utc:function(){return this.zone(0)},local:function(){this.zone(0);this._isUTC=!1;return this},format:function(a){a=P(this,a||e.defaultFormat);return this.lang().postformat(a)},add:function(a,b){var c;c="string"===typeof a?e.duration(+b,a):e.duration(a,b);J(this,c,1);return this},subtract:function(a,b){var c;c="string"===typeof a?e.duration(+b,a):e.duration(a,b);J(this,c,-1);return this},diff:function(a,b,c){a=O(a,this);var d=6E4*(this.zone()-a.zone()),f;b=n(b);"year"===b||"month"===b?(f=432E5*(this.daysInMonth()+
    a.daysInMonth()),d=12*(this.year()-a.year())+(this.month()-a.month()),d+=(this-e(this).startOf("month")-(a-e(a).startOf("month")))/f,d-=6E4*(this.zone()-e(this).startOf("month").zone()-(a.zone()-e(a).startOf("month").zone()))/f,"year"===b&&(d/=12)):(f=this-a,d="second"===b?f/1E3:"minute"===b?f/6E4:"hour"===b?f/36E5:"day"===b?(f-d)/864E5:"week"===b?(f-d)/6048E5:f);return c?d:w(d)},from:function(a,b){return e.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(e(),
    a)},calendar:function(){var a=O(e(),this).startOf("day"),a=this.diff(a,"days",!0),a=-6>a?"sameElse":-1>a?"lastWeek":0>a?"lastDay":1>a?"sameDay":2>a?"nextDay":7>a?"nextWeek":"sameElse";return this.format(this.lang().calendar(a,this))},isLeapYear:function(){return M(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=ma(a,this.lang()),this.add({d:a-
    b})):b},month:function(a){var b=this._isUTC?"UTC":"",c;if(null!=a){if("string"===typeof a&&(a=this.lang().monthsParse(a),"number"!==typeof a))return this;c=Math.min(this.date(),L(this.year(),a));this._d["set"+b+"Month"](a,c);e.updateOffset(this,!0);return this}return this._d["get"+b+"Month"]()},startOf:function(a){a=n(a);switch(a){case "year":this.month(0);case "month":this.date(1);case "week":case "isoWeek":case "day":this.hours(0);case "hour":this.minutes(0);case "minute":this.seconds(0);case "second":this.milliseconds(0)}"week"===
    a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1);return this},endOf:function(a){a=n(a);return this.startOf(a).add("isoWeek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){b="undefined"!==typeof b?b:"millisecond";return+this.clone().startOf(b)>+e(a).startOf(b)},isBefore:function(a,b){b="undefined"!==typeof b?b:"millisecond";return+this.clone().startOf(b)<+e(a).startOf(b)},isSame:function(a,b){b=b||"ms";return+this.clone().startOf(b)===+O(a,this).startOf(b)},min:function(a){a=e.apply(null,
    arguments);return a<this?this:a},max:function(a){a=e.apply(null,arguments);return a>this?this:a},zone:function(a,b){b=null==b?!0:!1;var c=this._offset||0;if(null!=a)"string"===typeof a&&(a=ka(a)),16>Math.abs(a)&&(a*=60),this._offset=a,this._isUTC=!0,c!==a&&b&&J(this,e.duration(c-a,"m"),1,!0);else return this._isUTC?c:this._d.getTimezoneOffset();return this},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){this._tzm?
    this.zone(this._tzm):"string"===typeof this._i&&this.zone(this._i);return this},hasAlignedHourOffset:function(a){a=a?e(a).zone():0;return 0===(this.zone()-a)%60},daysInMonth:function(){return L(this.year(),this.month())},dayOfYear:function(a){var b=A((e(this).startOf("day")-e(this).startOf("year"))/864E5)+1;return null==a?b:this.add("d",a-b)},quarter:function(){return Math.ceil((this.month()+1)/3)},weekYear:function(a){var b=C(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?
    b:this.add("y",a-b)},isoWeekYear:function(a){var b=C(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=C(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this.day()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return da(this.year(),
    1,4)},weeksInYear:function(){var a=this._lang._week;return da(this.year(),a.dow,a.doy)},get:function(a){a=n(a);return this[a]()},set:function(a,b){a=n(a);if("function"===typeof this[a])this[a](b);return this},lang:function(a){if(a===B)return this._lang;this._lang=s(a);return this}});for(k=0;k<X.length;k++)oa(X[k].toLowerCase().replace(/s$/,""),X[k]);oa("year","FullYear");e.fn.days=e.fn.day;e.fn.months=e.fn.month;e.fn.weeks=e.fn.week;e.fn.isoWeeks=e.fn.isoWeek;e.fn.toJSON=e.fn.toISOString;v(e.duration.fn=
    I.prototype,{_bubble:function(){var a=this._milliseconds,b=this._days,c=this._months,d=this._data;d.milliseconds=a%1E3;a=w(a/1E3);d.seconds=a%60;a=w(a/60);d.minutes=a%60;a=w(a/60);d.hours=a%24;b+=w(a/24);d.days=b%30;c+=w(b/30);d.months=c%12;b=w(c/12);d.years=b},weeks:function(){return w(this.days()/7)},valueOf:function(){return this._milliseconds+864E5*this._days+this._months%12*2592E6+31536E6*h(this._months/12)},humanize:function(a){var b=+this,c;c=!a;var d=this.lang(),f=A(Math.abs(b)/1E3),e=A(f/
    60),h=A(e/60),k=A(h/24),l=A(k/365),f=45>f&&["s",f]||1===e&&["m"]||45>e&&["mm",e]||1===h&&["h"]||22>h&&["hh",h]||1===k&&["d"]||25>=k&&["dd",k]||45>=k&&["M"]||345>k&&["MM",A(k/30)]||1===l&&["y"]||["yy",l];f[2]=c;f[3]=0<b;f[4]=d;c=Ra.apply({},f);a&&(c=this.lang().pastFuture(b,c));return this.lang().postformat(c)},add:function(a,b){var c=e.duration(a,b);this._milliseconds+=c._milliseconds;this._days+=c._days;this._months+=c._months;this._bubble();return this},subtract:function(a,b){var c=e.duration(a,
    b);this._milliseconds-=c._milliseconds;this._days-=c._days;this._months-=c._months;this._bubble();return this},get:function(a){a=n(a);return this[a.toLowerCase()+"s"]()},as:function(a){a=n(a);return this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:e.fn.lang,toIsoString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),g=Math.abs(this.seconds()+this.milliseconds()/1E3);return this.asSeconds()?(0>
    this.asSeconds()?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||g?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(g?g+"S":""):"P0D"}});for(k in Y)Y.hasOwnProperty(k)&&(pa(k,Y[k]),Va(k.toLowerCase()));pa("Weeks",6048E5);e.duration.fn.asMonths=function(){return(+this-31536E6*this.years())/2592E6+12*this.years()};e.lang("en",{ordinal:function(a){var b=a%10,b=1===h(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+b}});return e}).call(this);

    UI.datepicker.moment = moment;

    return UI.datepicker;
});