enyo.kind({
	name:"extras.TypeAheadInput",
	classes:"extras-typeahead-input",

	//* Events
	events:{
		onAcceptSuggestion:""
	},

	//* Properties
	published:{
		value: "",
		suggestion:""
	},
	suggestionChanged:function() {
		this.$.shadow.set("value", this.suggestion);
	},

	//* Components
	bindings: [
		// only a one-way binding because this.value will be updated onblur
		{from:".value", to:".$.main.value", transform:function(v) { return v || ""; }},
	],
	tools:[
		{name:"shadow", kind:"onyx.Input", classes:"shadow", oninput:"shadowInput", onfocus:"shadowFocused", attributes:{tabindex:"-1"}},
		{name:"main", kind:"onyx.Input", classes:"primary", onkeydown:"mainKeydown", onflick:"flicked", onblur:"blurred", onfocus:"mainFocused", oninput:"mainInput", ontap:"mainTapped"},
		{name:"delegator", kind:"extras.Delegator", members:["placeholder", "value", "type", "disabled", "selectOnFocus", "clear", "focus", "hasFocus", "selectContents"]}
	],

	//* Lifecycle
	create: enyo.inherit(function(sup) {
		return function create() {
			sup.apply(this, arguments);
			this.$.delegator.setDelegatee(this.$.main);
		};
	}),
	initComponents: enyo.inherit(function(sup) {
		return function initComponents() {
			this.createComponents(this.tools, {owner:this});
			sup.apply(this, arguments);
		};
	}),

	//* Handlers
	shadowFocused:function(source, event) {
		this.$.main.focus();
	},
	mainFocused:function() {
		this.suggestionChanged();
	},
	mainKeydown:function(source, event) {
		if(event.which == 9 && this.suggestion && this.suggestion !== this.$.main.get("value")) {
			this.applySuggestion();
			event.preventDefault();
			return true;
		}
	},
	shadowInput:function() {
		// should never be hit
		return true;
	},
	mainInput:function() {
		this.setSuggestion("");
	},
	mainTapped: function() {
		var v = this.$.shadow.get("value");
		if(v) {
			this.applySuggestion();
		}
	},
	flicked:function(source, event) {
		var x = event.xVelocity,
			y = event.yVelocity,
			m = (x) ? y/x : Infinity;

		if( x > 0 && (m < 1 && m > -1) && enyo.platform.touch ) {
			this.applySuggestion();
			return true;
		}
	},
	blurred:function() {
		this.set("value", this.$.main.get("value"));
		this.set("suggestion", "");
	},

	//* Utility
	applySuggestion:function() {
		var v = this.$.main.get("value");
		this.$.main.set("value", this.suggestion);
		this.set("suggestion", "");
		this.doAcceptSuggestion({priorValue:v, value:this.suggestion});
	},
});
