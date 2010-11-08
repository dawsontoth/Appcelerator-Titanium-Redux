/*!
 * Appcelerator Redux v1 by Dawson Toth
 * http://tothsolutions.com/
 */
/**
 * Create shorthands for commonly used functions. Meant to ease transition from a different development
 * environment. I'm used to console.log('everything'), and type it by instinct.
 */
var info = Titanium.API.info;
var error = Titanium.API.error;
var warn = Titanium.API.warn;
var log = info;
var console = {
    log: log
};

/**
 * Enhanced include. Pass it an array of file paths or a single path, and it will include each of them using Ti.include(path).
 * @param {Object} args A single path or an array of paths to include
 */
function include(args){
    if (args instanceof Array) {
        for (var i in args) {
            if (!args.hasOwnProperty(i)) {
                continue;
            }
            Titanium.include(args[i]);
        }
    }
    else {
        Titanium.include(args);
    }
};

/** 
 * Enhance Ti.UI objects -- easy constructors, default values, easy events, and pseudo CSS styling.
 */
var elements = ['2DMatrix', '3DMatrix', 'ActivityIndicator', 'AlertDialog', 'Animation', 'Button', 'ButtonBar', 'CoverFlowView', 'DashboardItem', 'DashboardView', 'EmailDialog', 'ImageView', 'Label', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow', 'ProgressBar', 'ScrollView', 'ScrollableView', 'SearchBar', 'Slider', 'Switch', 'Tab', 'TabGroup', 'TabbedBar', 'TableView', 'TableViewRow', 'TableViewSection', 'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window'];
for (var i in elements) {
    if (!elements.hasOwnProperty(i)) {
        continue;
    }
    (function(element){
        var defaults = {};
        
        /**
         * Add easy constructors.
         *
         * Example:
         * var label = new Label(optional args);
         * Instead of:
         * var label = Ti.UI.createLabel(optional args);
         * @param {Object} args
         */
        this[element] = function cstor(args){
            if (!(this instanceof arguments.callee)) {
                return new cstor(args);
            }
            if (args == null) {
                args = defaults;
            }
            else {
                for (var index in defaults) {
                    if (defaults.hasOwnProperty(index) && typeof args[index] == "undefined") {
                        args[index] = defaults[index];
                    }
                }
            }
            return Titanium.UI['create' + element](args);
        };
        
        /**
         * Default properties for this UI element; only applies to instances you create after calling setDefault.
         *
         * Example:
         * Label.setDefault({ left: 1, right: 2 });
         * var label = new Label({ left: 3 });
         * alert(label.left == 3 && label.right == 2);
         *
         */
        this[element].setDefault = function(args){
            defaults = args;
        };
        this[element].getDefault = function(){
            return defaults;
        };
    })(elements[i]);
}
