JS Toolbox
==========

Author: Rich Hildred forked from [Jimmy Do](https://github.com/jimmydo/js-toolbox)

License: MIT

Class based inheritance in the style of BackBone in JavaScript code for Node.js.

index.js
----------

`npm install js-toolbox`

Provides a primitive base class (Toolbox.Base) for class-based inheritance. Install with `npm install js-toolbox --save`.
Based on code from Backbone (http://documentcloud.github.com/backbone/).

	var Toolbox = require('js-toolbox');
	var assert = require('assert');
	
	var Animal = Toolbox.Base.extend({
	    constructor: function (name) {
	        this._name = name;
	    },
	    sayName: function () {
	        return('Hi, my name is ' + this._name);
	    }
	});

	var oAnimal = new Animal("Tony the Tiger");
	assert(oAnimal.sayName() === 'Hi, my name is Tony the Tiger');

Depends on:
- extend (https://github.com/justmoon/node-extend)
