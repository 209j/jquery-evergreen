// # Selector

import { global, makeIterable } from './util';

var slice = [].slice,
    hasProto = !Object.prototype.isPrototypeOf({ __proto__: null }),
    reFragment = /^\s*<(\w+|!)[^>]*>/,
    reSingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    reSimpleSelector = /^[\.#]?[\w-]*$/;

/*
 * ## $
 *
 * Versatile wrapper for `querySelectorAll`.
 *
 * @param {String|Node|NodeList} selector Query selector.
 * Providing a selector string gives the default behavior.
 * Providing a Node or NodeList will return a NodeList or $Object containing the same element(s).
 * Providing a string that looks like HTML (i.e. starts with a `<tag>`) results in an attempt to create a DOM Fragment from it.
 * @param {String|Node|NodeList} context=`document` The context for the selector to query elements.
 * @return {NodeList|$Object}
 */

function $(selector, context) {

    var collection;

    if (!selector) {

        collection = document.querySelectorAll(null);

    } else if (typeof selector !== 'string') {

        collection = makeIterable(selector);

    } else if (reFragment.test(selector)) {

        collection = createFragment(selector);

    } else {

        context = context ? typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context : document;

        collection = querySelector(selector, context);

    }

    return $.isNative ? collection : wrap(collection);

}

/*
 * ## Find
 *
 * Chaining for the `$` wrapper (aliasing `find` for `$`).
 *
 *     $('.selector').find('.deep').$('.deepest');
 */

function find(selector) {
    return $(selector, this);
}

/*
 * ## Matches
 *
 * Returns true if the element would be selected by the specified selector string; otherwise, returns false.
 *
 *     $.matches(element, '.match');
 *
 * @param {Node} element Element to test
 * @param {String} selector Selector to match against element
 * @return {Boolean}
 */

var matches = (function() {
    var context = typeof Element !== 'undefined' ? Element.prototype : global,
        _matches = context.matches || context.matchesSelector || context.mozMatchesSelector || context.webkitMatchesSelector || context.msMatchesSelector || context.oMatchesSelector;
    return function(element, selector) {
        return _matches.call(element, selector);
    }
})();

/*
 * Use the faster `getElementById` or `getElementsByClassName` over `querySelectorAll` if possible.
 *
 * @method querySelector
 * @private
 * @param {String} selector Query selector.
 * @param {Node} context The context for the selector to query elements.
 * @return {NodeList|Node}
 */

function querySelector(selector, context) {

    var isSimpleSelector = reSimpleSelector.test(selector);

    if (isSimpleSelector && !$.isNative) {
        if (selector[0] === '#') {
            return (context.getElementById ? context : document).getElementById(selector.slice(1));
        }
        if (selector[0] === '.') {
            return context.getElementsByClassName(selector.slice(1));
        }
        return context.getElementsByTagName(selector);
    }

    return context.querySelectorAll(selector);

}

/*
 * Create DOM fragment from an HTML string
 *
 * @method createFragment
 * @private
 * @param {String} html String representing HTML.
 * @return {NodeList}
 */

function createFragment(html) {

    if (reSingleTag.test(html)) {
        return document.createElement(RegExp.$1);
    }

    var elements = [],
        container = document.createElement('div'),
        children = container.childNodes;

    container.innerHTML = html;

    for (var i = 0, l = children.length; i < l; i++) {
        elements.push(children[i]);
    }

    return elements;
}

/*
 * Calling `$(selector)` returns a wrapped array of elements [by default](mode.html).
 *
 * @method wrap
 * @private
 * @param {NodeList|Node|Array} collection Element(s) to wrap as a `$Object`.
 * @return {$Object} Array with augmented API.
 */

function wrap(collection) {

    var wrapped = collection instanceof Array ? collection : collection.length !== undefined ? slice.call(collection) : [collection],
        methods = $._api;

    if (hasProto) {
        wrapped.__proto__ = methods;
    } else {
        for (var key in methods) {
            wrapped[key] = methods[key];
        }
    }

    return wrapped;
}

// Export interface

export { $, find, matches };
