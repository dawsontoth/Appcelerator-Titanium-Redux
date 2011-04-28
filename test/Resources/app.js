// We do this at the top of all of our files to include redux:
Ti.include('redux.js');

// Include our utilities in every JS context
includeGlobal('includes/utilities.js');

// Include our RJSS
includeRJSSGlobal('rjss/common.rjss', 'rjss/localize.rjss');

// Tell the compiler which modules we are going to use; note there are no () on these!
var used = [Ti.UI.createTabGroup, Ti.UI.createWindow, Ti.UI.createTab, Ti.UI.createLabel, Ti.Platform.locale];

// Create tab group
var tabGroup = new TabGroup();

// Add two tabs
tabGroup.addTab(new Tab({
    id: 'Tab1',
    window: new Window({
        id: 'Window1',
        url: 'tabs/tab1.js'
    })
}));
tabGroup.addTab(new Tab({
    id: 'Tab2',
    window: new Window({
        id: 'Window2',
        url: 'tabs/tab2.js'
    })
}));

// Open the tab group
tabGroup.open();

info('TAB GROUPS: Finished opening all tab groups!');