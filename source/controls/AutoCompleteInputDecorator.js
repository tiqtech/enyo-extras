enyo.kind({
	name: "extras.AutoCompleteInputDecorator",
	kind: "onyx.InputDecorator",
	handlers: {
		oninput: "input",
		onSelect: "itemSelected",
		onkeyup: "keyUp",
		onHighlight: "itemHighlighted"
	},
	published: {
		values: "",
		filtered:true,
		maxResults:5,
		caseSensitive:false,
		delay: 200,
		//* private ... needed to support Menu ...
		active: false
	},
	events: {
		onInputChanged: "",
		onValueSelected: ""
	},
	tools:[
		{name: "popup", kind: "extras.Menu", floating: true}
	],
	initComponents:function() {
		this.inherited(arguments);
		this.createComponents(this.tools, {owner:this});
	},
	input: function(source, event) {
		// cache input instance. means we only support a single input but that's probably okay.
		// works around a bug where originator is Menu rather than Input
		this.inputField = this.inputField || event.originator;
		enyo.job(null, enyo.bind(this, "fireInputChanged"), this.delay);
	},
	fireInputChanged: function() {
		this.doInputChanged({value: this.inputField.getValue()});
		this.renderValues();
	},
	receiveBlur:function() {
		this.inherited(arguments);
		
		enyo.job(null, enyo.bind(this, function() {
			this.waterfall("onRequestHideMenu", {activator: this});
		}), 500);
	},
	valuesChanged: function() {
		this.renderValues();
	},
	renderValues:function() {
		var v = this.inputField && this.inputField.getValue();
		if(v && this.values && this.values.length > 0) {
			this.$.popup.destroyClientControls();
			var c = [];
			for (var i = 0; i < this.values.length && c.length < this.maxResults; i++) {
				if(!this.filtered || this.filter(v, this.values[i])) {
					c.push({content: this.values[i]});
				}
			}
			
			if(c.length > 0 && !(c.length == 1 && this.matches(c[0].content, v))) {
				this.$.popup.createComponents(c);
				this.$.popup.render();
				this.waterfall("onRequestShowMenu", {activator: this});
			} else {
				// this block would occur if the menu is showing and
				// the values where changed but none matched the filter
				this.waterfall("onRequestHideMenu", {activator: this});
			}
		} else {
			this.waterfall("onRequestHideMenu", {activator: this});
		}
	},
	matches:function(input, value) {
		if(this.caseSensitive) {
			return input == value;
		} else {
			return String(input).toLowerCase() == String(value).toLowerCase();
		}
	},
	escapeRegExp:function(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},
	filter:function(input, value) {
		return new RegExp(this.escapeRegExp(input), this.caseSensitive ? "g" : "ig").test(value);
	},
	itemSelected: function(source, event) {
		this.log("selected");
		this.inputField.setValue(event.content);
		this.doValueSelected({ value: event.content, index: source.index });
	},
	keyUp:function(source, event) {
		if(source instanceof onyx.Menu) return;
		
		switch(event.which) {
			case 13:
				this.onEnter(this.inputField.getValue());
				event.preventDefault();
				break;
			case 38:
				this.$.popup.previousItem();
				event.preventDefault();
				break;
			case 40:
				this.$.popup.nextItem();
				event.preventDefault();
				break;
		}
	},
	onEnter:function() {
		this.inputField.focus();
		this.$.popup.hide();
	},
	itemHighlighted:function(source, event) {
		this.inputField.setValue(event.content);
		this.inputField.focus();
	}
});