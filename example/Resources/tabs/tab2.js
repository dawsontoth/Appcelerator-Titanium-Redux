exports.create = function () {
    var win = new Window({ id: 'Window2' });
    var tab = new Tab({ id: 'Tab2', window: win });

    win.add(new Label({ id: 'Label2', className: 'big_text green_text' }));

    checkInternet();

    return tab;
};