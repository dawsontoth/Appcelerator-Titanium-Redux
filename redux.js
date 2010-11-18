/*!
* Appcelerator Redux v5 by Dawson Toth
* http://tothsolutions.com/
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
    global: {
        /* dynamically generated based on variables in Ti.App.redux */
    }
};
for (var i in { jss: '', files: '', parsedjss: '' }) {
    (function (i) {
        redux.data.global['get' + i] = function () {
            if (!Ti.App['redux-' + i]) {
                return [];
            }
            return JSON.parse(Ti.App['redux-' + i]);
        };
        redux.data.global['set' + i] = function (value) { Ti.App['redux-' + i] = JSON.stringify(value); };
    })(i);
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
        var files = redux.data.global.getfiles();
        for (var i = 0; i < arguments.length; i++) {
            if (!redux.fn.contains(arguments[i], files)) {
                files.push(arguments[i]);
                redux.data.global.setfiles(files);
                include(arguments[i]);
            }
        }
    },
    /**
    * Turns a string of JSS into JavaScript that can be safely evaluated. JSS is a way to create JavaScript
    * objects quickly, and is primarily used to style your UI elements.
    * 
    * Inspired by, but not derived from, John Resig's Micro-Templating
    * http://ejohn.org/blog/javascript-micro-templating/
    *
    * @param {String} The raw JSS contents to parse into executable JavaScript
    * @returns Executable JavaScript
    */
    parseJSS: function (file) {
        var parsedJSS = redux.data.global.getparsedjss();
        if (parsedJSS[file]) {
            return parsedJSS[file];
        }
        var parsed = ('\n' + Ti.Filesystem.getFile(file).read())
            .split('}').join('});') // close off everywhere we find a curly brace (yes, even nested braces)
            .replace(/}\);\s*}\);/gm, '}}\);').replace(/}\);,/g, '},') // fix any nested braces that we over closed
            .replace(/\n\s+/gm, '\n') // remove extra white space
            .split('=').join('==') // replace the equal signs in attributes with the proper comparison operator
            .split('!==').join('!=') // fix extra equal sign we added to inequality operator
            .split('[').join('[Ti.') // add the Ti. namespace to all attributes
            .replace(/\n\[([^\]]+)\]/gm, 'if($1)\n') // finish replacing attributes with an if statement
            .replace(/\n\.([^{]+)\s*\{/gm, 'redux.fn.setDefaultByClassName("$1".split(" ").join(""),{') // replace all .classNames with a call to redux.setDefaultByClassName
            .replace(/\n#([^{]+)\s*\{/gm, 'redux.fn.setDefaultByID("$1".split(" ").join(""),{') // replace all #ids with a call to redux.fn.setDefaultByID
            .replace(/\n([a-zA-Z0-9_-]+)\s*\{/gm, 'redux.fn.setDefaultByType("$1",{');   // replace the other selects with a call to redux.fn.setDefaultByType
        parsedJSS[file] = parsed;
        redux.data.global.setparsedjss(parsedJSS);
        return parsed;
    },
    /**
    * Includes and parses one or more JSS files. Styles will be applied to any elements you create after calling this.
    * @param {Array} One or more JSS files to include and parse
    */
    includeJSS: function () {
        for (var i = 0; i < arguments.length; i++) {
            eval(redux.fn.parseJSS(arguments[i]));
        }
    },
    /**
    * Includes and parses one or more JSS file in every JavaScript context that will exist, so long as
    * redux is loaded within it.
    * @param {Array} One or more JSS files to include globally
    */
    includeJSSGlobal: function () {
        var files = redux.data.global.getjss();
        for (var i = 0; i < arguments.length; i++) {
            if (!redux.fn.contains(arguments[i], files)) {
                files.push(arguments[i]);
                redux.data.global.setjss(files);
                redux.fn.includeJSS(arguments[i]);
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
        if (original == null)
            return overrider || {};
        if (overrider == null)
            return original;
        for (var index in overrider) {
            if (!overrider.hasOwnProperty(index))
                continue;
            if (typeof original[index] == 'undefined')
                original[index] = overrider[index];
            else if (typeof overrider[index] == 'object') {
                original[index] = mergeObjects(original[index], overrider[index]);
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
            if (arguments.length == 0) {
                for (var i = 0; i < this.context.length; i++) {
                    this.context[i].fireEvent(event, arguments[0]);
                }
            }
            else if (arguments[0] instanceof Function) {
                for (var i = 0; i < this.context.length; i++) {
                    this.context[i].addEventListener(event, arguments[0]);
                }
            }
            else {
                for (var i = 0; i < this.context.length; i++) {
                    this.context[i].fireEvent(event, arguments[0]);
                }
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
            }
            else if (!redux.fn.contains(element, maps.byClassName[element.className])) {
                maps.byClassName[element.className].push(element);
            }
        }
        if (!maps.byType[element.toString()]) {
            maps.byType[element.toString()] = [];
            maps.byType[element.toString()].push(element);
        }
        else if (!redux.fn.contains(element, maps.byType[element.toString()])) {
            maps.byType[element.toString()].push(element);
        }
    },
    /**
    * Set the default properties for an element with a particular ID.
    * @param {Object} id
    * @param {Object} defaults
    */
    setDefaultByID: function (id, defaults) {
        redux.data.defaults.byID[id] = this.mergeObjects(redux.data.defaults.byID[id], defaults);
    },
    /**
    * Set the default properties for all elements with a particular class name.
    * @param {Object} className
    * @param {Object} defaults
    */
    setDefaultByClassName: function (className, defaults) {
        redux.data.defaults.byClassName[className] = this.mergeObjects(redux.data.defaults.byClassName[className], defaults);
    },
    /**
    * Set the default properties for all elements of a particular type.
    * @param {Object} type
    * @param {Object} defaults
    */
    setDefaultByType: function (type, defaults) {
        redux.data.defaults.byType[type] = this.mergeObjects(redux.data.defaults.byType[type], defaults);
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
    if (!redux.data.types.hasOwnProperty(i)) {
        continue;
    }
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
                if (args && args.className && redux.data.defaults.byClassName[args.className]) {
                    args = redux.fn.mergeObjects(args, redux.data.defaults.byClassName[args.className]);
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
                redux.fn.setDefaultByType(type, args);
            };
        })(i, redux.data.types[i][j]);
    }
}


/**
* Includes a file in every JavaScript context with redux loaded that exists or that will exist.
*/
var includeGlobal = redux.fn.includeGlobal;
/**
* Includes and parses one or more JSS files. Styles will be applied to any elements you create after calling this.
*/
var includeJSS = redux.fn.includeJSS;
/**
* Includes a JSS file in every JavaScript context with redux loaded that exists or that will exist.
*/
var includeJSSGlobal = redux.fn.includeJSSGlobal;

/**
* Include any normal files or JSS files from before this context existed.
*/
(function () {
    var jssFiles = redux.data.global.getjss();
    for (var i = 0; i < jssFiles.length; i++) {
        includeJSS(jssFiles[i]);
    }
    var files = redux.data.global.getfiles();
    for (var i = 0; i < files.length; i++) {
        include(files[i]);
    }
})();
/**
* Create a shorthand for redux itself -- $, if it is available.
*/
this.$ = this.$ || redux;