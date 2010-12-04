/*!
* Appcelerator Redux v7 by Dawson Toth
* http://tothsolutions.com/
*
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/**
 * Create shorthand for commonly used functions.
 */
var info = Ti.API.info,
error = Ti.API.error,
warn = Ti.API.warn,
log = Ti.API.log,
include = Ti.include;

/**
 * Provide a central context for dealing with elements and configuring redux.
 */
var redux = function (selector) {
    return new redux.fn.init(selector);
};
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
    function l(b) {
        return b<10?"0"+b:b;
    }

    function o(b) {
        p.lastIndex=0;
        return p.test(b)?'"'+b.replace(p, function(f) {
            var c=r[f];
            return typeof c==="string"?c:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4);
        })+'"':'"'+b+'"';
    }

    function m(b,f) {
        var c,d,g,j,i=h,e,a=f[b];
        if(a&&typeof a==="object"&&typeof a.toJSON==="function") {
            a=a.toJSON(b);
        }
        if(typeof k==="function") {
            a=k.call(f,b,a);
        }
        switch(typeof a) {
            case "string":
                return o(a);
            case "number":
                return isFinite(a)?String(a):"null";
            case "boolean":
            case "null":
                return String(a);
            case "object":
                if(!a) {
                    return"null";
                }
                h+=n;
                e=[];
                if(Object.prototype.toString.apply(a)==="[object Array]") {
                    j=a.length;
                    for(c=0;c<j;c+=1) {
                        e[c]=m(c,a)||"null";
                    }
                    g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]";
                    h=i;
                    return g;
                }
                if(k&&typeof k==="object") {
                    j=k.length;
                    for(c=0;c<j;c+=1) {
                        d=k[c];
                        if(typeof d==="string") {
                            if(g=m(d,a)) {
                                e.push(o(d)+(h?": ":":")+g);
                            }
                        }
                    }
                } else {
                    for(d in a) {
                        if(Object.hasOwnProperty.call(a,d)) {
                            if(g=m(d,a)) {
                                e.push(o(d)+(h?": ":":")+g);
                            }
                        }
                    }
                }
                g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+"\n"+i+"}":"{"+e.join(",")+"}";
                h=i;
                return g;
        }
    }

    if(typeof Date.prototype.toJSON!=="function") {
        Date.prototype.toJSON= function() {
            return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null;
        };
        String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON= function() {
            return this.valueOf();
        };
    }
    var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;
    redux.JSON.stringify= function(b,f,c) {
        var d;
        n=h="";
        if(typeof c==="number") {
            for(d=0;d<c;d+=1) {
                n+=" ";
            }
        } else if(typeof c==="string") {
            n=c;
        }
        if((k=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number")) {throw Error("JSON.stringify");
        }
        return m("",{"":b});
    };
    redux.JSON.parse= function(b,f) {
        function c(g,j) {
            var i,e,a=g[j];
            if(a&&typeof a==="object") {
                for(i in a) {
                    if(Object.hasOwnProperty.call(a,i)) {
                        e=c(a,i);
                        if(e!==undefined) {
                            a[i]=e;
                        } else {
                            delete a[i];
                        }
                    }
                }
            }
            return f.call(g,j,a);
        }

        var d;
        b=String(b);
        q.lastIndex=0;
        if(q.test(b)) {
            b=b.replace(q, function(g) {
                return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        if(/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        "]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))) {
            d=eval("("+b+")");
            return typeof f==="function"?c({"":d},""):d;
        }throw new SyntaxError("JSON.parse");
    };
})();
/**
 * Tracks and stores various data for redux, like events, elements, and included files.
 */
redux.data = {
    events: [
    'beforeload', 'blur', 'change', 'click', 'close', 'dblclick', 'delete', 'doubletap',
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
        'File', 'TempDirectory', 'TempFile'
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
        UI: [
        '2DMatrix', '3DMatrix', 'ActivityIndicator', 'AlertDialog', 'Animation', 'Button',
        'ButtonBar', 'CoverFlowView', 'DashboardItem', 'DashboardView', 'EmailDialog',
        'ImageView', 'Label', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow',
        'ProgressBar', 'ScrollView', 'ScrollableView', 'SearchBar', 'Slider', 'Switch',
        'Tab', 'TabGroup', 'TabbedBar', 'TableView', 'TableViewRow', 'TableViewSection',
        'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window'
        ]
    },
    maps: {
        byID: {},
        byClassName: {},
        byType: {}
    },
    defaults: {
        byID: {},
        byClassName: {},
        byType: {}
    },
    globalVariables: {
        files: '', rjss: '', parsedrjss: ''
    },
    global: {
        /* dynamically generated based on variables in Ti.App.redux */
    }
};
for (var i in redux.data.globalVariables) {
    if (redux.data.globalVariables.hasOwnProperty(i)) {
        (function (i) {
            redux.data.global['get' + i] = function () {
                if (!Ti.App['redux-' + i]) {
                    return null;
                }
                return redux.JSON.parse(Ti.App['redux-' + i]);
            };
            redux.data.global['set' + i] = function (value) {
                Ti.App['redux-' + i] = redux.JSON.stringify(value);
            };
        })(i);
    }
}

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
        // id
        if (selector.indexOf('#') === 0) {
            this.context = [this[0] = redux.data.maps.byID[selector.split('#')[1]]];
            this.length = this.context != null;
            return this;
        }
        // class name
        if (selector.indexOf('.') === 0) {
            this.context = redux.data.maps.byClassName[selector.split('.')[0]];
            return redux.fn.mergeObjects(this, this.context);
        }
        // type
        this.context = redux.data.maps.byType[selector];
        return redux.fn.mergeObjects(this, this.context);
    },
    /**
     * Includes one or more files in every JavaScript context that that will exist, so long as redux is loaded
     * with it.
     * @param {Array} One or more files to include globally
     */
    includeGlobal: function () {
        var files = redux.data.global.getfiles() || [];
        for (var i = 0; i < arguments.length; i++) {
            if (!redux.fn.contains(arguments[i], files)) {
                files.push(arguments[i]);
                include(arguments[i]);
            }
        }
        redux.data.global.setfiles(files);
    },
    /**
     * Turns a string of RJSS into JavaScript that can be safely evaluated. RJSS is a way to customize JavaScript
     * objects quickly, and is primarily used to style your UI elements.
     *
     * @param {String} The raw RJSS contents to parse into executable JavaScript
     * @returns Executable JavaScript
     */
    parseRJSS: function (file) {
        var parsedrjss = redux.data.global.getparsedrjss() || {};
        if (parsedrjss[file]) {
            return parsedrjss[file];
        }
        var rjss = (Ti.Filesystem.getFile(file).read() + '').replace(/[\r\t\n]/g, ' ');
        var result = '', length = rjss.length, braceDepth = 0;
        var inComment = false, inSelector = false, inAttributeBrace = false;
        var canStartSelector = true, canBeAttributeBrace = false;

        for (var i = 0; i < length; i++) {
            var next = rjss[i+1], current = rjss[i], last = rjss[i-1];
            if (inComment) {
                if (current == '/' && last == '*') {
                    inComment = false;
                }
                continue;
            }
            switch (current) {
                case ' ':
                    result += ' ';
                    break;
                case '/':
                    inComment = next == '*';
                    result += inComment ? '' : '/';
                    break;
                case '[':
                    canStartSelector = false;
                    result += 'if (Ti.';
                    break;
                case '=':
                    result += (last != '!' && last != '<' && last != '>') ? '==' : '=';
                    break;
                case ']':
                    canStartSelector = true;
                    result += ')';
                    canBeAttributeBrace = true;
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
                        result += 'redux.fn.setDefault("';
                    }
                    result += current;
                    break;
            }
        }
        parsedrjss[file] = result;
        redux.data.global.setparsedrjss(parsedrjss);
        return result;
    },
    /**
     * Includes and parses one or more RJSS files. Styles will be applied to any elements you create after calling this.
     * @param {Array} One or more RJSS files to include and parse
     */
    includeRJSS: function () {
        for (var i = 0; i < arguments.length; i++) {
            eval(redux.fn.parseRJSS(arguments[i]));
        }
    },
    /**
     * Includes and parses one or more RJSS file in every JavaScript context that will exist, so long as
     * you include redux in each of them.
     * @param {Array} One or more RJSS files to include globally
     */
    includeRJSSGlobal: function () {
        var files = redux.data.global.getrjss() || [];
        for (var i = 0; i < arguments.length; i++) {
            if (!redux.fn.contains(arguments[i], files)) {
                files.push(arguments[i]);
                redux.fn.includeRJSS(arguments[i]);
            }
        }
        redux.data.global.setrjss(files);
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
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === element) {
                return true;
            }
        }
        return false;
    },
    /**
     * Merges the properties of the two objects.
     * @param {Object} original
     * @param {Object} overrider
     */
    mergeObjects: function mergeObjects(original, overrider) {
        if (original == null) {
            return overrider || {};
        }
        if (overrider == null) {
            return original;
        }
        for (var index in overrider) {
            if (overrider.hasOwnProperty(index)) {
                if (typeof original[index] == 'undefined') {
                    original[index] = overrider[index];
                } else if (typeof overrider[index] == 'object') {
                    original[index] = mergeObjects(original[index], overrider[index]);
                }
            }
        }
        return original;
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
            for (var i = 0; i < this.context.length; i++) {
                this.context[i][action](event, arguments[0]);
            }
            return this;
        };
    },
    /**
     * Starts tracking an element with redux. This lets us select the element later by its ID
     * class or type.
     * @param {Object} element
     */
    trackElement: function (element) {
        var maps = redux.data.maps;
        if (element.id) {
            maps.byID[element.id] = element;
        }
        if (element.className) {
            if (!maps.byClassName[element.className]) {
                maps.byClassName[element.className] = [];
                maps.byClassName[element.className].push(element);
            } else if (!redux.fn.contains(element, maps.byClassName[element.className])) {
                maps.byClassName[element.className].push(element);
            }
        }
        if (!maps.byType[element.toString()]) {
            maps.byType[element.toString()] = [];
            maps.byType[element.toString()].push(element);
        } else if (!redux.fn.contains(element, maps.byType[element.toString()])) {
            maps.byType[element.toString()].push(element);
        }
    },
    /**
     * Set the default properties for any elements matched by the RJSS selector.
     * @param {Object} selector
     * @param {Object} defaults
     */
    setDefault: function (selector, defaults) {
        var selectors = selector.split(',');
        for (var i = 0; i < selectors.length; i++) {
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
            target[cleanSelector] = this.mergeObjects(target[cleanSelector] || {}, defaults);
        }
        return this;
    }
};

