function createTab1() {
    var win = new Window({ id: 'Window1' });
    var tab = new Tab({ id: 'Tab1', window: win });
    
    var label = new Label({ id: 'Label1', className: 'big_text red_text' });
    label.text = formatDate(new Date());
    win.add(label);

    // RJSS rules are inherited in the order that are defined, and conflicts are overridden by the last
    // declaration. Past that, the level of rule defines what is used: Explicit Style -> By ID -> By Class -> By Type 
    win.add(new Button({ id: 'red_button', className: 'red_button' }));

    // Styles can also be applied after an object is created.
    var button2 = new Button({ id: 'blue_button' });
    $(button2)
        .applyStyle('Button', { id: 'blue_button', className: 'blue_button'})
        .click(function() { alert('Button 2 Clicked!'); });
    win.add(button2);

    // And they can be applied to any sort of object!
    var anything = {};
    $(anything).applyStyle('Button', { className: 'red_button'});

    win.add(new Label({ id: 'buttonsLabel', color: '#FFFF00' }));
    
    return tab;
}