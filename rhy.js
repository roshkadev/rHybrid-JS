/*
 * A module for JavaScript to native communication, and visa-versa.
 *
 * Support for the following platforms is implemented:
 *
 *     - Android
 *     - iOS
 */
(function(Rhy, undefined) {

    
    // Platform identifers.
    Rhy.isAndroid   = navigator.userAgent.match(/Android/i);
    Rhy.isiOS       = navigator.userAgent.match(/iPhone|iPad|iPod/i);

    /*
     * @function makeNativeRequest      - A wrapper function to send a new
     *                                    request to the native code.
     *
     * @param {object} parameters       - A dictionary of key-value pairs to
     *                                    send to the native code.
     */
    function nativeRequest(parameters) {
        

        // Here we check to see if the parameters has a platform specific
        // object. If so, we only pass that on to the platform specific request
        // handler. Else, we pass everything.
        if (Rhy.isiOS) {

            /*
            if (parameters.IOS) {
                parameters = parameters.IOS;
            }  
            */

            return Rhy.iOS.request(parameters);

        } else if (Rhy.isAndroid) {

            if (parameters.ANDROID) {
                parameters = parameters.ANDROID;
            }  

            return Rhy.Android.request(parameters);

        }
    }


    /*
     * @function nativeRequest      - This is here mostly for debugging, allows
     *                                us to send any message to the native
     *                                code.
     * @param {object} parameters   - The parameters to send to the native
     *                                code.
     */
    Rhy.nativeRequest = function(parameters) {
        return nativeRequest(parameters);
    };

    /*
     * @function getValuesForKeys  - Useful to get a batch of values from the 
     *                               native code in a single operation.
     * @param {array} keys         - A list of keys whose values we want.
     * @return {object}            - A dictionary of key/value pairs where the 
     *                               the keys are the keys from the array
     *                               passed in, and the values are the values
     *                               returned from the native code.
     */
    Rhy.getValuesForKeys = function(keys) {
        return nativeRequest({
            'getValuesForKeys' : keys,           
        })
    };

    /*
     * @function showActivityIndicator  - Show the activity indicator.
     */
    Rhy.showActivityIndicator = function() {
        nativeRequest({
            showActivityIndicator   : 'showActivityIndicator' ,    
        });
    };

    /*
     * @function hideActivityIndicator  - Hide the activity indicator.
     */
    Rhy.hideActivityIndicator = function() {
        nativeRequest({
            hideActivityIndicator   : 'hideActivityIndicator',    
        });
    };


    /*
     * @function pushScreen              - Go to the new screen given by
     *                                    the HTML file name.
     * @param {string} fileName         - The name of the HTML file to 
     *                                    open on the next screen.
     */
    Rhy.newScreen = function(fileName, showNavigationBar) {
        var navigationBar = showNavigationBar || false;
        nativeRequest({
            newScreen           : fileName,
            showNavigationBar   : navigationBar
        });
    };


    /*
     * @function popScreen               - Pop the given number of screens.
     *                                     Default is one.
     * @optional
     * @param {string} screens           - The number of screens to pop.
     * @param {function} callback        - todo
     */
    Rhy.popScreen = function(screens, callback) {
        var params = {
            popScreen           : screens ? screens : 1,    
        };
        if (callback) {
            params.callback = callback;
        }
        nativeRequest(params);
    };


    /*
     * @function createMenu              - Create the given menu with the 
     *                                     given screen open.
     * @param {string} menuFileName      - The menu file to open.
     * @param {function} openFileName    - The file to open. 
     */
    Rhy.createMenu = function(menuFileName, openFileName, menuMargin) {
 
        // If the size was passed in, in rem units, e.g. '3.2rem', convert it to px.
        if (menuMargin.indexOf('rem', menuMargin.length - 'rem'.length) !== -1) {
            var size = getComputedStyle(document.documentElement).fontSize;
            menuMargin = parseInt(parseFloat(menuMargin) * parseFloat(size));
        }
 
        nativeRequest({
            createMenu          : menuFileName,    
            openFileName        : openFileName,
            menuMargin          : menuMargin,
        });
    };


    /*
     * @function openMenuOption          - Open a screen that corresponds to a
     *                                     menu option.
     */
    Rhy.openMenuOption = function(HTMLFile) {
        return nativeRequest({
            openMenuOption      : HTMLFile,    
        });
    };


    /*
     * @function toggleMenu              - Open/close the menu.
     */
    Rhy.toggleMenu = function() {
        nativeRequest({
            toggleMenu          : 'toggleMenu',    
        });
    };

    /*
     * @function shouldEnableMenu        - Enable/disable the menu.
     * @param shouldEnable               - Pass true to enable, false to
     *                                     disable. 
     */
    Rhy.shouldEnableMenu = function(shouldEnable) {
        nativeRequest({
            shouldEnableMenu : shouldEnable,    
        });
    };


    /*
     * @function handleMenu              - This method handles menu visibility 
     *                                     automatically.
     *                                     This is left empty intentionally,
     *                                     implementations must override this
     *                                     programatically.
     *                                     It's put here so it's know to exist.
     * @example                          - An example of usage for a screen
     *                                     which does not need the menu enabled
     *                                     (i.e. a screen with a back button):
     *     
     *     Rhy.handleMenu = function() {
     *         $(function() {
     *             Rhy.shouldEnableMenu(false);
     *         });
     *     };
     */
    Rhy.handleMenu = undefined;



    /*
     * @function openInBrowser           - Open the given URL in the
     *                                     device's browser app. 
     * @param {string} URL               - The URL to open.
     */
    Rhy.openInBrowser = function(URL) {
        nativeRequest({
            openInBrowser       : URL,    
        });
    };


    /*
     * @function isAppInstalled         - Check if the app identified by
     *                                    the given URL scheme is
     *                                    installed. 
     * @param {object}                   
     *     @optional                    - Only the supported platforms should
     *                                    be represented here.
     *     @param {object} ANDROID
     *         @param {String} packageName  - The app's package name.
     *         @param {String} formFactor   - The compatible form factor of 
     *                                        the app (SMARTPHONE, TABLET or 
     *                                        UNIVERSAL).
     *     @param {object} IOS
     *         @param {String} URLScheme    - The app's URL Scheme.
     *         @param {String} formFactor   - The compatible form factor of 
     *                                        the app (SMARTPHONE, TABLET or 
     *                                        UNIVERSAL).
     *     @param {object} WINDOWS
     *         @param {String} packageName  - The app's package name.
     *         @param {function} callback     - The function to be called with
     *                                        the native method's result.
     */
    Rhy.isAppInstalled = function(options) {

        // Here we need to add the command identifier so that it can be
        // identified in the native code.
        options.isAppInstalled = 'isAppInstalled';

        return nativeRequest(options);
    };


    /*
     * @function openApp                - Open the given app (if installed,
     *                                    open the app, else open the app
     *                                    in the app store). 
     * @param {object}                   
     *     @optional                    - Only the supported platforms should
     *                                    be represented here.
     *     @param {object} ANDROID
     *         @param {String} packageName  - The app's package name.
     *
     *     @param {object} IOS
     *         @param {String} URLScheme    - The app's URL Scheme.
     *         @param {String} appID        - The app's ID in iTunes Connect.
     *     @param {object} WINDOWS
     *         @param {String} packageName  - The app's package nam to check if
     *                                        it's installed.
     *         @param {String} appUri       - The URI Asociated to the App, to 
     *                                        launch it.
     *
     */
    Rhy.openApp = function(options) {

        // Here we need to add the command identifier so that it can be
        // identified in the native code.
        options.openApp = 'openApp';

        return nativeRequest(options);
    };


    /*
     * @function formFactor             - Get the kind of device (i.e. tablet
     *                                    or smartphone). 
     *
     * @return                          - Either SMARTPHONE or TABLET.
     */
    Rhy.formFactor = function() {
        return nativeRequest({ 
            formFactor: 'formFactor',
        });
    };


    /*
     * @function updateAppConfigKey - Set the value for the given key in the
     *                                app's global persistant configuration
     *                                object.
     * @param key {string}          - The key to set.
     * @param value {string}        - The value of the key.
     */
    Rhy.updateAppConfigKey = function(key, value) {
        var options = {updateAppConfigKey: key};
        options[key] = value;
        return nativeRequest(options);
    };


    /*
     * @function callPhone              - Call the given phone number if the
     *                                    device is capable of making calls.
     *                                    Else show the given message.
     * @param {string} callPhone        - The phone number.
     * @optional
     * @param {string} title            - The title of the message to show if
     *                                    device is not capable of making
     *                                    calls. 
     * @param {string} message          - The the message to show if device
     *                                    is not capable of making calls. 
     * @param {string} okButtonTitle    - The title of the ok button.
     */
    Rhy.callPhone = function(options) {
        if (!options.title) {
            options.title = "Message";
        }
        if (!options.message) {
            options.message = "Cannot make call";
        }
        if (!options.okButtonTitle) {
            options.okButtonTitle = "Ok";
        }
        if(!options.callPhone) {
            options.callPhone = options.number;
        }
        nativeRequest(options);
    };
 
    Rhy.showNavigationBar = function(value) {
        nativeRequest({
            showNavigationBar: value,
        });
    }
 
    Rhy.getValueForKey = function(key) {
        return nativeRequest({
            getValueForKey: key,
        })
    }

    Rhy.setValueForKey = function(key, value) {
        return nativeRequest({
                             setValueForKey: key,
                             value: value
                             })
    }
 
    Rhy.showAlert = function (title, message, okButtonTitle) {
 var options = {'showAlert': message, 'title': title, 'button_text': okButtonTitle};
        return nativeRequest(options);
    }
 
 Rhy.showDatePicker = function() {
    return nativeRequest();
 }
})(window.Rhy = window.Rhy || {});


