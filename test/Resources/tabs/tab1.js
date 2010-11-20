Ti.include('../redux.js');

var window = Ti.UI.currentWindow;

info(window.left);

var label = new Label({ id: 'Label1', className: 'big_text red_text' });

window.add(label);