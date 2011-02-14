// We do this at the top of all of our files to include redux:
Ti.include('../redux.js');

var label = new Label({ id: 'Label1', className: 'big_text red_text' });

win().add(label);

// call something in our utilities; note that we don't have to include the file in this context because
// it we did a "includeGlobal" in our app.js!
label.text = formatDate(new Date());

info('Opened tab ' + tab().title);