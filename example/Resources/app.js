// Let Redux inject in to the current context.
require('redux').inject(this);

// Include our utilities.
Ti.include('includes/utilities.js');

// Include our RJSS
includeRJSS('rjss/common.rjss', 'rjss/localize.rjss');

// Tell the compiler which modules we are going to use; note there are no () on these so they will not execute!
var used = [
    Ti.UI.createTabGroup, Ti.UI.createWindow, Ti.UI.createTab, Ti.UI.createLabel, Ti.UI.createButton, Ti.Platform.locale
];

// Create the tab group.
var tabGroup = new TabGroup();
tabGroup.addTab(require('tabs/tab1').create());
tabGroup.addTab(require('tabs/tab2').create());
tabGroup.open();

info('TAB GROUPS: Finished opening all tab groups!');