// We do this at the top of all of our files to include redux:
Ti.include('redux.js');

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
Ti.include('tabs/tab1.js', 'tabs/tab2.js');
tabGroup.addTab(createTab1());
tabGroup.addTab(createTab2());
tabGroup.open();

info('TAB GROUPS: Finished opening all tab groups!');