/**
 * Add shorthand events.
 */
for (var i = 0; i < redux.data.events.length; i++) {
    redux.fn.addEventBinder(redux.data.events[i]);
}

/**
 * Add natural constructors and shortcuts to setting defaults by type.
 */
for (var i in redux.data.types) {
    // iterate over type namespaces (UI, Network, Facebook, etc)
    if (redux.data.types.hasOwnProperty(i)) {
        for (var j = 0; j < redux.data.types[i].length; j++) {
            // iterate over types within parent namespace (Label, LoginButton, HTTPClient, etc)
            (function (parent, type) {
                /**
                 * Natural constructors for all the different things you can create with Ti, like Labels, LoginButtons, HTTPClients, etc.
                 * @param {Object} args
                 */
                this[type] = function cstor(args) {
                    if (!(this instanceof arguments.callee)) {
                        return new cstor(args);
                    }
                    // merge defaults by id
                    if (args && args.id && redux.data.defaults.byID[args.id]) {
                        args = redux.fn.mergeObjects(args, redux.data.defaults.byID[args.id]);
                    }
                    // merge defaults by class name
                    if (args && args.className) {
                        var classes = args.className.split(' ');
                        for (var k = 0; k < classes.length; k++) {
                            args = redux.fn.mergeObjects(args, redux.data.defaults.byClassName[classes[k]]);
                        }
                    }
                    // merge defaults by type
                    args = redux.fn.mergeObjects(args, redux.data.defaults.byType[type]);
                    // return created object with merged defaults by type
                    var createdElement = Ti[parent]['create' + type](args);
                    redux.fn.trackElement(createdElement);
                    return createdElement;
                };
                /**
                 * Shortcut to setting defaults by type. Will only apply to objects you create in the future using redux's constructors.
                 * @param {Object} args
                 */
                this[type].setDefault = function (args) {
                    redux.fn.setDefault(type, args);
                };
            })(i, redux.data.types[i][j]);
        }
    }
}

/**
 * Includes a file in every JavaScript context with redux loaded that exists or that will exist.
 */
var includeGlobal = redux.fn.includeGlobal;
/**
 * Includes and parses one or more RJSS files. Styles will be applied to any elements you create after calling this.
 */
var includeRJSS = redux.fn.includeRJSS;
/**
 * Includes a RJSS file in every JavaScript context with redux loaded that exists or that will exist.
 */
var includeRJSSGlobal = redux.fn.includeRJSSGlobal;

/**
 * Include any normal files or RJSS files from before this context existed.
 */
(function () {
    var rjssFiles = redux.data.global.getrjss() || [];
    for (var i = 0; i < rjssFiles.length; i++) {
        includeRJSS(rjssFiles[i]);
    }
    var files = redux.data.global.getfiles() || [];
    for (var j = 0; j < files.length; j++) {
        include(files[j]);
    }
})();
/**
 * Create a shorthand for redux itself -- $, if it is available.
 */
this.$ = this.$ || redux;
