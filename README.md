Redux has a simple goal:
To reduce the amount of code you need to write when using Appcelerator Titanium.

To use its features, include the redux.js file at the top of your app.js and every child window's js:

<pre>
Ti.include('redux.js');
</pre>


FEATURES
====================


SHORTHAND FOR COMMON FUNCTIONS
---------------------

Some functions you use all the time. Redux makes them shorter, and easier to type.

**Normal Code**					
<pre>Titanium.API.info('hi');		
Titanium.API.error('hi');		
Titanium.API.warn('hi');		
Titanium.API.log('hi');
Titanium.UI.currentWindow;
Titanium.UI.currentTab;</pre>

**Redux Code**		
<pre>info('hi');		
error('hi');		
warn('hi');		
log('hi');
inc('foo.js');
currentWindow(); // or...
win();
currentTab(); // or...
tab();</pre>

Note that currentWindow, win, currentTab, and tab are all functions that return a reference to Ti.UI.currentWindow
or Ti.UI.currentTab. I did it this way because the current window and tab can change as you open and close windows. By making
them functions, you always have access to the real "current" window or tab.


UI CONSTRUCTION
---------------------

Create new Ti elements using the new Constructor() syntax you're used to in JavaScript.
Note that by making your elements this way, you also get to take advantage of other
Redux features like JSS, default properties, and more. You can use this syntax for any
element normally created using the syntax Ti.\*.create\*. For example, Ti.Network.createHTTPClient()
and Ti.UI.createLabel() could instead by new HTTPClient() or new Label(), respectively.

**Normal Code**		
<pre>var label = Titanium.UI.createLabel();</pre>

**Redux Code**		
<pre>var label = new Label();</pre>

**Warning**
Titanium optimizes your installation packages based on what Titanium elements you use. By using redux,
it can't tell which to include or exclude. But we can fix this easily by giving it blatant hints in our app.js,
like this:

<pre>
/* Trick Titanium into including the packages we want */
var used = [Titanium.UI.createLabel, Titanium.UI.createWebView, Ti.Platform.locale];
</pre>

Now we can use the short redux constructors and locale constant in our RJSS without worrying about Titanium accidentally
excluding something we are using.

Note that we put them in a "user" array so that JSLint won't complain.


USING EASY CONSTRUCTORS AND STYLING ON YOUR OWN OBJECTS AND MODULES
---------------------

Module support is really easy to add to redux:

**Redux Code**
<pre>Titanium.Painter = require('ti.paint'); // include the paint module
redux.fn.addNaturalConstructor(this, Titanium.Painter, 'View', 'Canvas');
var canvas = new Canvas(); // eq to calling Titanium.Painter.createView(), but with RJSS applied!</pre>

There is full RJSS support for these newly created natural constructors. That means you could put a style like the
following in your RJSS, and it would get applied to the object we just made:

**Redux RJSS Code**
<pre>Canvas { backgroundColor: 'red' }</pre>

Styling your own objects with RJSS is very straightforward, if you don't want to add the full easy constructors:

**Redux Code**
<pre>var args = redux.fn.style('Label', { id: 'Label1' });
// args is now a plain object with all your RJSS included
// pass it to a normal label creation call:
var styledLabel = Ti.UI.createLabel(args);</pre>


UI PROPERTY DEFAULTS BY ELEMENT TYPE
----------------------------------------------

You can specify default properties for your UI elements. This lets you specify properties
in one place, and for multiple elements. This is especially useful for application wide
settings, like fonts and colors, but also useful to help you keep your design logic out of
your business logic. Note that property defaults by element type are considered less
important than property defaults by ID or properties passed in to the constructor, and can be
overridden by either of these.

**Normal Code**		
<pre>Not Supported</pre>		

**Redux Code**		
<pre>Label.setDefault({ font: {fontWeight: 'bold' } });		
var label = new Label();		
alert(label.font.fontWeight == 'bold');</pre>		


UI PROPERTY DEFAULTS BY SELECTOR
----------------------------------------------

Using a similar method to setting UI Property Defaults by Element Type, you can set them
for your UI elements by their IDs or class names. Note that property defaults by ID are considered more
important than default properties by element type and class names, and will override them.

**Normal Code**	
<pre>Not Supported</pre>	

**Redux Code**		
<pre>$.setDefault('#myID', { text: 'Hello, World!', color: 'red' });	
$.setDefault('.myClassName', { font: { fontSize: 12 }, color: 'green' });
var label = new Label({ id: 'myID', className: 'myClass', color: 'blue' });	
alert(label.text == 'Hello, World!');	
alert(label.color == 'blue');
alert(label.font.fontSize == 12);</pre>


