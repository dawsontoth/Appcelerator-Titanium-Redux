/*!
* Appcelerator Redux v2 by Dawson Toth
* http://tothsolutions.com/
*/

/**
* Create shorthand for commonly used functions.
*/
var info = Titanium.API.info;
var error = Titanium.API.error;
var warn = Titanium.API.warn;
var log = Titanium.API.log;
var include = Titanium.include;

/**
* Provide a wrapper context around Titanium's UI elements, like jQuery does for HTML elements.
*/
function $(element) {
    if (!(this instanceof arguments.callee)) {
        return new $(element);
    }
    this.element = element;
}

/** 
* Enhance Ti.UI events -- shorthand and adding custom shorthand.
*/
var events = [
    'beforeload', 'blur', 'change', 'click', 'close', 'dblclick', 'delete', 'doubletap',
    'focus', 'load', 'move', 'open', 'return', 'scroll', 'scrollEnd', 'selected', 'singletap',
    'swipe', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'twofingertap'];
function addEventBinder(event) {
    $.prototype[event] = function () {
        if (arguments.length == 0) {
            this.element.fireEvent(event, arguments[0]);
        }
        else if (arguments[0] instanceof Function) {
            this.element.addEventListener(event, arguments[0]);
        }
        else {
            this.element.fireEvent(event, arguments[0]);
        }
        return this;
    };
}
/** 
* Add shorthand events.
*
* Example:
* var textField = new TextField();
* // listen for the 'change' event
* $(textField).change(function() { info('changed!'); });
* // fire the 'change' event without arguments
* $(textField).change();
* // fire the 'change' event with arguments
* $(textField).change({ source: 'Your Mom' });
*/
for (var i = 0; i < events.length; i++) {
    addEventBinder(events[i]);
}
/**
* Adding custom shorthand.
*
* Example:
* $.addEvent('myEvent');
* var textField = new TextField();
* $(textField).myEvent();
*/
$.addEvent = function (event) {
    addEventBinder(event);
};

/** 
* Enhance Ti.UI objects -- easy constructors and default values.
*/
var elements = [
    '2DMatrix', '3DMatrix', 'ActivityIndicator', 'AlertDialog', 'Animation', 'Button',
    'ButtonBar', 'CoverFlowView', 'DashboardItem', 'DashboardView', 'EmailDialog',
    'ImageView', 'Label', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow',
    'ProgressBar', 'ScrollView', 'ScrollableView', 'SearchBar', 'Slider', 'Switch',
    'Tab', 'TabGroup', 'TabbedBar', 'TableView', 'TableViewRow', 'TableViewSection',
    'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window'];
function mergeObjects(original, overrider) {
    if (original == null)
        original = {};
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
}
for (var i in elements) {
    if (!elements.hasOwnProperty(i)) {
        continue;
    }
    (function (element) {
        var defaults = {};
        /**
        * Add easy constructors.
        *
        * Example:
        * var label = new Label(optional args);
        * Instead of:
        * var label = Ti.UI.createLabel(optional args);
        */
        this[element] = function cstor(args) {
            if (!(this instanceof arguments.callee)) {
                return new cstor(args);
            }

            // merge in the defaults particular to this element's ID
            if (args && args.id && $.defaultForIDStore[args.id]) {
                args = mergeObjects(args, $.defaultForIDStore[args.id]);
            }
            // merge in the defaults particular to this type of element
            args = mergeObjects(args, defaults);

            return Titanium.UI['create' + element](args);
        };
        /**
        * Default properties for this UI element; only applies to instances you create after calling setDefault.
        *
        * Example:
        * Label.setDefault({ left: 1, right: 2 });
        * var label = new Label({ left: 3 });
        * alert(label.left == 3 && label.right == 2);
        */
        this[element].setDefault = function (args) {
            defaults = args;
        };
        this[element].getDefault = function () {
            return defaults;
        };
    })(elements[i]);
}
/**
* Default properties for an element with a particular ID.
*/
$.defaultForIDStore = {};
$.setDefault = function (id, defaults) {
    this.defaultForIDStore[id] = defaults;
};

/**
* JSS -- separate and simplify all the design related properties you use in your UI elements.
*
* With this particular version of JavaScript Style Sheets, you can leverage several CSS like
* selectors to define the default properties for your UI elements created through Redux.
* 1) By element type (like Label, or Window)
* 2) By ID (as defined when you make the object, new Button({ id: 'helloWorld' }))
* 3) By Titanium variable attribute comparison ([Platform.osname="android"] will only match on Android devices)
*
* Example:
// in your .js file
includeJSS('common.jss');
var label = new Label({ id: 'HelloWorld' });

// in your common.jss file
Window {
	backgroundColor: '#fff'
}
Label {
	backgroundColor: '#faa',
	color: '#333'
}
Label[Platform.osname="android"] {
	backgroundColor: '#aaf',
	color: '#666'
}
#HelloWorld {
	left: 15,
	right: 15,
	height: 70,
	top: 50
}
#HelloWorld[Platform.locale="en"] {
    text: 'Hello, World!'
}
#HelloWorld[Platform.locale="es"] {
    text: '¡Bienvenido, Mundo!'
}
*/
function includeJSS() {
    for (var i = 0; i < arguments.length; i++) {
        var handle = Ti.Filesystem.getFile(arguments[i]);
        var contents = handle.read();
        eval(parseJSS(contents));
    }
}
/**
* Turns a string of JSS into a string that can be safely evaluated.

* Inspired by, but not derived from, John Resig's Micro-Templating
* http://ejohn.org/blog/javascript-micro-templating/
*/
function parseJSS(contents) {
    return (';' + contents) // prefix ; to eliminate fringe case
        .split('}').join('});') // close off everywhere we find a curly brace (yes, even nested braces)
        .replace(/}\);\s*}\);/igm, '}}\);') // fix any nested braces that we over closed
        .split('=').join('==') // replace the equal signs in attributes with the proper comparison operator
        .split('!==').join('!=') // fix extra equal sign we added to inequality operator
        .split('[').join('[Ti.') // add the Ti namespace to all attributes
        .replace(/;(\s*.+?)\[(.+?)\]\s*{/igm, ';if($2)$1{') // finish replacing attributes with an if statement
        .replace(/\#([a-z0-9_-]+)\s*{/igm, '$.setDefault("$1",{') // replace all #ids with a call to $.setDefault
        .replace(/(\s*[a-z0-9_-]+)\s*{/igm, '$1.setDefault({'); // replace the other selects with a call their.setDefault
}