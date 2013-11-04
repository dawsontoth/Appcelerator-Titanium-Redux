/**
 * compiler test case
 */
var should = require('should'),
    mockti = require('mockti');

describe('redux', function () {
    var redux;
    
    before(function () {
        this.Titanium = this.Ti = mockti();
    });

    it('should require', function () {
        redux = require('../redux');
        redux.inject(this);
    });

    it('should inject shorthands', function () {
        should.exist(this.info);
        should.exist(this.error);
        should.exist(this.warn);
        should.exist(this.log);
        should.exist(this.currentWindow);
        should.exist(this.currentTab);
        should.exist(this.win);
        should.exist(this.tab);
        should.exist(this.includeRJSS);
        should.exist(this.inject);
        should.exist(this.$);
        should.exist(this.R);
    });

    it('should call Ti.API.info/warn/error/log', function () {
        Ti.API.addEventListener('function::info', curryAssertFirstParameter('called info'));
        Ti.API.addEventListener('function::warn', curryAssertFirstParameter('called warn'));
        Ti.API.addEventListener('function::error', curryAssertFirstParameter('called error'));
        Ti.API.addEventListener('function::log', curryAssertFirstParameter('called log'));
        this.info('called info');
        this.info('called warn');
        this.info('called error');
        this.info('called log');
    });

    it('should inject constructors', function () {
        var params = { text: 'Label Text' };
        should.exist(this.Label);
        Ti.UI.addEventListener('function::createLabel', curryAssertFirstParameter(params));
        var label = new this.Label(params);
        label.should.have.property('text', params.text);
    });

    it('should allow creating constructors', function () {
        var params = { top: 10 },
            Paint = {
                createView: function (args) {
                    args.should.eql(params);
                }
            };
        should.not.exist(this.PaintView);
        redux.fn.addNaturalConstructor(this, Paint, 'View', 'PaintView');
        should.exist(this.PaintView);

        var paintView = new this.PaintView(params);
        should.exist(paintView);
    });

    it('should shorten event binding', function () {
        var clicked = 0,
            button = new this.Button({ title: 'Click Me!' });
        this.R(button)
            .click(function () {
                clicked++;
            })
            .click()
            .click({ src: 'me' });

        clicked.should.equal(2);
    });
    
    it('should support adding multiple children', function() {
        var window = new this.Window(),
            label1 = new this.Label(),
            label2 = new this.Label();
        this.R(window).add(label1, label2);
        window.should.have.property('children').with.lengthOf(2);
        window.children[0].should.equal(label1);
        window.children[1].should.equal(label2);
    });

    it('rjss should support styling', function () {
        var params = {
            backgroundColor: '#fff'
        };
        eval(redux.fn.parseRJSS('Window ' + JSON.stringify(params)));
        Ti.UI.addEventListener('function::createWindow', curryAssertFirstParameter(params));
        var window = new this.Window();
        window.should.have.property('backgroundColor', params.backgroundColor);
    });

    it('rjss should support variables', function () {
        var params = { backgroundColor: '#fff' },
            parsed = redux.fn.parseRJSS('$mainColor = "#fff";\nWindow { backgroundColor: $mainColor }');
        eval(parsed);
        Ti.UI.addEventListener('function::createWindow', curryAssertFirstParameter(params));
        var window = new this.Window();
        window.should.have.property('backgroundColor', params.backgroundColor);
    });

    it('should be able to clone with a null property', function () {
        var expected = { nullValue: null },
            actual = redux.fn.clone(expected);
        actual.should.eql(expected);
    });

    /*
     Utility.
     */
    function curryAssertFirstParameter(expected) {
        return function (actual) {
            actual.should.eql(expected);
        };
    }
});