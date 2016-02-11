/*
 * @module - A utilities module containing common utility functions.
 */
(function(RSKUtils) {

    // Platform identifers.
    if (navigator.userAgent.match(/Android/i)) {
        RSKUtils.isAndroid = true;
    } else {
        RSKUtils.isAndroid = false;
    }
    if (navigator.userAgent.match(/BlackBerry/i)) {
        RSKUtils.isBlackBerry = true;
    } else {
        RSKUtils.isBlackBerry= false;
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        RSKUtils.isiOS = true;
    } else {
        RSKUtils.isiOS = false;
    }
    if (navigator.userAgent.match(/IEMobile/i)) {
        RSKUtils.isWindows = true;
    } else {
        RSKUtils.isWindows = false;
    }


    /*
     * @function isEqualIgnoringCase - Compare two strings ignoring case.
     *
     * @param {string} first    - First string.
     * @param {string} second   - Second string.
     * @return {boolean}        - true if equal, false otherwise.
     */
    RSKUtils.isEqualIgnoringCase = function(first, second) {
        return first.toUpperCase() === second.toUpperCase();
    };


    /*
     * @function arrayContainsValue - Check if an array contains the given 
     *                                value.
     *
     * @param {array} array     - The array.
     * @param {string} value    - The value.
     * @return {boolean}        - true if array contains value, false otherwise.
     */
    RSKUtils.arrayContainsValue = function(array, value) {
        return array.indexOf(value) > -1;
    };

    /*
     * @function makeQueryString    - Converts the given dictionary of key-value
     *                                pairs into a string of query parameters.
     *                                E.g. Given the following dictionary,
     *
     *                                    makeQueryString({
     *                                        foo       : 'bar',
     *                                        count     : 1,
     *                                        is        : true,
     *                                    });
     * 
     *                                The resulting query string is:
     *                                 
     *                                    "foo=bar&count=1&is=true"
     *  
     * @param {object} parameters   - A dictionary of key-value pairs.
     */
    RSKUtils.makeQueryString = function(parameters) {
        // Make the full request string.
        var str = [];
        for (var p in parameters) {
            if (parameters.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" +
                        encodeURIComponent(parameters[p]));
            }   
        }
        var queryString = str.join("&");
        return queryString;
    };

    /*
     * @function loadCSS - Load the given CSS file.
     * @param {string} - CSS file to load.
     */
    RSKUtils.loadCSS = function(CSSFile) {
        var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = CSSFile;
        head.appendChild(link);
        return link;
    };

    
    /*
     * @function getStyleProperty - Get the given style from the given element.
     * @param {elem}              - The element to inspect.
     * @param {prop}              - The CSS property to retrieve.
     */
    RSKUtils.getStyleProperty = function(elem, prop) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(elem, null).getPropertyValue(prop);
        } else if (elem.currentStyle) {
            return elem.currentStyle[prop]; // IE
        }
    };



})(window.RSKUtils = window.RSKUtils || {});

