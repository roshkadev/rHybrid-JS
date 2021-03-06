/*
 * @module Rhy.iOS       - A module to facilitate JavaScript to iOS (and 
 *                         vise-versa) communication. This module aims to be
 *                         compatible with Swift an the WKWebView. These 
 *                         functions are loaded inside iOS object inside the 
 *                         Rhy namespace.
 *
 * @dependencies                
 */
(function(iOS, undefined) {

    //
    iOS.request = function(options) {

        // If the web view is a WKWebView, the communication is different than
        // if for a UIWebView.
        if (window.webkit) {
            // Note: The JavaScript dictionary is implicitly converted to a 
            // NSDictionary.
            window.webkit.messageHandlers.RhyiOS.postMessage(options);
        } 
        // Else, we're dealing with a UIWebView.
        else
        {
            var params = [];
            for (var p in options) {
                if (options.hasOwnProperty(p)) {
                    params.push(encodeURIComponent(p) + "=" +
                            encodeURIComponent(options[p]));
                    }
            }
            var queryString = params.join("&");
             
            // Rhy.iOS.URLScheme holds the URLScheme for iOS and is
            // injected by the native code beforehand.
            var src =
                    //window.Rhy.Config.URL_SCHEME +
                    "rhybrid" +
                    '://webview?' +
                    RSKUtils.makeQueryString(options);

            // We use an iframe instead of setting window.location directly
            // so that the native code blocks and has a chance to set the
            // response variable (i.e. a hack).
            // See http://stackoverflow.com/questions/26851630
            // /javascript-synchronous-native-communication-to-wkwebview
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", src);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null; 
        }

        // Return what the native code sent us (if anything).
        return iOS.response;
    };

    iOS.setStatusBarColor = function() {
        var colorCSS;
        var elem = document.getElementById('navbar') ?
                   document.getElementById('navbar') :
                   document.getElementsByTagName('body')[0];
 
        if (window.getComputedStyle) {
            colorCSS = window.getComputedStyle(elem, null).
                    getPropertyValue('background-color');
        } else if (elem.currentStyle) {
            colorCSS = elem.currentStyle['background-color']; 
        }
 
        var colorRGB = colorCSS.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
        var red = parseInt(colorRGB[1]);
        var green = parseInt(colorRGB[2]);
        var blue = parseInt(colorRGB[3]);
        Rhy.iOS.request({
            setiOSStatusBarColor         : red,
            green                           : green,
            blue                            : blue,
        });
    };
 

 
})(window.Rhy.iOS = window.Rhy.iOS || {});


