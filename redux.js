/*!
* Appcelerator Redux v9.0.0 by Dawson Toth
* http://tothsolutions.com/
*
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/**
 * Provide a central context for dealing with elements and configuring redux.
 */
var redux = function (selector) {
    return new redux.fn.init(selector);
};

(function(redux, context) {

    /**
     * Create shorthand for commonly used functions.
     */
    context.info = context.info || function(message) { Ti.API.info(message); };
    context.error = context.error || function(message) { Ti.API.error(message); };
    context.warn = context.warn || function(message) { Ti.API.warn(message); };
    context.log = context.log || function(level, message) { Ti.API.log(level, message); };
    context.currentWindow = context.currentWindow || function() { return Ti.UI.currentWindow; };
    context.currentTab = context.currentTab || function() { return Ti.UI.currentTab; };
    context.win = context.win || context.currentWindow;
    context.tab = context.tab || context.currentTab;

    /*
     * Include the json2.js JSON definition, because Titanium's Android JSON function doesn't stringify arrays properly as of 1.4.2.
     *
     * http://www.JSON.org/json2.js
     * 2010-11-17
     * Public Domain.
     * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     * See http://www.JSON.org/js.html
     */
    redux.JSON={};
    (function() {
        function l(b) {return b<10?"0"+b:b;}
        function o(b) {p.lastIndex=0;return p.test(b)?'"'+b.replace(p, function(f) {var c=r[f];return typeof c==="string"?c:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+b+'"';}
        function m(b,f) {var c,d,g,j,i=h,e,a=f[b]; if(a&&typeof a==="object"&&typeof a.toJSON==="function") { a=a.toJSON(b); } if(typeof k==="function") { a=k.call(f,b,a);} switch(typeof a) { case "string": return o(a); case "number": return isFinite(a)?String(a):"null"; case "boolean": case "null": return String(a); case "object": if(!a) { return"null"; } h+=n; e=[]; if(Object.prototype.toString.apply(a)==="[object Array]") { j=a.length; for(c=0;c<j;c+=1) { e[c]=m(c,a)||"null"; } g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]"; h=i; return g; } if(k&&typeof k==="object") { j=k.length; for(c=0;c<j;c+=1) { d=k[c]; if(typeof d==="string") { g=m(d,a); if(g) { e.push(o(d)+(h?": ":":")+g); } } } } else { for(d in a) { if(Object.hasOwnProperty.call(a,d)) { g=m(d,a); if(g) { e.push(o(d)+(h?": ":":")+g); } } } } g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+"\n"+i+"}":"{"+e.join(",")+"}"; h=i; return g; } }
        if(typeof Date.prototype.toJSON!=="function") { Date.prototype.toJSON= function() { return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null; }; String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON= function() { return this.valueOf();}; }
        var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,p=/[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;
        redux.JSON.stringify= function(b,f,c) { var d; n=h=""; if(typeof c==="number") { for(d=0;d<c;d+=1) { n+=" "; } } else if(typeof c==="string") { n=c; } if((k=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number")) {throw Error("JSON.stringify"); } return m("",{"":b}); };
        redux.JSON.parse= function(b,f) { function c(g,j) { var i,e,a=g[j]; if(a&&typeof a==="object") { for(i in a) { if(Object.hasOwnProperty.call(a,i)) { e=c(a,i); if(e!==undefined) { a[i]=e; } else { delete a[i]; } } } } return f.call(g,j,a); } var d; b=String(b); q.lastIndex=0; if(q.test(b)) { b=b.replace(q, function(g) { return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4); }); } if(/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))) { d=eval("("+b+")"); return typeof f==="function"?c({"":d},""):d; }throw new SyntaxError("JSON.parse"); };
    })();
    /**
     * Tracks and stores various data for redux, like events, elements, and included files.
     */
    redux.data = {
        events: [
            'beforeload', 'blur', 'change', 'click', 'close', 'complete', 'dblclick', 'delete', 'doubletap',
            'error', 'focus', 'load', 'move', 'open', 'return', 'scroll', 'scrollEnd', 'selected', 'singletap',
            'swipe', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'twofingertap'
        ],
        types: {
            Contacts: [
                'Group', 'Person'
            ],
            Facebook: [
                'LoginButton'
            ],
            Filesystem: [
                'TempDirectory', 'TempFile'
            ],
            Media: [
                'AudioPlayer', 'AudioRecorder', 'Item', 'MusicPlayer', 'Sound', 'VideoPlayer'
            ],
            Network: [
                'BonjourBrowser', 'BonjourService', 'HTTPClient', 'TCPSocket'
            ],
            Platform: [
                'UUID'
            ],
            Stream: [
                'Stream'
            ],
            UI: [
                '2DMatrix', '3DMatrix', 'ActivityIndicator', 'AlertDialog', 'Animation', 'Button', 'ButtonBar',
                'CoverFlowView', 'DashboardItem', 'DashboardView', 'EmailDialog', 'ImageView', 'Label', 'MaskedImage',
                'Notification', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow', 'ProgressBar', 'ScrollView',
                'ScrollableView', 'SearchBar', 'Slider', 'Switch', 'Tab', 'TabGroup', 'TabbedBar', 'TableView',
                'TableViewRow', 'TableViewSection', 'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window'
            ]
        },
        defaults: {
            byID: {},
            byClassName: {},
            byType: {}
        }
    };

    /**
     * The core redux functions.
     */
    redux.fn = redux.prototype = {
        /**
         * Returns the objects that match your selector, or the root redux object if you did not provide a selector. Note that only
         * objects created by redux constructors can be selected (ex use new Label() instead of Ti.UI.createLabel()).
         * @param {Object} selector
         */
        init: function (selector) {
            if (!selector) {
                return this;
            }
            this.selector = selector;
            // object
            if (typeof selector == 'object') {
                this.context = [this[0] = selector];
                this.length = 1;
                return this;
            }
            throw 'Non-object selectors have been turned off in this version of redux for memory reasons.';
        },
        /**
         * Turns a string of RJSS into JavaScript that can be safely evaluated. RJSS is a way to customize JavaScript
         * objects quickly, and is primarily used to style your UI elements.
         *
         * @param {String} file The raw RJSS contents to parse into executable JavaScript
         * @returns Executable JavaScript
         */
        parseRJSS: function (file) {
            var rjss = (Ti.Filesystem.getFile(file).read() + '').replace(/[\r\t\n]/g, ' ');
            var result = '', braceDepth = 0;
            var inComment = false, inSelector = false, inAttributeBrace = false;
            var canStartSelector = true, canBeAttributeBrace = false;

            for (var i = 0, l = rjss.length; i < l; i++) {
                if (inComment) {
                    if (rjss[i] == '/' && rjss[i - 1] == '*') {
                        inComment = false;
                    }
                    continue;
                }
                switch (rjss[i]) {
                    case ' ':
                        result += ' ';
                        break;
                    case '/':
                        inComment = rjss[i+1] == '*';
                        result += inComment ? '' : '/';
                        break;
                    case '[':
                        if (braceDepth > 0) {
                            result += '[';
                        } else {
                            canStartSelector = false;
                            result += 'if (';
                        }
                        break;
                    case '=':
                        result += (rjss[i - 1] != '!' && rjss[i - 1] != '<' && rjss[i - 1] != '>') ? '==' : '=';
                        break;
                    case ']':
                        if (braceDepth > 0) {
                            result += ']';
                        } else {
                            canStartSelector = true;
                            result += ')';
                            canBeAttributeBrace = true;
                        }
                        break;
                    case '{':
                        if (canBeAttributeBrace) {
                            canBeAttributeBrace = false;
                            inAttributeBrace = true;
                        } else {
                            if (inSelector) {
                                inSelector = false;
                                result += '",';
                            }
                            braceDepth += 1;
                        }
                        result += '{';
                        break;
                    case '}':
                        braceDepth -= 1;
                        result += '}';
                        switch (braceDepth) {
                            case 0:
                                result += ');';
                                canStartSelector = true;
                                break;
                            case -1:
                                inAttributeBrace = false;
                                braceDepth = 0;
                                break;
                        }
                        break;
                    default:
                        canBeAttributeBrace = false;
                        if (braceDepth == 0 && canStartSelector) {
                            canStartSelector = false;
                            inSelector = true;
                            result += '\nredux.fn.setDefault("';
                        }
                        result += rjss[i];
                        break;
                }
            }
            return result;
        },
        /**
         * Includes and parses one or more RJSS files. Styles will be applied to any elements you create after calling this.
         * @param {Array} arguments One or more RJSS files to include and parse
         */
        includeRJSS: function () {
            for (var i = 0, l = arguments.length; i < l; i++) {
                var parsedRJSS = redux.fn.parseRJSS(arguments[i]);
                try {
                    eval(parsedRJSS);
                } catch(e) {
                    error('RJSS "' + arguments[i] + '" has syntax errors:');

                    // Check each line for errors
                    var lines = parsedRJSS.split("\n");
                    for (var i2 = 0, l2 = lines.length; i2 < l2; i2++) {
                        try {
                            eval(lines[i2]);
                        } catch (e) {
                            error(lines[i2]);
                        }
                    }

                    e.message = 'RJSS Syntax ' + e.message;
                }
            }
        },
        /**
         * Returns true if the element is in the array.
         * @param {Object} element
         * @param {Object} array
         * @return {Boolean} true if the element is in the array
         */
        contains: function (element, array) {
            if (array.indexOf) {
                return array.indexOf(element) !== -1;
            }
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === element) {
                    return true;
                }
            }
            return false;
        },

         /**
         * Creates a clone of an object
         * @param {Object} original
         */
        clone: function clone(original) {
            if (original === null) {
                return null;
            }
            var clonedObject = {};
            for (var index in original) {
                if (original.hasOwnProperty(index) && original[index] !== undefined) {
                    // if original does not have hasOwnProperty or is an Array then simply copy the whole object
                    if ( (typeof original[index] === 'object') &&
                         !(original[index] instanceof Array) &&
                         (original[index].hasOwnProperty) &&
                         (!Ti.Android || original[index].toString() == '[object Object]')
                        ) {
                        clonedObject[index] = clone(original[index]);
                    } else {
                        clonedObject[index] = original[index];
                    }
                }
            }
            return clonedObject;
        },

        /**
         * Merges the properties of the two objects.
         * @param {Object} defaultObj
         * @param {Object} newObj
         * @param {Boolean} newObjOverridesDefault (defaults to false, therefore defaultObj is not overriden where attributes exist)
         */
        mergeObjects: function mergeObjects(defaultObj, newObj, newObjOverridesDefault) {
            var combined = {};
            if (defaultObj === null) {
                return newObj || {};
            }
            if (newObj === null) {
                return defaultObj;
            } else {
                combined = redux.fn.clone(defaultObj);
            }
            for (var index in newObj) {
                if (newObj.hasOwnProperty(index)) {
                    if (typeof newObj[index] === 'object') {
                        // Only combine child object if it's a native Javascript object and not an Array
                        if ( (newObj[index].hasOwnProperty) && !(newObj[index] instanceof Array) ) {
                          combined[index] = mergeObjects(combined[index], newObj[index], newObjOverridesDefault);
                        } else if ( (typeof combined[index] === 'undefined') || (newObjOverridesDefault) ) {
                          combined[index] = newObj[index];
                        }
                    } else if ( (typeof combined[index] === 'undefined') || (newObjOverridesDefault) ) {
                        combined[index] = newObj[index];
                    }
                }
            }
            return combined;
        },
        /**
         * Adds an event binder that can bind listen events or fire events, similar to how jQuery's events stack works.
         * @param {Object} event
         */
        addEventBinder: function (event) {
            redux.fn.init.prototype[event] = function () {
                var action;
                if (arguments.length == 0 || !(arguments[0] instanceof Function)) {
                    action = 'fireEvent';
                } else {
                    action = 'addEventListener';
                }
                for (var i = 0, l = this.context.length; i < l; i++) {
                    this.context[i][action](event, arguments[0]);
                }
                return this;
            };
        },
        /**
         * Set the default properties for any elements matched by the RJSS selector.
         * @param {Object} selector
         * @param {Object} defaults
         */
        setDefault: function (selector, defaults) {
            var selectors = selector.split(',');
            for (var i = 0, l = selectors.length; i < l; i++) {
                var cleanSelector = selectors[i].split(' ').join(''); // remove spaces
                var target;
                switch (cleanSelector.charAt(0)) {
                    case '#': // set by ID
                        target = redux.data.defaults.byID;
                        cleanSelector = cleanSelector.substring(1); // remove the '#'
                        break;
                    case '.': // set by className
                        target = redux.data.defaults.byClassName;
                        cleanSelector = cleanSelector.substring(1); // remove the '.'
                        break;
                    default: // set by element type
                        target = redux.data.defaults.byType;
                        break;
                }
                target[cleanSelector] = this.mergeObjects(target[cleanSelector] || {}, defaults, true);
            }
            return this;
        },
        /**
         * Takes in an object and applies any default styles necessary to it.
         * @param args
         */
        style: function(type, args) {
            // merge defaults by id
            if (args && args.id && redux.data.defaults.byID[args.id]) {
                args = redux.fn.mergeObjects(args, redux.data.defaults.byID[args.id]);
            }
            // merge defaults by class name
            if (args && args.className) {
                var classes = args.className.split(' ');
                for (var i = 0, l = classes.length; i < l; i++) {
                    args = redux.fn.mergeObjects(args, redux.data.defaults.byClassName[classes[i]]);
                }
            }
            // merge defaults by type
            return redux.fn.mergeObjects(args, redux.data.defaults.byType[type]);
        },
        /**
         * Applies the styles from the passed in arguments directly to the passed in object.
         * @param obj Any object or UI element; does not have to be created by redux.
         * @param type The type of the object (Label, ImageView, etc)
         * @param args The construction arguments, such as the id or className
         */
        applyStyle: function(obj, type, args) {
            var styles = redux.fn.style(type, args);
            for (var index in styles) {
                obj[index] = styles[index];
            }
        },
        /**
         * Adds a natural constructors for all the different things you can create with Ti, like Labels,
         * LoginButtons, HTTPClients, etc. Also allows you to add your own natural constructors.
         *
         * @param context The context to add this constructor to ("this" would be a good thing to pass in here)
         * @param parent The parent namespace (like Ti.UI)
         * @param type The type of the constructor (like Label or Button)
         * @param constructorName The desired constructor name; defaults to type. Generic styles will use this.
         */
        addNaturalConstructor: function (context, parent, type, constructorName) {
            constructorName = constructorName || type;
            context[constructorName] = function (args) {
                args = redux.fn.style(constructorName, args);
                // return created object with merged defaults by type
                return parent['create' + type](args);
            };
            /**
             * Shortcut to setting defaults by type. Will only apply to objects you create in the future using redux's constructors.
             * @param {Object} args
             */
            context[type].setDefault = function (args) {
                redux.fn.setDefault(type, args);
            };
        },
        /**
         * Adds a natural constructors for all the different things you can create with Ti, like Labels,
         * LoginButtons, HTTPClients, etc.
         *
         * @param context The context to add this constructor to ("this" would be a good thing to pass in here)
         * @param namespace The namespace under Ti that the object will be created in (like UI, as in Ti.UI)
         * @param type The type of the constructor (like Label or Button)
         * @param constructorName The desired constructor name; defaults to type. Generic styles will use this.
         */
        addTitaniumNaturalConstructor: function (context, namespace, type, constructorName) {
            constructorName = constructorName || type;
            context[constructorName] = function (args) {
                args = redux.fn.style(constructorName, args);
                // return created object with merged defaults by type
                return Ti[namespace]['create' + type](args);
            };
            /**
             * Shortcut to setting defaults by type. Will only apply to objects you create in the future using redux's constructors.
             * @param {Object} args
             */
            context[type].setDefault = function (args) {
                redux.fn.setDefault(type, args);
            };
        }
    };

    /**
     * Add shorthand events.
     */
    for (var i = 0, l = redux.data.events.length; i < l; i++) {
        redux.fn.addEventBinder(redux.data.events[i]);
    }
    
    /**
     * Add natural constructors and shortcuts to setting defaults by type.
     */
    for (var i3 in redux.data.types) {
        // iterate over type namespaces (UI, Network, Facebook, etc)
        if (redux.data.types.hasOwnProperty(i3)) {
            for (var j3 = 0, l3 = redux.data.types[i3].length; j3 < l3; j3++) {
                // iterate over types within parent namespace (Label, LoginButton, HTTPClient, etc)
                redux.fn.addTitaniumNaturalConstructor(this, i3, redux.data.types[i3][j3]);
            }
        }
    }

    /**
     * Expose the applyStyle function to selector based redux usages -- $(view).applyStyle() etc.
     * @param type
     * @param args
     */
    redux.fn.init.prototype.applyStyle = function(type, args) {
        for (var i = 0, l = this.length; i < l; i++) {
            redux.fn.applyStyle(this.context[i], type, args);
        }
        return this;
    };

    /**
     * Includes and parses one or more RJSS files. Styles will be applied to any elements you create after calling this.
     */
    context.includeRJSS = redux.fn.includeRJSS;

    /**
     * Create a shorthand for redux itself -- $, if it is available.
     */
    context['$'] = context['$'] || redux;

})(redux, this);