EVENT BINDING
----------------------------------------------

Bind events in a more natural way. Note the wrapping $() and the fluent calls.

**Normal Code**	
<pre>var button = Titanium.UI.createButton({ title: 'Click Me!' });	
button.addEventListener('click', function() { alert('clicked!'); });	
button.fireEvent('click');	
button.fireEvent('click', {src: 'me'});</pre>	

**Redux Code**	
<pre>var button = new Button({ title: 'Click Me!' });	
$(button).click(function() { alert('clicked!'); })
         .click()
         .click({src: 'me'});</pre>	


You can add support for custom events.	
**Normal Code**	
<pre>button.addEventListener('myCustomEvent', function() { });</pre>	

**Redux Code**	
<pre>$.addEventBinder('myCustomEvent');	// only needs to be called once, then can be used again and again
$(button).myCustomEvent(function() { });</pre>	


RJSS
----------------------------------------------

RJSS, or Redux JavaScript Style Sheets, let you create CSS-like rules to style your UI elements.
Note that RJSS can only style elements you create using Redux's method of creating elements,
and that this isn't actual CSS.

**Normal Code**
Not Supported until Version 1.5 (even then, many features Redux has won't be supported)

**Redux Code** for Including RJSS from your app.js (or any .js file)
<pre>includeRJSS('common.rjss');</pre>

**Redux Code** for Styling Elements from common.rjss (or any .rjss file)
<pre>Window {
	backgroundColor: '#fff'
}
/* add comments! use familiar c style comment blocks like this one */
Label {
	backgroundColor: '#faa',
	color: '#333'
}
/* add an attribute that will act as a filter */
[Ti.Platform.osname="android"] Label {
	backgroundColor: '#aaf',
	color: '#666'
}
/* select by id */
#HelloWorld {
	left: 15,
	right: 15,
	height: 70,
	top: 50
}
/* by className */
.myClassName {
	text: 'Set by class name'
}
/* by multiple selectors */
.selector1, #selector2, Label {
	text: 'Set for all three selectors'
}
/* attribute with its own block */
[Ti.Platform.locale="en"] {
	#HelloWorld {
    		text: 'Hello, World!'
	}
	.myClassName {
		text: 'Set by class name'
	}
}
[Ti.Platform.locale="es"] {
	#HelloWorld {
		text: 'Bienvenido, Mundo!'
	}
	.myClassName {
		text: 'Establecido por el nombre de clase'
	}
}

</pre>


Here are some key features of RJSS to note--you'll want to use them:

- Include as many .rjss files as you need to keep yourself organized.
- Have as many rules as you need.
- Have multiple rules for a single element.
- Attributes can contain ANY valid Javascript -- [true], [false], [new Date().getDay()=1], as long as you don't use square braces [].
- Attributes can work negatively too -- [Ti.Platform.locale!="en"]
- White space doesn't matter; put it where you want it.
- You can localize your app using the [Ti.Platform.locale="language"] attribute.
- The includeRJSS function can take in multiple files or just one.
- ID rules have higher precedence than className rules, which have higher precedence than element rules.
- Chain selectors to reduce the amount of RJSS you need to write  -- Window, Label { backgroundColor: '#fff' }.
- Attributes can have code blocks so they control multiple rules -- [Ti.Platform.osname='iphone'] { #foo {} #bar {} }.
- Chain attributes for more complicated rules -- [Ti.Platform.osname="iphone"||Ti.Platform.osname="ipad"] Window { backgroundColor: '#bef'}.
- Specify multiple class names on your objects -- className: 'big_text red_text'.
- Add comments to your RJSS using /\* and \*/. Note that // comments are not supported.



DYNAMIC STYLING
----------------------------------------------

You can apply RJSS to elements after they are created. For example, you can use this to toggle a button between two
classNames when the user touches it.

**Normal Code**
Not Supported

**Redux Code**
<pre>var button = new Button({ className: 'Off' });
$(button).applyStyle('Button', { className: 'On' });</pre>



CONTACT INFORMATION
===========================

Redux was made by Dawson Toth from TothSolutions, LLC. (www.tothsolutions.com).
TothSolutions, LLC. uses Appcelerator every day to create mobile applications for
its clients, and created Redux to ease that process and give back to the community
that created Appcelerator.

We can be contacted through our website -- www.tothsolutions.com/Contact

Since making Redux, I was hired by Appcelerator, Inc. I'm now a full time professional
services engineer with them. Note that this doesn't mean Redux is officially supported.
If you have issues, PLEASE open an issue on GitHub and I will work on getting it resolved!

Don't contact Appcelerator with issues, or sue them (or me, please) if you have problems.