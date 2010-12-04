Ti.include('redux.js');

/* Include our RJSS */
includeRJSSGlobal('rjss/common.rjss');
includeRJSSGlobal('rjss/localize.rjss');

/* Tell the compiler which packages we are going to use */
Ti.UI.createTabGroup;
Ti.UI.createWindow;
Ti.UI.createTab;
Ti.UI.createLabel;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = new TabGroup();

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

// open tab group
tabGroup.open();