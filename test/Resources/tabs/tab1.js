// We do this at the top of all of our files to include redux:
Ti.include('../redux.js');

var label = new Label({ id: 'Label1', className: 'big_text red_text' });

win().add(label);

// call something in our utilities; note that we don't have to include the file in this context because
// it we did a "includeGlobal" in our app.js!
label.text = formatDate(new Date());

// ensure styles for RJSS are inherited in order they are defined and conflicts are overridden by last declaration
//   Explicit Style -> By ID -> By Class -> By Type 
var redButton = new Button({ id: 'red_button', className: 'red_button' });
var blueButton = new Button({ id: 'blue_button', className: 'blue_button' });
win().add(redButton);
win().add(blueButton);

// $(button1).applyStyle('Button', { className: 'blue_button'});
var buttonsLabel = new Label({ id: 'buttonsLabel', color: '#FFFF00' });
win().add(buttonsLabel);

info('Opened tab ' + tab().title);